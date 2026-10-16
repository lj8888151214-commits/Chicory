package com.example.Chicory.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "ingredient")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // 예: 삼겹살, 양파, 대파

    @Column(nullable = false)
    private int quantity; // 수량 또는 중량 (예: 400)

    @Column(nullable = false)
    private String unit; // 단위 (예: g, 개, 단)

    @Column(nullable = false)
    private LocalDate purchaseDate; // 구매일자

    @Column(nullable = false)
    private LocalDate expireDate; // 유통기한

    @Column(name = "is_consumed", nullable = false)
    private boolean isConsumed; // 완전 소진 여부

    @Builder
    public Ingredient(String name, int quantity, String unit, LocalDate purchaseDate, LocalDate expireDate) {
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.purchaseDate = purchaseDate != null ? purchaseDate : LocalDate.now();
        this.expireDate = expireDate;
        this.isConsumed = false;
    }

    // 소진/차감 메서드
    public void consume(int amount) {
        if (this.quantity <= amount) {
            this.quantity = 0;
            this.isConsumed = true;
        } else {
            this.quantity -= amount;
        }
    }
}