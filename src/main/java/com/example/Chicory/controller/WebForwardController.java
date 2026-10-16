package com.example.Chicory.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebForwardController {

    /**
     * API 호출(/api/**) 및 확장자가 있는 정적 리소스(.js, .css, .ico, .glb 등)를 제외한
     * 모든 프론트엔드 라우트 요청을 React의 index.html로 포워딩합니다.
     */
    @GetMapping(value = {
            "/{path:[^\\.]*}",
            "/{path1:[^\\.]*}/{path2:[^\\.]*}"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}