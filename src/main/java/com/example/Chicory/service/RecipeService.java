package com.example.Chicory.service;

import com.example.Chicory.dto.RecipeMatchResponseDto;
import com.example.Chicory.dto.RecipeRequestDto;
import com.example.Chicory.dto.RecipeResponseDto;
import com.example.Chicory.entity.Ingredient;
import com.example.Chicory.entity.Recipe;
import com.example.Chicory.repository.IngredientRepository;
import com.example.Chicory.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeService {

    // 필드 주입은 최상단에 모아 선언
    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;

    @Transactional
    public RecipeResponseDto createRecipe(RecipeRequestDto dto) {
        Recipe recipe = new Recipe();
        recipe.setTitle(dto.getTitle());
        recipe.setDescription(dto.getDescription());
        recipe.setCookingTime(dto.getCookingTime());
        recipe.setDifficulty(dto.getDifficulty());
        recipe.setImageUrl(dto.getImageUrl());
        recipe.setIngredients(dto.getIngredients() != null ? dto.getIngredients() : new ArrayList<>());
        recipe.setSteps(dto.getSteps() != null ? dto.getSteps() : new ArrayList<>());

        Recipe saved = recipeRepository.save(recipe);
        return new RecipeResponseDto(saved);
    }

    @Transactional(readOnly = true)
    public List<RecipeResponseDto> getAllRecipes() {
        return recipeRepository.findAll().stream()
                .map(RecipeResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RecipeResponseDto getRecipe(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 레시피를 찾을 수 없습니다. id=" + id));
        return new RecipeResponseDto(recipe);
    }

    @Transactional
    public void deleteRecipe(Long id) {
        recipeRepository.deleteById(id);
    }

    // 1. 전달받은 임의의 식재료 목록으로 매칭 검색
    @Transactional(readOnly = true)
    public List<RecipeMatchResponseDto> recommendRecipesByFridge(List<String> fridgeIngredients) {
        if (fridgeIngredients == null || fridgeIngredients.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> normalizedFridge = fridgeIngredients.stream()
                .filter(Objects::nonNull)
                .map(s -> s.replaceAll("\\s+", "").toLowerCase())
                .filter(s -> !s.isBlank())
                .toList();

        if (normalizedFridge.isEmpty()) {
            return Collections.emptyList();
        }

        List<Recipe> allRecipes = recipeRepository.findAllWithIngredients();

        return allRecipes.stream()
                .map(recipe -> {
                    List<String> recipeIngredients = recipe.getIngredients();
                    if (recipeIngredients == null || recipeIngredients.isEmpty()) {
                        return null;
                    }

                    List<String> matched = new ArrayList<>();
                    List<String> missing = new ArrayList<>();

                    for (String rawReq : recipeIngredients) {
                        String req = rawReq.replaceAll("\\s+", "").toLowerCase();

                        boolean isPresent = normalizedFridge.stream()
                                .anyMatch(f -> f.contains(req) || req.contains(f));

                        if (isPresent) {
                            matched.add(rawReq);
                        } else {
                            missing.add(rawReq);
                        }
                    }

                    int matchPercentage = (int) Math.round(((double) matched.size() / recipeIngredients.size()) * 100);

                    return new RecipeMatchResponseDto(recipe, matched, missing, matchPercentage);
                })
                .filter(Objects::nonNull)
                .filter(dto -> !dto.getMatchedIngredients().isEmpty())
                .sorted(Comparator.comparingInt(RecipeMatchResponseDto::getMatchPercentage).reversed())
                .collect(Collectors.toList());
    }

    // 2. DB 냉장고 테이블(is_consumed = false)에서 유통기한 임박 순으로 직접 가져와 매칭 검색
    @Transactional(readOnly = true)
    public List<RecipeMatchResponseDto> recommendRecipesFromCurrentFridge() {
        List<String> fridgeIngredients = ingredientRepository.findByIsConsumedFalseOrderByExpireDateAsc()
                .stream()
                .map(Ingredient::getName)
                .toList();

        return recommendRecipesByFridge(fridgeIngredients);
    }
}