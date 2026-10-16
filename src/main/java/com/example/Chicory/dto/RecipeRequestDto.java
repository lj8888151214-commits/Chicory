package com.example.Chicory.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter @Setter
public class RecipeRequestDto {
    private String title;
    private String description;
    private String cookingTime;
    private String difficulty;
    private String imageUrl;
    private List<String> ingredients;
    private List<String> steps;
}