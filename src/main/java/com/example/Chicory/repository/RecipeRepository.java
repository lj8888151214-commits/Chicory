package com.example.Chicory.repository;

import com.example.Chicory.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    // N+1 방지를 위해 ingredients 컬렉션을 한 번에 조회 (DISTINCT 필수)
    @Query("SELECT DISTINCT r FROM Recipe r LEFT JOIN FETCH r.ingredients")
    List<Recipe> findAllWithIngredients();

    // 제목이나 재료 기반 검색용
    List<Recipe> findByTitleContainingIgnoreCase(String keyword);
}