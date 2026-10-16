package com.example.Chicory.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "fridge_door_event")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FridgeDoorEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String deviceId; // 예: "fridge_cam_01", "ha_door_sensor"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType eventType; // OPEN, CLOSE

    @Column(nullable = false)
    private LocalDateTime detectedAt;

    private boolean consumedChecked; // 재료 소진 확인 질문이 나갔는지 여부

    public enum EventType {
        OPEN, CLOSE
    }

    @Builder
    public FridgeDoorEvent(String deviceId, EventType eventType, LocalDateTime detectedAt) {
        this.deviceId = deviceId;
        this.eventType = eventType;
        this.detectedAt = detectedAt != null ? detectedAt : LocalDateTime.now();
        this.consumedChecked = false;
    }

    public void markAsChecked() {
        this.consumedChecked = true;
    }
}