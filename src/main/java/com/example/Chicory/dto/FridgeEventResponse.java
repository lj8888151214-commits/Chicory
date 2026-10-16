package com.example.Chicory.dto;

import com.example.Chicory.entity.Ingredient;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class FridgeEventResponse {
    private boolean success;
    private Long eventId;
    private String eventType;
    private String promptMessage; // 프론트에 띄울 AI 질문
    private List<IngredientDto> urgentIngredients; // 유통기한 임박 식재료 목록

    @Getter
    @Builder
    public static class IngredientDto {
        private Long id;
        private String name;
        private int quantity;
        private String unit;
        private String expireDate;
    }
}