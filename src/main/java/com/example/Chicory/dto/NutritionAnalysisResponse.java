package com.example.Chicory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NutritionAnalysisResponse {
    private String foodName;
    private int calories;
    private int carbs;        // 탄수화물 (g)
    private int protein;      // 단백질 (g)
    private int fat;          // 지방 (g)
    private int sodium;       // 나트륨 (mg)
    private int rewardPoints; // 완식 마일리지 포인트
    private String aiReview;  // AI 피드백 문구

    // 추가: 재인식 필요 여부 플래그 및 안내 메시지
    @Builder.Default
    private boolean retryRequired = false;
    private String statusMessage;
}