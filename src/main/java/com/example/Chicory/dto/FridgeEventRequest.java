package com.example.Chicory.dto;

import com.example.Chicory.entity.FridgeDoorEvent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FridgeEventRequest {

    @NotBlank(message = "디바이스 ID는 필수입니다.")
    private String deviceId;

    @NotNull(message = "이벤트 타입(OPEN 또는 CLOSE)은 필수입니다.")
    private FridgeDoorEvent.EventType eventType;
}