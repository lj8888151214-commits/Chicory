package com.example.Chicory.service;

import com.example.Chicory.dto.NutritionAnalysisResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class GeminiVisionService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public NutritionAnalysisResponse analyzeFood(String base64DataUrl) {
        try {
            // "data:image/jpeg;base64," 접두어 제거
            String base64Data = base64DataUrl;
            if (base64DataUrl.contains(",")) {
                base64Data = base64DataUrl.split(",")[1];
            }

            // 공백 및 줄바꿈 제거
            base64Data = base64Data.replaceAll("\\s+", "");

            String prompt = "당신은 냉장고 IoT 비전 영양 분석 AI입니다. "
                    + "제공된 이미지에 담긴 음식/요리를 인식하여 영양 정보를 추정하세요. "
                    + "반드시 마크다운 백틱 없이 순수 JSON 객체 포맷만 출력하세요. "
                    + "{"
                    + "\"foodName\": \"한국어 음식명\", "
                    + "\"calories\": 350, "
                    + "\"carbs\": 25, "
                    + "\"protein\": 20, "
                    + "\"fat\": 15, "
                    + "\"sodium\": 600, "
                    + "\"rewardPoints\": 50, "
                    + "\"aiReview\": \"간단한 영양 코멘트 한 줄\""
                    + "}";

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of(
                                    "parts", List.of(
                                            Map.of("text", prompt),
                                            Map.of("inline_data", Map.of(
                                                    "mime_type", "image/jpeg",
                                                    "data", base64Data
                                            ))
                                    )
                            )
                    )
            );

            // API 엔드포인트
            // 기존 404 발생 경로
        // String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey.trim();

            // 기존 (404 발생)
// String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey.trim();

// ⭐ 구글 안내대로 gemini-3.8-flash 로 변경
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=" + apiKey.trim();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", apiKey.trim()); // ⭐ 신규 AQ 키 호환 헤더

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            String rawOutput = root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText().trim();

            // 백틱 및 앞뒤 잔여 텍스트 정제
            int startIdx = rawOutput.indexOf("{");
            int endIdx = rawOutput.lastIndexOf("}");
            if (startIdx != -1 && endIdx != -1) {
                rawOutput = rawOutput.substring(startIdx, endIdx + 1);
            }

            JsonNode parsedFood = objectMapper.readTree(rawOutput);

            return NutritionAnalysisResponse.builder()
                    .foodName(parsedFood.path("foodName").asText("인식된 요리"))
                    .calories(parsedFood.path("calories").asInt(300))
                    .carbs(parsedFood.path("carbs").asInt(20))
                    .protein(parsedFood.path("protein").asInt(15))
                    .fat(parsedFood.path("fat").asInt(10))
                    .sodium(parsedFood.path("sodium").asInt(500))
                    .rewardPoints(50)
                    .aiReview(parsedFood.path("aiReview").asText("균형 잡힌 식단을 유지해 보세요."))
                    .retryRequired(false)
                    .build();

        } catch (HttpStatusCodeException httpEx) {
            // 구글 서버가 반환한 실제 에러 바디 콘솔 출력
            log.error("💥 Gemini API HTTP 상태 에러: {} - 응답 본문: {}",
                    httpEx.getStatusCode(), httpEx.getResponseBodyAsString());
            return NutritionAnalysisResponse.builder()
                    .retryRequired(true)
                    .statusMessage("AI 서버 응답 오류 (" + httpEx.getStatusCode() + "). 다시 시도해 주세요.")
                    .build();
        } catch (Exception e) {
            log.error("💥 Gemini Vision 파싱/내부 에러: ", e);
            return NutritionAnalysisResponse.builder()
                    .retryRequired(true)
                    .statusMessage("음식 데이터 분석 중 오류가 발생했습니다. 다시 촬영해 주세요.")
                    .build();
        }
    }
}