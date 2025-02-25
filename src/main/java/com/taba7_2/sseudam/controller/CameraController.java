package com.taba7_2.sseudam.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/camera")
public class CameraController {

    private final SimpMessagingTemplate messagingTemplate;

    public CameraController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/start")
    public ResponseEntity<?> activateCamera(@RequestHeader("Authorization") String token) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body("토큰이 필요합니다.");
        }

        // ✅ WebSocket을 통해 앱으로 토큰과 함께 메시지 전송
        Map<String, Object> message = new HashMap<>();
        message.put("action", "activate_camera");
        message.put("token", token);  // ✅ 토큰 추가

        messagingTemplate.convertAndSend("/topic/camera", message);

        return ResponseEntity.ok("카메라 실행 신호 및 토큰 전송 완료");
    }
}