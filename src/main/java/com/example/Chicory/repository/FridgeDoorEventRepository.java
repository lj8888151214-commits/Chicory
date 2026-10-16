package com.example.Chicory.repository;

import com.example.Chicory.entity.FridgeDoorEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FridgeDoorEventRepository extends JpaRepository<FridgeDoorEvent, Long> {
    // 가장 최근에 발생한 문 열림 이벤트 1건 조회
    Optional<FridgeDoorEvent> findTopByEventTypeOrderByDetectedAtDesc(FridgeDoorEvent.EventType eventType);
}