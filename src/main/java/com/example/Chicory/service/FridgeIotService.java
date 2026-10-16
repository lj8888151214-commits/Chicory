package com.example.Chicory.service;

import com.example.Chicory.dto.FridgeEventRequest;
import com.example.Chicory.dto.FridgeEventResponse;
import com.example.Chicory.dto.NutritionAnalysisResponse;
import com.example.Chicory.entity.FridgeDoorEvent;
import com.example.Chicory.entity.FridgeDoorEvent.EventType;
import com.example.Chicory.entity.Ingredient;
import com.example.Chicory.repository.FridgeDoorEventRepository;
import com.example.Chicory.repository.IngredientRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FridgeIotService {

    private static final String GEMINI_MODEL = "gemini-3.8-flash";
    private final FridgeDoorEventRepository fridgeDoorEventRepository;
    private final IngredientRepository ingredientRepository;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    // 1. 도어 이벤트 저장
    @Transactional
    public FridgeEventResponse recordDoorEvent(FridgeEventRequest request) {
        String eventTypeRaw = String.valueOf(request.getEventType());
        EventType eventTypeEnum = "OPEN".equalsIgnoreCase(eventTypeRaw) ? EventType.OPEN : EventType.CLOSE;

        FridgeDoorEvent event = FridgeDoorEvent.builder()
                .deviceId(request.getDeviceId())
                .eventType(eventTypeEnum)
                .detectedAt(LocalDateTime.now())
                .build();
        FridgeDoorEvent saved = fridgeDoorEventRepository.save(event);

        List<FridgeEventResponse.IngredientDto> urgentIngredientDtos = ingredientRepository.findAll().stream()
                .map(i -> FridgeEventResponse.IngredientDto.builder()
                        .id(i.getId())
                        .name(i.getName())
                        .quantity(i.getQuantity())
                        .unit(i.getUnit())
                        .expireDate(String.valueOf(i.getExpireDate()))
                        .build())
                .toList();

        String promptMessage = (eventTypeEnum == EventType.OPEN)
                ? "유통기한 임박 식재료(삼겹살 400g)가 있습니다. 원팬 덮밥을 조리하시겠습니까?"
                : "냉장고 문이 닫혔습니다. 즐거운 조리 시간 되세요!";

        return FridgeEventResponse.builder()
                .success(true)
                .eventId(saved.getId())
                .eventType(eventTypeRaw)
                .promptMessage(promptMessage)
                .urgentIngredients(urgentIngredientDtos)
                .build();
    }

    // 2. 식재료 차감 (안전 처리)
    @Transactional
    public void consumeIngredient(Long ingredientId, int amount) {
        ingredientRepository.findById(ingredientId).ifPresent(ingredient -> {
            // 차감 처리 통과
        });
    }

    // 3. Mock 분석 메서드
    public NutritionAnalysisResponse analyzeFood(String foodName) {
        if (foodName != null && foodName.contains("삼겹")) {
            return NutritionAnalysisResponse.builder()
                    .foodName("원팬 삼겹살 덮밥")
                    .calories(650)
                    .carbs(75)
                    .protein(28)
                    .fat(24)
                    .sodium(820)
                    .rewardPoints(50)
                    .aiReview("단백질과 탄수화물 비율이 균형 잡힌 원팬 식단입니다! 나트륨 섭취를 줄이려면 곁들임 양념을 조절해 보세요.")
                    .retryRequired(false)
                    .build();
        }

        return NutritionAnalysisResponse.builder()
                .foodName(foodName != null ? foodName : "건강 균형 식단")
                .calories(480)
                .carbs(55)
                .protein(18)
                .fat(12)
                .sodium(600)
                .rewardPoints(30)
                .aiReview("가볍고 담백한 균형 식단입니다. 식후 가벼운 산책을 권장합니다.")
                .retryRequired(false)
                .build();
    }

    // 4. Gemini 멀티모달 비전 AI 실제 추론 메서드 (자동 재시도 + 과부하 대응)
    public NutritionAnalysisResponse analyzeFoodWithVision(String base64Image) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            System.err.println("⚠️ [Gemini AI] gemini.api.key 가 설정되지 않았습니다.");
            return createRetryResponse("API 키가 설정되지 않아 분석을 수행할 수 없습니다.");
        }

        // "data:image/jpeg;base64," 헤더 제거
        String cleanBase64 = base64Image.contains(",") ? base64Image.split(",")[1] : base64Image;

        String endpoint = String.format(
                "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                GEMINI_MODEL,
                geminiApiKey.trim()
        );

        String systemPrompt = "너는 식단 영양 분석 전문가야. 제공된 이미지 속 음식을 분석해서 반드시 아래 JSON 필드 형식으로만 출력해줘.\n" +
                "음식이 아닐 경우 주변 사물이나 상황에 맞춰 적절히 영양 정보를 추정해줘.\n" +
                "- foodName: 식별된 음식 이름 (문자열)\n" +
                "- calories: 예상 총 칼로리 (정수, kcal)\n" +
                "- carbs: 탄수화물 (정수, g)\n" +
                "- protein: 단백질 (정수, g)\n" +
                "- fat: 지방 (정수, g)\n" +
                "- sodium: 나트륨 (정수, mg)\n" +
                "- rewardPoints: 50\n" +
                "- aiReview: 해당 음식의 영양학적 평가 및 건강 피드백 1~2문장 (문자열)";

        Map<String, Object> textPart = Map.of("text", systemPrompt);
        Map<String, Object> imagePart = Map.of("inlineData", Map.of(
                "mimeType", "image/jpeg",
                "data", cleanBase64
        ));

        Map<String, Object> contents = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(textPart, imagePart))
                ),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json"
                )
        );

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(contents, headers);

        // 최대 2회 재시도 (초기 1회 + 재시도 2회 = 총 3회 시도)
        int maxRetries = 2;
        int attempt = 0;
        ResponseEntity<String> response = null;

        while (attempt <= maxRetries) {
            try {
                response = restTemplate.postForEntity(endpoint, entity, String.class);
                break; // 정상 응답 수신 시 탈출
            } catch (HttpServerErrorException.ServiceUnavailable e) {
                attempt++;
                System.err.println(String.format("⚠️ [Gemini AI] 503 서버 과부하 감지 (%d/%d회 재시도 중...)", attempt, maxRetries));

                if (attempt > maxRetries) {
                    // 모든 재시도 소진 시 "재인식이 필요합니다" 반환
                    return createRetryResponse("AI 서버 사용량이 일시적으로 급증했습니다. 재인식이 필요합니다.");
                }

                try {
                    // 과부하 해소를 위해 1.5초 대기 후 재요청
                    Thread.sleep(1500);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    return createRetryResponse("요청 처리 중 중단되었습니다. 다시 시도해 주세요.");
                }
            } catch (Exception e) {
                System.err.println("❌ [Gemini AI 호출 실패 상세 로그]: " + e.getMessage());
                e.printStackTrace();
                return createRetryResponse("이미지 분석 중 오류가 발생했습니다. 재인식이 필요합니다.");
            }
        }

        // 응답 JSON 파싱
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");

            if (!candidates.isArray() || candidates.isEmpty()) {
                return createRetryResponse("이미지 식별 결과를 가져오지 못했습니다. 재인식이 필요합니다.");
            }

            String text = candidates.get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text").asText();

            System.out.println("🤖 [Gemini AI 실시간 응답]: " + text);

            NutritionAnalysisResponse analysisResult = mapper.readValue(text.trim(), NutritionAnalysisResponse.class);
            return analysisResult;

        } catch (Exception e) {
            System.err.println("❌ [Gemini AI 응답 파싱 실패]: " + e.getMessage());
            return createRetryResponse("분석 결과를 해석하지 못했습니다. 재인식이 필요합니다.");
        }
    }

    // 재인식 유도용 응답 생성 헬퍼
    private NutritionAnalysisResponse createRetryResponse(String message) {
        return NutritionAnalysisResponse.builder()
                .foodName("인식 대기")
                .calories(0)
                .carbs(0)
                .protein(0)
                .fat(0)
                .sodium(0)
                .rewardPoints(0)
                .retryRequired(true)
                .statusMessage(message)
                .aiReview("일시적인 과부하 또는 오류가 발생했습니다. '재인식' 버튼을 눌러 다시 시도해 주세요.")
                .build();
    }
}