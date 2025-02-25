package com.taba7_2.sseudam.model;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "analysis_result_data")
public class AIAnalysisResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String uid;

    @Column(nullable = false)
    private int points;

    @Column(nullable = false)
    private int successPercent;

    @Column(nullable = false)
    private int earned;

    @Column(nullable = false)
    private int inearned;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = true)
    private String material;

    @Column(nullable = true)
    private Long apartmentId;

    // ✅ `detectedObjects` JSON 데이터 저장
    @Column(columnDefinition = "TEXT") // JSON을 문자열로 저장
    private String detectedObjectsJson;

    // ✅ `createdAt`에서 YYYYMM 형식으로 변환된 `month` 추가
    @Transient  // 데이터베이스에 저장되지 않지만 조회 시 사용할 수 있도록 설정
    private String month;

    @PostLoad  // 데이터 조회 후 자동으로 month 값을 설정
    public void postLoad() {
        this.month = createdAt.format(DateTimeFormatter.ofPattern("yyyyMM"));
    }

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.month = createdAt.format(DateTimeFormatter.ofPattern("yyyyMM"));
    }

    public AIAnalysisResult(String uid, int points, int successPercent, int earned, int inearned,
                            String material, Long apartmentId) {
        this.uid = uid;
        this.points = points;
        this.successPercent = successPercent;
        this.earned = earned;
        this.inearned = inearned;
        this.material = material;
        this.apartmentId = apartmentId;
        this.month = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMM"));
    }

    // ✅ JSON 문자열을 List<Map<String, Object>> 형식으로 변환하는 메서드 추가
    public List<Map<String, Object>> getDetectedObjects() {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(detectedObjectsJson, new TypeReference<>() {});
        } catch (Exception e) {
            return null;
        }
    }
}