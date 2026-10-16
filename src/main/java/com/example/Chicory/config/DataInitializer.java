package com.example.Chicory.config;

import com.example.Chicory.entity.Ingredient;
import com.example.Chicory.repository.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final IngredientRepository ingredientRepository;

    @Override
    public void run(String... args) {
        if (ingredientRepository.count() == 0) {
            // 유통기한 임박한 순서대로 세팅
            ingredientRepository.save(Ingredient.builder()
                    .name("삼겹살")
                    .quantity(400)
                    .unit("g")
                    .purchaseDate(LocalDate.now().minusDays(3))
                    .expireDate(LocalDate.now().plusDays(2)) // 이틀 뒤 만료
                    .build());

            ingredientRepository.save(Ingredient.builder()
                    .name("대파")
                    .quantity(1)
                    .unit("단")
                    .purchaseDate(LocalDate.now().minusDays(1))
                    .expireDate(LocalDate.now().plusDays(5)) // 5일 뒤 만료
                    .build());

            ingredientRepository.save(Ingredient.builder()
                    .name("양파")
                    .quantity(3)
                    .unit("개")
                    .purchaseDate(LocalDate.now().minusDays(2))
                    .expireDate(LocalDate.now().plusDays(10)) // 10일 뒤 만료
                    .build());
        }
    }
}