package com.example.Chicory.controller;

import com.example.Chicory.service.FridgeIotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/kakao")
@RequiredArgsConstructor
public class KakaoChatbotController {

    private final FridgeIotService fridgeIotService;

    @PostMapping("/fridge/add")
    public ResponseEntity<Map<String, Object>> handleKakaoSkill(@RequestBody Map<String, Object> payload) {
        // 1. 발화 텍스트 추출
        Map<String, Object> userRequest = (Map<String, Object>) payload.get("userRequest");
        String utterance = userRequest != null ? (String) userRequest.get("utterance") : "";

        // 2. 발화문에서 식재료 추출
        List<String> parsedItems = parseIngredients(utterance);

        // 3. 실제 DB 저장 호출
        List<String> savedItems = fridgeIotService.addIngredientsFromKakao(parsedItems);

        // 4. 응답 생성
        String replyText;
        if (savedItems.isEmpty()) {
            replyText = "추가할 재료명을 찾지 못했습니다. '양파, 삼겹살 추가' 형태로 보내주세요.";
        } else {
            replyText = "🛒 Chicory 냉장고에 [" + String.join(", ", savedItems) + "] 재료가 보관되었습니다!";
        }

        Map<String, Object> simpleText = Map.of("text", replyText);
        Map<String, Object> template = Map.of("outputs", List.of(Map.of("simpleText", simpleText)));

        Map<String, Object> response = new HashMap<>();
        response.put("version", "2.0");
        response.put("template", template);

        return ResponseEntity.ok(response);
    }

    private List<String> parseIngredients(String text) {
        String cleaned = text.replaceAll("(구매|샀어|사옴|추가|등록|결제|마트|수퍼|슈퍼|넣었어|넣음|보관|\\s+)", " ").trim();
        if (cleaned.isEmpty()) return Collections.emptyList();

        String[] tokens = cleaned.split("[,\\s+및랑하고]+");
        List<String> result = new ArrayList<>();
        for (String token : tokens) {
            String item = token.trim();
            if (item.length() >= 2) {
                result.add(item);
            }
        }
        return result;
    }
}