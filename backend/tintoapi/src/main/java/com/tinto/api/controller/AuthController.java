package com.tinto.api.controller;

import com.tinto.api.dto.LoginDTO;
import com.tinto.api.dto.ForgotPasswordDTO;
import com.tinto.api.dto.PasswordResetDTO;
import com.tinto.api.dto.VerifyCodeDTO;
import com.tinto.api.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/esqueci-senha")
    public ResponseEntity<String> esqueciSenha(@RequestBody ForgotPasswordDTO payload) {
        authService.solicitarRedefinicaoSenha(payload.email());
        return ResponseEntity.ok("Código enviado com sucesso");
    }

    @PostMapping("/verificar-codigo")
    public ResponseEntity<Boolean> verificarCodigo(@RequestBody VerifyCodeDTO payload) {
        boolean valido = authService.verificarCodigoRedefinicao(payload.email(), payload.codigo());
        return ResponseEntity.ok(valido);
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<String> redefinirSenha(@RequestBody PasswordResetDTO payload) {
        authService.redefinirSenha(payload.email(), payload.codigo(), payload.novaSenha());
        return ResponseEntity.ok("Senha redefinida com sucesso");
    }
}