package com.taba7_2.sseudam.repository;

import com.taba7_2.sseudam.model.AIAnalysisResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface AIAnalysisResultRepository extends JpaRepository<AIAnalysisResult, String> {

    // ✅ 최신 AI 분석 결과 조회 (네이티브 SQL)
    @Query(value = """
        SELECT * FROM analysis_result_data 
        WHERE uid = :uid
        ORDER BY created_at DESC
        LIMIT 1
    """, nativeQuery = true)
    Optional<Map<String, Object>> findLatestAnalysisResultByUser(String uid);

    // ✅ 최근 6일 분석 결과 조회
    @Query(value = """
        SELECT DATE(created_at) as analysis_date, material, success_percent
        FROM analysis_result_data
        WHERE uid = :uid
        ORDER BY created_at DESC
        LIMIT 6
    """, nativeQuery = true)
    List<Map<String, Object>> findRecentAnalysisResults(String uid);

    // ✅ 월별 재질별 평균 성공률 조회
    @Query(value = """
    SELECT DATE_FORMAT(a.created_at, '%Y%m') AS month, 
           a.material AS material, 
           CAST(AVG(a.success_percent) AS DOUBLE) AS avgSuccess
    FROM analysis_result_data a 
    WHERE a.uid = :uid
    AND DATE_FORMAT(a.created_at, '%Y%m') < DATE_FORMAT(CURRENT_DATE, '%Y%m')
    GROUP BY DATE_FORMAT(a.created_at, '%Y%m'), a.material 
    ORDER BY month DESC
""", nativeQuery = true)
    List<Object[]> findMonthlyMaterialSuccessByUser(String uid);

    // ✅ 최근 5개월 사용자 평균 성공률 조회
    @Query(value = """
    SELECT DATE_FORMAT(a.created_at, '%Y%m') AS month, 
           AVG(a.success_percent) AS avg_success
    FROM analysis_result_data a
    WHERE a.uid = :uid
    AND DATE_FORMAT(a.created_at, '%Y%m') < DATE_FORMAT(CURRENT_DATE, '%Y%m')
    GROUP BY DATE_FORMAT(a.created_at, '%Y%m')
    ORDER BY month DESC
    LIMIT 5
""", nativeQuery = true)
    List<Object[]> findUserMonthlyAvgSuccess(String uid);


    // ✅ 최근 5개월 아파트 평균 성공률 조회
    @Query(value = """
    SELECT DATE_FORMAT(a.created_at, '%Y%m') AS month, 
           AVG(a.success_percent) AS avg_success
    FROM analysis_result_data a
    WHERE a.apartment_id = :apartmentId
    AND DATE_FORMAT(a.created_at, '%Y%m') < DATE_FORMAT(CURRENT_DATE, '%Y%m')
    GROUP BY DATE_FORMAT(a.created_at, '%Y%m')
    ORDER BY month DESC
    LIMIT 5
""", nativeQuery = true)
    List<Object[]> findApartmentMonthlyAvgSuccess(Long apartmentId);
}