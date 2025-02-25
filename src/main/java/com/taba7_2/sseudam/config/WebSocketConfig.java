package com.taba7_2.sseudam.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");  // 클라이언트가 구독할 경로
        config.setApplicationDestinationPrefixes("/app");  // 클라이언트가 메시지를 보낼 경로
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws/camera")  // ✅ SockJS 없이 순수 WebSocket 사용 가능
                .setAllowedOriginPatterns("*");

        registry.addEndpoint("/ws/camera-sockjs")  // ✅ SockJS 지원하는 엔드포인트 (기존 방식)
                .setAllowedOriginPatterns("*")
                .withSockJS();

        // ✅ AI 분석 결과를 WebSocket으로 전달하기 위한 엔드포인트 추가
        registry.addEndpoint("/ws/ai-results")
                .setAllowedOriginPatterns("*");

        registry.addEndpoint("/ws/ai-results-sockjs")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}