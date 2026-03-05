package com.tinto.api.controller;

import com.tinto.api.model.Usuario;
import com.tinto.api.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrar(@RequestBody Usuario usuario) {
        try {
            Usuario novoUsuario = usuarioService.cadastrarUsuario(usuario);
            return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/validar")
    public ResponseEntity<String> validar(@RequestParam String senhaAtual) {
        boolean valido = usuarioService.validarSenha(senhaAtual);
        if (valido) {
            return ResponseEntity.ok("OK");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta");
        }
    }

    @PutMapping("/alterar/nome")
    public ResponseEntity<?> alterarNome(@RequestParam String senhaAtual, @RequestParam String novoNome) {
        try {
            Usuario usuario = usuarioService.alterarNome(senhaAtual, novoNome);
            return ResponseEntity.ok(usuario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/alterar/senha")
    public ResponseEntity<?> alterarSenha(@RequestParam String senhaAtual, @RequestParam String novaSenha) {
        try {
            Usuario usuario = usuarioService.alterarSenha(senhaAtual, novaSenha);
            return ResponseEntity.ok("Senha alterada com sucesso");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/alterar/email")
    public ResponseEntity<?> alterarEmail(@RequestParam String senhaAtual, @RequestParam String novoEmail) {
        try {
            Usuario usuario = usuarioService.alterarEmail(senhaAtual, novoEmail);
            return ResponseEntity.ok(usuario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}