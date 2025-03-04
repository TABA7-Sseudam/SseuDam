package com.taba7_2.sseudam.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class AiResultService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String RASPBERRY_PI_URL = "http://192.168.100.8:5000/display"; // ✅ 라즈베리파이 IP 설정

    /**
     * ✅ AI 분석 결과를 받아와 하드웨어(라즈베리파이)로 전송
     */
    public void sendSuccessRateToHardware(int successRate) {
        try {
            // ✅ 요청 데이터 생성
            Map<String, Object> requestBody = Map.of("number", successRate);

            // ✅ HTTP 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // ✅ HTTP 요청 객체 생성
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            // ✅ Flask 서버(라즈베리파이)로 POST 요청 보내기
            ResponseEntity<String> response = restTemplate.postForEntity(RASPBERRY_PI_URL, requestEntity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("✅ Success rate sent to Raspberry Pi: " + successRate);
            } else {
                System.err.println("❌ Failed to send success rate: " + response.getStatusCode());
            }

        } catch (Exception e) {
            System.err.println("❌ Error sending success rate to Raspberry Pi: " + e.getMessage());
        }
    }
}