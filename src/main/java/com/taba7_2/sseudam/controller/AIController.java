package com.taba7_2.sseudam.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taba7_2.sseudam.model.AIAnalysisResult;
import com.taba7_2.sseudam.model.RankAccount;
import com.taba7_2.sseudam.repository.AIAnalysisResultRepository;
import com.taba7_2.sseudam.service.FirebaseAuthService;
import com.taba7_2.sseudam.service.HardwareService;
import com.taba7_2.sseudam.service.RankCalculatorService;
import com.taba7_2.sseudam.service.RankingService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final RankingService rankingService;
    private final RankCalculatorService rankCalculatorService;
    private final AIAnalysisResultRepository aiAnalysisResultRepository;
    private final FirebaseAuthService firebaseAuthService;
    private final HardwareService hardwareService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final SimpMessagingTemplate messagingTemplate;

    public AIController(RankingService rankingService,
                        RankCalculatorService rankCalculatorService,
                        AIAnalysisResultRepository aiAnalysisResultRepository,
                        HardwareService hardwareService,
                        FirebaseAuthService firebaseAuthService,
                        SimpMessagingTemplate messagingTemplate) {
        this.rankingService = rankingService;
        this.rankCalculatorService = rankCalculatorService;
        this.aiAnalysisResultRepository = aiAnalysisResultRepository;
        this.hardwareService = hardwareService;
        this.firebaseAuthService = firebaseAuthService;
        this.messagingTemplate = messagingTemplate;
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

    /**
     * ✅ Flask AI 서버에서 분석 결과를 받아 DB에 저장 + WebSocket으로 프론트에 즉시 응답
     */
    @PostMapping("/analysis-result")
    public ResponseEntity<?> receiveAIResults(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestBody Map<String, Object> aiResponse
    ) {
        try {
            System.out.println("📌 Received Token in Spring: " + authorizationHeader); // ✅ 토큰 확인
            // ✅ 1. 요청 데이터 확인 (디버깅)
            System.out.println("✅ AI 서버에서 받은 데이터: " + aiResponse);

            // ✅ 2. Authorization 헤더 검증
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(400).body(Map.of("error", "Missing or invalid Authorization token"));
            }

            String userUid = firebaseAuthService.getUidFromToken(authorizationHeader);

            // ✅ 3. 사용자 정보 가져오기 (예외 방지)
            Optional<RankAccount> userRankOpt = rankingService.getUserRanking(userUid);
            if (userRankOpt.isEmpty()) {
                return ResponseEntity.status(400).body(Map.of("error", "User ranking data not found"));
            }
            RankAccount userRank = userRankOpt.get();
            Long apartmentId = userRank.getApartmentId();

            // ✅ 4. AI 서버에서 전송한 데이터 검증
            if (!aiResponse.containsKey("detection_results")) {
                return ResponseEntity.status(400).body(Map.of("error", "Missing key: detection_results"));
            }

            Object detectedObjectsRaw = aiResponse.get("detection_results");
            List<Map<String, Object>> detectedObjects;

            if (detectedObjectsRaw instanceof List) {
                detectedObjects = (List<Map<String, Object>>) detectedObjectsRaw;
            } else {
                detectedObjects = new ArrayList<>();
            }

            // ✅ 5. PET 이외의 객체 제거 (현재 PET만 검사)
            String selectedCategory = "PET";
            List<String> validMaterials = List.of("PET_transparent");

            int totalDetectedObjects = detectedObjects.size();
            int correctlyClassifiedObjects = (int) detectedObjects.stream()
                    .filter(obj -> validMaterials.contains(obj.get("class")) && (Double) obj.get("confidence") >= 0.7)
                    .count();
            int incorrectlyClassifiedObjects = totalDetectedObjects - correctlyClassifiedObjects;

            // ✅ 6. 최종 성공률 계산
            int finalSuccessRate = (totalDetectedObjects > 0)
                    ? (int) Math.round((correctlyClassifiedObjects * 100.0) / totalDetectedObjects)
                    : 0;

            // ✅ 7. 최종 포인트 계산
            Map<String, Integer> points = calculateTotalPoints(userUid, detectedObjects);
            int earned = points.get("earned");
            int deducted = points.get("deducted");
            int finalPoints = earned - deducted;

            // ✅ 8. 검사 결과 DB 저장
            AIAnalysisResult aiResult = new AIAnalysisResult(
                    userUid, userRank.getAccumulatedPoints(),
                    finalSuccessRate, earned, deducted, selectedCategory, apartmentId
            );
            aiAnalysisResultRepository.save(aiResult);

            // ✅ 9. 포인트 업데이트
            rankingService.updateUserPoints(userUid, finalPoints);

            // ✅ 10. 업데이트 후 새로운 포인트 가져오기
            RankAccount updatedUserRank = rankingService.getUserRanking(userUid).orElseThrow();
            int updatedMonthlyPoints = updatedUserRank.getMonthlyPoints();
            int updatedAccumulatedPoints = updatedUserRank.getAccumulatedPoints();

            // ✅ 11. 등급 업데이트
            String previousGrade = rankCalculatorService.getGrade(userRank.getAccumulatedPoints());
            String newGrade = rankCalculatorService.getGrade(updatedAccumulatedPoints);
            String promotionMessage = !previousGrade.equals(newGrade) ? "🎉 축하합니다! 등급이 상승했습니다." : "";

            // ✅ 12. 프론트엔드 응답 데이터 구성
            Map<String, Object> resultResponse = new HashMap<>();
            resultResponse.put("totalDetectedObjects", totalDetectedObjects);
            resultResponse.put("correctlyClassifiedObjects", correctlyClassifiedObjects);
            resultResponse.put("incorrectlyClassifiedObjects", incorrectlyClassifiedObjects);
            resultResponse.put("earnedPoints", earned);
            resultResponse.put("deductedPoints", deducted);
            resultResponse.put("finalPoints", finalPoints);
            resultResponse.put("monthlyPoints", updatedMonthlyPoints);
            resultResponse.put("accumulatedPoints", updatedAccumulatedPoints);
            resultResponse.put("successRate", finalSuccessRate);
            resultResponse.put("grade", newGrade);
            resultResponse.put("promotionMessage", promotionMessage);

            // ✅ 13. WebSocket을 통해 프론트에 전송
            System.out.println("📡 WebSocket 전송 데이터: " + resultResponse); // 로그 추가
            messagingTemplate.convertAndSend("/topic/ai-results/", resultResponse);
            // ✅ 14. 하드웨어(Raspberry Pi)에도 성공률 전송
            hardwareService.sendSuccessRateToRaspberryPi(finalSuccessRate);
            System.out.println("📡 하드웨어로 성공률 전송 완료: " + finalSuccessRate);



            return ResponseEntity.ok(resultResponse);
        } catch (Exception e) {
            e.printStackTrace();  // ✅ Spring Boot 로그에서 에러 메시지를 확인할 수 있도록 출력
            return ResponseEntity.status(500).body(Map.of("error", "AI 서버 데이터 처리 실패", "details", e.getMessage()));
        }
    }
}