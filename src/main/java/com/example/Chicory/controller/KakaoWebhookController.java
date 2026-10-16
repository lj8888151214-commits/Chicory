package com.example.Chicory.controller;

import com.example.Chicory.dto.KakaoReceiptDto;
import com.example.Chicory.entity.Ingredient;
import com.example.Chicory.repository.IngredientRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Slf4j
@RestController
@RequestMapping("/api/webhook/kakao")
//@CrossOrigin(origins = "*")
public class KakaoWebhookController {

    private final IngredientRepository ingredientRepository;

    // application.properties의 카카오 JS 키 주입
    @Value("${kakao.javascript.key}")
    private String kakaoJsKey;

    public KakaoWebhookController(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    @PostMapping("/purchase")
    public ResponseEntity<?> handleKakaoPurchase(
            @RequestHeader(value = "x-kakao-key", required = false) String requestKey,
            @RequestBody KakaoReceiptDto dto) {

        try {
            // 1. 카카오 API Key 인증 검증
            if (requestKey == null || !requestKey.equals(kakaoJsKey)) {
                log.warn("인증 실패: 잘못된 카카오 API Key 접근 ({})", requestKey);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("유효하지 않은 카카오 API Key입니다.");
            }

            String msg = dto.getUserMessage();
            if (msg == null || msg.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("메시지 내용이 비어있습니다.");
            }

            String detectedName = null;
            int detectedQty = 1;
            String detectedUnit = "개";
            int shelfLifeDays = 7;

            // 2. 순수 원물 식재료 판별
            if (msg.contains("삼겹살") || msg.contains("돼지고기")) {
                detectedName = "삼겹살";
                detectedQty = 300;
                detectedUnit = "g";
                shelfLifeDays = 4;
            } else if (msg.contains("소고기") || msg.contains("한우")) {
                detectedName = "소고기";
                detectedQty = 300;
                detectedUnit = "g";
                shelfLifeDays = 5;
            } else if (msg.contains("닭고기") || msg.contains("생닭")) {
                detectedName = "닭고기";
                detectedQty = 1;
                detectedUnit = "마리";
                shelfLifeDays = 3;
            } else if (msg.contains("대파") || msg.contains("파")) {
                detectedName = "대파";
                detectedQty = 1;
                detectedUnit = "단";
                shelfLifeDays = 14;
            } else if (msg.contains("양파")) {
                detectedName = "양파";
                detectedQty = 1;
                detectedUnit = "망";
                shelfLifeDays = 21;
            } else if (msg.contains("마늘")) {
                detectedName = "마늘";
                detectedQty = 1;
                detectedUnit = "봉";
                shelfLifeDays = 30;
            } else if (msg.contains("감자")) {
                detectedName = "감자";
                detectedQty = 1;
                detectedUnit = "봉";
                shelfLifeDays = 21;
            } else if (msg.contains("당근")) {
                detectedName = "당근";
                detectedQty = 1;
                detectedUnit = "개";
                shelfLifeDays = 14;
            } else if (msg.contains("버섯") || msg.contains("팽이버섯") || msg.contains("새송이")) {
                detectedName = "버섯";
                detectedQty = 1;
                detectedUnit = "팩";
                shelfLifeDays = 7;
            } else if (msg.contains("계란") || msg.contains("달걀")) {
                detectedName = "계란";
                detectedQty = 10;
                detectedUnit = "구";
                shelfLifeDays = 25;
            }

            if (detectedName == null) {
                return ResponseEntity.ok("등록 대상 일반 원물 식재료가 감지되지 않아 저장을 건너뜁니다.");
            }

            // 3. 엔터티 빌더를 통한 DB 적재
            LocalDate now = LocalDate.now();
            Ingredient ingredient = Ingredient.builder()
                    .name(detectedName)
                    .quantity(detectedQty)
                    .unit(detectedUnit)
                    .purchaseDate(now)
                    .expireDate(now.plusDays(shelfLifeDays))
                    .build();

            Ingredient saved = ingredientRepository.save(ingredient);
            log.info("새 원물 식재료 등록 완료: {} (ID: {})", saved.getName(), saved.getId());

            return ResponseEntity.ok(saved);

        } catch (Throwable e) {
            log.error("💥 웹훅 에러 발생: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("에러 발생: " + e.getClass().getName() + " - " + e.getMessage());
        }
    }
}