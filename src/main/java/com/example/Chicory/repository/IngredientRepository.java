package com.example.Chicory.repository;

import com.example.Chicory.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    // 소진되지 않은 재료 중 유통기한 임박 순서로 조회
    List<Ingredient> findByIsConsumedFalseOrderByExpireDateAsc();
}