package com.example.Chicory.dto;

import com.example.Chicory.entity.Recipe;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
public class RecipeResponseDto {
    private Long id;
    private String title;
    private String description;
    private String cookingTime;
    private String difficulty;
    private String imageUrl;
    private List<String> ingredients;
    private List<String> steps;
    private LocalDateTime createdAt;

    public RecipeResponseDto(Recipe recipe) {
        this.id = recipe.getId();
        this.title = recipe.getTitle();
        this.description = recipe.getDescription();
        this.cookingTime = recipe.getCookingTime();
        this.difficulty = recipe.getDifficulty();
        this.imageUrl = recipe.getImageUrl();
        this.ingredients = recipe.getIngredients();
        this.steps = recipe.getSteps();
        this.createdAt = recipe.getCreatedAt();
    }
}