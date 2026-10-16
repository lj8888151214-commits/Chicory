package com.example.Chicory.controller;

import com.example.Chicory.dto.IngredientRequestDto;
import com.example.Chicory.dto.NutritionAnalysisResponse;
import com.example.Chicory.entity.Ingredient;
import com.example.Chicory.repository.IngredientRepository;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import com.example.Chicory.service.GeminiVisionService; // ⭐ 주입 대상 import

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import lombok.RequiredArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Slf4j
@RestController
@RequestMapping("/api/iot/fridge")
@RequiredArgsConstructor
public class FridgeIotController {

    private final IngredientRepository ingredientRepository;
    private final GeminiVisionService geminiVisionService; // ⭐ 서비스 주입


    // 기기별 최신 도어 상태 저장 (기본값 CLOSE)
    private static final Map<String, String> doorStateMap = new ConcurrentHashMap<>();

    // 1. 식재료 목록 조회
    @GetMapping("/ingredients")
    public ResponseEntity<List<Ingredient>> getIngredients() {
        return ResponseEntity.ok(ingredientRepository.findAll());
    }

    // 2. 식재료 직접 등록
    @PostMapping("/ingredients")
    @Transactional
    public ResponseEntity<Ingredient> addIngredient(@RequestBody IngredientRequestDto dto) {
        LocalDate purchaseDate = (dto.getPurchaseDate() != null) ? dto.getPurchaseDate() : LocalDate.now();
        LocalDate expireDate = (dto.getExpireDate() != null) ? dto.getExpireDate() : purchaseDate.plusDays(7);

        Ingredient ingredient = Ingredient.builder()
                .name(dto.getName() != null ? dto.getName().trim() : "미정")
                .quantity(dto.getQuantity() > 0 ? dto.getQuantity() : 1)
                .unit(dto.getUnit() != null && !dto.getUnit().isBlank() ? dto.getUnit() : "개")
                .purchaseDate(purchaseDate)
                .expireDate(expireDate)
                .build();

        return ResponseEntity.ok(ingredientRepository.save(ingredient));
    }

    // 3. 식재료 차감
    @PostMapping("/consume")
    @Transactional
    public ResponseEntity<?> consumeIngredient(@RequestParam Long ingredientId, @RequestParam int amount) {
        return ingredientRepository.findById(ingredientId)
                .map(ingredient -> {
                    ingredient.consume(amount);
                    return ResponseEntity.ok(Map.of(
                            "success", true,
                            "remaining", ingredient.getQuantity(),
                            "isConsumed", ingredient.isConsumed()
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. 식재료 삭제
    @DeleteMapping("/ingredients/{id}")
    @Transactional
    public ResponseEntity<Void> deleteIngredient(@PathVariable Long id) {
        ingredientRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // 5. 표준 IoT 이벤트 수신 API (문 열림/닫힘 및 기기 이벤트)
    @PostMapping("/event")
    public ResponseEntity<?> handleFridgeEvent(@RequestBody StandardIotEventDto dto) {
        String deviceId = dto.getDeviceId() != null ? dto.getDeviceId() : "bespoke_smart_fridge_01";

        // properties 내 doorState 우선 확인, 없으면 eventType 기준 매핑
        String doorState = "CLOSE";
        if (dto.getProperties() != null && dto.getProperties().getDoorState() != null) {
            doorState = dto.getProperties().getDoorState().toUpperCase();
        } else if (dto.getEventType() != null) {
            doorState = dto.getEventType().toUpperCase();
        }

        doorStateMap.put(deviceId, doorState);
        log.info("IoT 이벤트 수신: deviceId={}, doorState={}", deviceId, doorState);

        return ResponseEntity.ok(Map.of("success", true, "message", "Event Processed"));
    }

    // 6. UserApp 상태 조회 API (재료 부하에 따른 동적 온도 계산 포함)
    @GetMapping("/status")
    public ResponseEntity<?> getFridgeStatus(@RequestParam(defaultValue = "bespoke_smart_fridge_01") String deviceId) {
        String doorState = doorStateMap.getOrDefault(deviceId, "CLOSE");
        boolean isOpen = "OPEN".equalsIgnoreCase(doorState);

        // 등록된 총 재료 수량 집계
        List<Ingredient> ingredients = ingredientRepository.findAll();
        int totalQuantity = ingredients.stream().mapToInt(Ingredient::getQuantity).sum();
        int itemCount = ingredients.size();

        // 온도 계산 로직 (기본 2.0도 + 재료 1개당 +0.2도 부하 + 문 열림 시 +1.5도)
        double baseTemp = 2.0;
        double currentTemp = baseTemp + (totalQuantity * 0.2) + (isOpen ? 1.5 : 0.0);
        currentTemp = Math.round(currentTemp * 10.0) / 10.0;

        return ResponseEntity.ok(Map.of(
                "deviceId", deviceId,
                "doorState", doorState,
                "isOpen", isOpen,
                "itemCount", itemCount,
                "totalQuantity", totalQuantity,
                "targetTemp", baseTemp,
                "currentTemp", currentTemp,
                "coolingLoad", (totalQuantity > 10 ? "HIGH" : totalQuantity > 5 ? "MEDIUM" : "NORMAL")
        ));
    }

    // 표준 IoT DTO 정의
    @Getter
    @Setter
    @NoArgsConstructor
    public static class StandardIotEventDto {
        private String deviceId;
        private String deviceType;
        private String eventType;
        private IotProperties properties;
        private String timestamp;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class IotProperties {
        private String doorState;
        private Double targetTempFridge;
        private Double currentTempFridge;
    }

    @PostMapping("/analyze-food-vision")
    public ResponseEntity<NutritionAnalysisResponse> analyzeFoodVision(@RequestBody Map<String, String> payload) {
        String base64Image = payload.get("image");

        if (base64Image == null || base64Image.isBlank()) {
            return ResponseEntity.badRequest().body(
                    NutritionAnalysisResponse.builder()
                            .retryRequired(true)
                            .statusMessage("카메라 영상 데이터가 누락되었습니다. 다시 시도해 주세요.")
                            .build()
            );
        }

        // ⭐ 실제 Gemini Vision AI 호출
        NutritionAnalysisResponse result = geminiVisionService.analyzeFood(base64Image);
        return ResponseEntity.ok(result);
    }
}