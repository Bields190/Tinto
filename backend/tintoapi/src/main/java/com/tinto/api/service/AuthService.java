package com.tinto.api.service;

import com.tinto.api.model.Usuario;
import com.tinto.api.repository.UsuarioRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private final String SECRET_KEY = "TintoSecretKey"; // Chave secreta para o JWT

    public String login(String email, String senha) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isPresent() && passwordEncoder.matches(senha, usuarioOpt.get().getSenha())) {
            // Gera o Token JWT
            return Jwts.builder()
                    .setSubject(usuarioOpt.get().getEmail())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 dia
                    .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                    .compact();
        }
        throw new RuntimeException("Credenciais inválidas");
    }
}