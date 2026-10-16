package com.example.Chicory.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class KakaoReceiptDto {
    // 카카오 알림톡 전문 혹은 메시지 본문
    private String userMessage;
    // 예: "[결제완료] 이마트몰 삼겹살 600g 결제 완료 (2026-10-04)"
}