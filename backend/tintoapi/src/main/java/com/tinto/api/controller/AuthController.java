package com.tinto.api.controller;

import com.tinto.api.dto.LoginDTO;
import com.tinto.api.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public String login(@RequestBody LoginDTO loginDto) {
        return authService.login(loginDto.email(), loginDto.senha());
    }
}