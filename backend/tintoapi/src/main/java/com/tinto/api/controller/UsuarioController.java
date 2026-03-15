package com.tinto.api.controller;

import com.tinto.api.model.Usuario;
import com.tinto.api.service.UsuarioService;
import com.tinto.api.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AuthService authService;

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
    public ResponseEntity<?> validar(@RequestParam String senhaAtual) {
        boolean valido = usuarioService.validarSenha(senhaAtual);
        if (valido) {
            // Retorna um mapa JSON {"status": "OK"}
            Map<String, String> response = new HashMap<>();
            response.put("status", "OK");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta");
        }
    }

    @PutMapping("/alterar/nome")
    public ResponseEntity<?> alterarNome(@RequestParam String senhaAtual, @RequestParam String novoNome) {
        try {
            Usuario usuario = usuarioService.alterarNome(senhaAtual, novoNome);
            // Gera novo token pois o nome faz parte do JWT
            String token = authService.generateToken(usuario);
            Map<String, Object> resp = new HashMap<>();
            resp.put("usuario", usuario);
            resp.put("token", token);
            return ResponseEntity.ok(resp);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/alterar/senha")
public ResponseEntity<?> alterarSenha(@RequestParam String senhaAtual, @RequestParam String novaSenha) {
    try {
        Usuario usuario = usuarioService.alterarSenha(senhaAtual, novaSenha);
        
        // Cria um JSON de resposta
        Map<String, String> response = new HashMap<>();
        response.put("mensagem", "Senha alterada com sucesso");
        
        return ResponseEntity.ok(response);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

    @PutMapping("/alterar/email")
    public ResponseEntity<?> alterarEmail(@RequestParam String senhaAtual, @RequestParam String novoEmail) {
        try {
            Usuario usuario = usuarioService.alterarEmail(senhaAtual, novoEmail);
            // Novo email é usada como subject, portanto criamos um novo token
            String token = authService.generateToken(usuario);
            Map<String, Object> resp = new HashMap<>();
            resp.put("usuario", usuario);
            resp.put("token", token);
            return ResponseEntity.ok(resp);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}