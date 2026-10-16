package com.example.Chicory.controller;

import com.example.Chicory.dto.RecipeMatchResponseDto;
import com.example.Chicory.dto.RecipeRequestDto;
import com.example.Chicory.dto.RecipeResponseDto;
import com.example.Chicory.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class RecipeController {

    private final RecipeService recipeService;

    // 1. 등록
    @PostMapping
    public ResponseEntity<RecipeResponseDto> createRecipe(@RequestBody RecipeRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(recipeService.createRecipe(requestDto));
    }

    // 2. 전체 목록
    @GetMapping
    public ResponseEntity<List<RecipeResponseDto>> getAllRecipes() {
        return ResponseEntity.ok(recipeService.getAllRecipes());
    }

    // ⭐ 3. 추천 검색 (반드시 /{id}보다 위에 위치해야 합니다!)
    @GetMapping("/recommend")
    public ResponseEntity<List<RecipeMatchResponseDto>> recommendRecipes(
            @RequestParam(required = false) List<String> ingredients) {
        if (ingredients != null && !ingredients.isEmpty()) {
            return ResponseEntity.ok(recipeService.recommendRecipesByFridge(ingredients));
        }
        return ResponseEntity.ok(recipeService.recommendRecipesFromCurrentFridge());
    }

    // 4. 상세 조회 ({id} 가변 경로는 항상 고정 경로들 아래에 배치)
    @GetMapping("/{id}")
    public ResponseEntity<RecipeResponseDto> getRecipe(@PathVariable Long id) {
        return ResponseEntity.ok(recipeService.getRecipe(id));
    }

    // 5. 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        recipeService.deleteRecipe(id);
        return ResponseEntity.noContent().build();
    }
}