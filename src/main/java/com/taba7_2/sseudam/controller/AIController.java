package com.taba7_2.sseudam.controller;

import com.taba7_2.sseudam.model.AIAnalysisResult;
import com.taba7_2.sseudam.model.RankAccount;
import com.taba7_2.sseudam.repository.AIAnalysisResultRepository;
import com.taba7_2.sseudam.service.FirebaseAuthService;
import com.taba7_2.sseudam.service.RankCalculatorService;
import com.taba7_2.sseudam.service.RankingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final WebClient webClient;
    private final RankingService rankingService;
    private final RankCalculatorService rankCalculatorService;
    private final AIAnalysisResultRepository aiAnalysisResultRepository;
    private final FirebaseAuthService firebaseAuthService;

    public AIController(WebClient.Builder webClientBuilder, RankingService rankingService,
                        RankCalculatorService rankCalculatorService, AIAnalysisResultRepository aiAnalysisResultRepository, FirebaseAuthService firebaseAuthService) {
        this.webClient = webClientBuilder.baseUrl("http://127.0.0.1:5001").build();
        this.rankingService = rankingService;
        this.rankCalculatorService = rankCalculatorService;
        this.aiAnalysisResultRepository = aiAnalysisResultRepository;
        this.firebaseAuthService = firebaseAuthService;
    }

    /**
     * ✅ 각 객체별 confidence 값을 기반으로 포인트 계산 (-5 ~ +5)
     */
    private Map<String, Integer> calculateObjectPoints(double confidence) {
        int earned = 0;
        int deducted = 0;

        if (confidence >= 0.9) {
            earned = 5;
        } else if (confidence >= 0.85) {
            earned = 4;
        } else if (confidence >= 0.8) {
            earned = 3;
        } else if (confidence >= 0.75) {
            earned = 2;
        } else if (confidence >= 0.7) {
            earned = 1;
        } else if (confidence >= 0.6) {
            earned = 0;
        } else if (confidence >= 0.4) {
            deducted = -1;
        } else if (confidence >= 0.3) {
            deducted = -2;
        } else if (confidence >= 0.2) {
            deducted = -3;
        } else if (confidence >= 0.1) {
            deducted = -4;
        } else {
            deducted = -5;
        }

        return Map.of("earned", earned, "deducted", deducted);
    }

    /**
     * ✅ AI 분석 결과를 기반으로 포인트 총합 계산 (-5 ~ +5 범위 적용)
     */
    private Map<String, Integer> calculateTotalPoints(String userUid, List<Map<String, Object>> detectedObjects) {
        int totalEarned = 0;
        int totalDeducted = 0;

        for (Map<String, Object> obj : detectedObjects) {
            double confidence = (Double) obj.get("confidence");
            Map<String, Integer> points = calculateObjectPoints(confidence);

            totalEarned += points.get("earned");
            totalDeducted += points.get("deducted");
        }

        // ✅ 현재 사용자의 누적 포인트 가져오기
        int currentAccumulatedPoints = rankingService.getUserRanking(userUid).get().getAccumulatedPoints();

        // ✅ 감점이 누적 포인트보다 크면, 감점을 조정하여 총 포인트가 0 이하로 내려가지 않도록 함
        totalDeducted = Math.min(Math.abs(totalDeducted), currentAccumulatedPoints);

        return Map.of("earned", totalEarned, "deducted", totalDeducted);
    }

    @GetMapping("/results")
    public ResponseEntity<?> getAIResults(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam String selectedCategory // ✅ 사용자가 선택한 검사 카테고리
    ) {
        try {
            // ✅ Flask AI 서버에서 JSON 결과 가져오기
            Map<String, List<Map<String, Object>>> response = webClient.get()
                    .uri("/results")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            List<Map<String, Object>> processedResults = Optional.ofNullable(response)
                    .map(Map::values)
                    .flatMap(values -> values.stream().findFirst())
                    .orElse(null);

            if (processedResults == null || processedResults.isEmpty()) {
                return ResponseEntity.status(500).body(Map.of("error", "AI 분석 결과가 없습니다."));
            }

            // ✅ 사용자 UID & 아파트 ID 가져오기
            String userUid = firebaseAuthService.getUidFromToken(authorizationHeader);
            Long apartmentId = rankingService.getUserRanking(userUid).get().getApartmentId();

            // ✅ 감지해야 할 모든 재질 목록 (사용자가 선택한 검사 기준에 따라 다름)
            List<String> validMaterials = switch (selectedCategory) {
                case "plastic" -> List.of("plastic_PE", "plastic_PP", "plastic_PS", "plastic_bag", "PET_color");
                case "styrofoam" -> List.of("styrofoam");
                case "PET" -> List.of("PET_transparent");
                case "can" -> List.of("can_steel", "can_aluminium");
                case "glass" -> List.of("glass_brown", "glass_green", "glass_transparent");
                case "paper" -> List.of("paper");
                case "battery" -> List.of("battery");
                case "light" -> List.of("light");
                default -> new ArrayList<>();
            };

            // ✅ 전체 탐지된 객체 개수
            int totalDetectedObjects = processedResults.size();

            // ✅ 올바르게 분류된 객체 개수
            int correctlyClassifiedObjects = (int) processedResults.stream()
                    .filter(result -> validMaterials.contains(result.get("class")) && (Double) result.get("confidence") >= 0.7)
                    .count();

            // ✅ 잘못 분류된 객체 개수
            int incorrectlyClassifiedObjects = totalDetectedObjects - correctlyClassifiedObjects;

            // ✅ 2. 선택한 재질에 해당하는 confidence 값 합산
            double totalValidConfidence = processedResults.stream()
                    .filter(result -> validMaterials.contains(result.get("class"))) // ✅ 사용자가 선택한 재질만 포함
                    .mapToDouble(result -> (Double) result.get("confidence") * 100) // ✅ 퍼센트 변환
                    .sum();

            // ✅ 3. 최종 성공률 계산 (선택한 재질 합산 / 탐지된 전체 객체 개수)
            int finalSuccessRate = (totalDetectedObjects > 0)
                    ? (int) Math.round((correctlyClassifiedObjects * 100.0) / totalDetectedObjects)
                    : 0;

            // ✅ 최종 포인트 계산 (누적 포인트가 0 이하로 내려가지 않도록 조정)
            Map<String, Integer> points = calculateTotalPoints(userUid, processedResults);
            int earned = points.get("earned");
            int deducted = points.get("deducted");
            int finalPoints = earned - deducted;

            boolean isSuccess = finalSuccessRate >= 70;

            // ✅ 6. 검사 결과 DB 저장
            AIAnalysisResult aiResult = new AIAnalysisResult(
                    userUid, rankingService.getUserRanking(userUid).get().getAccumulatedPoints(),
                    finalSuccessRate, earned, deducted, selectedCategory, apartmentId
            );
            aiAnalysisResultRepository.save(aiResult);


            // ✅ 기존 사용자 포인트 정보 가져오기
            RankAccount userRank = rankingService.getUserRanking(userUid).orElseThrow();
            int previousAccumulatedPoints = userRank.getAccumulatedPoints();

            // ✅ 5. 포인트 업데이트
            rankingService.updateUserPoints(userUid, earned - deducted);

            // ✅ 성공률 계산
            int successRate = (totalDetectedObjects > 0) ? (int) ((correctlyClassifiedObjects / (double) totalDetectedObjects) * 100) : 0;

            // ✅ 업데이트 후 새로운 포인트 가져오기
            RankAccount updatedUserRank = rankingService.getUserRanking(userUid).orElseThrow();
            int updatedMonthlyPoints = updatedUserRank.getMonthlyPoints();
            int updatedAccumulatedPoints = updatedUserRank.getAccumulatedPoints();

            // ✅ 포인트 업데이트 전에 기존 등급 저장
            String previousGrade = rankCalculatorService.getGrade(rankingService.getUserRanking(userUid).get().getAccumulatedPoints());


            // ✅ 업데이트 후 새로운 등급 가져오기
            String newGrade = rankCalculatorService.getGrade(rankingService.getUserRanking(userUid).get().getAccumulatedPoints());

            // ✅ 등급이 상승했을 때만 프로모션 메시지 표시
            String promotionMessage = !previousGrade.equals(newGrade) ? "🎉 축하합니다! 등급이 상승했습니다." : "";

            // ✅ 프론트엔드 응답 데이터 구성
            Map<String, Object> resultResponse = new HashMap<>();
            resultResponse.put("totalDetectedObjects", totalDetectedObjects);
            resultResponse.put("correctlyClassifiedObjects", correctlyClassifiedObjects);
            resultResponse.put("incorrectlyClassifiedObjects", incorrectlyClassifiedObjects);
            resultResponse.put("earnedPoints", earned);
            resultResponse.put("deductedPoints", deducted);
            resultResponse.put("finalPoints", finalPoints);
            resultResponse.put("monthlyPoints", updatedMonthlyPoints);
            resultResponse.put("accumulatedPoints", updatedAccumulatedPoints);
            resultResponse.put("successRate", successRate);
            resultResponse.put("grade", newGrade);
            resultResponse.put("promotionMessage", promotionMessage);

// ✅ 응답 반환
            return ResponseEntity.ok(resultResponse);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "AI 서버 데이터 가져오기 실패", "details", e.getMessage()));
        }
    }
}