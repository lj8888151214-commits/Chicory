package com.example.Chicory.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "recipes")
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;          // 레시피 제목

    @Column(columnDefinition = "TEXT")
    private String description;    // 간단한 소개글

    @Column(length = 50)
    private String cookingTime;    // 소요 시간 (예: "30분")

    @Column(length = 20)
    private String difficulty;     // 난이도 (상 / 중 / 하)

    private String imageUrl;       // 대표 이미지 URL

    @ElementCollection
    @CollectionTable(name = "recipe_ingredients", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "ingredient")
    private List<String> ingredients = new ArrayList<>(); // 재료 목록

    @ElementCollection
    @CollectionTable(name = "recipe_steps", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "step_description", columnDefinition = "TEXT")
    @OrderColumn(name = "step_order")
    private List<String> steps = new ArrayList<>();       // 조리 순서

    private LocalDateTime createdAt = LocalDateTime.now();
}