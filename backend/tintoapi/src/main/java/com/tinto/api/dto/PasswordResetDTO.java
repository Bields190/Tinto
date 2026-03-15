package com.tinto.api.dto;

public record PasswordResetDTO(String email, String codigo, String novaSenha) {}
