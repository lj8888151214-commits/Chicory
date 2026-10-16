package com.example.Chicory.dto;

import com.example.Chicory.entity.Recipe;
import lombok.Getter;
import java.util.List;

@Getter
public class RecipeMatchResponseDto {
    private Long id;
    private String title;
    private String cookingTime;
    private String difficulty;
    private String imageUrl;
    private List<String> requiredIngredients;     // 레시피에 필요한 전체 재료
    private List<String> matchedIngredients;      // 현재 내 냉장고에 있는 재료
    private List<String> missingIngredients;      // 부족한 재료
    private int matchPercentage;                  // 일치율 (0~100%)

    public RecipeMatchResponseDto(Recipe recipe, List<String> matched, List<String> missing, int percentage) {
        this.id = recipe.getId();
        this.title = recipe.getTitle();
        this.cookingTime = recipe.getCookingTime();
        this.difficulty = recipe.getDifficulty();
        this.imageUrl = recipe.getImageUrl();
        this.requiredIngredients = recipe.getIngredients();
        this.matchedIngredients = matched;
        this.missingIngredients = missing;
        this.matchPercentage = percentage;
    }
}