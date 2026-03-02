package com.tinto.api.service;

import com.tinto.api.model.Usuario;
import com.tinto.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.Period;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder; // Adicionado

    public Usuario cadastrarUsuario(Usuario usuario) {
        if (calcularIdade(usuario.getDataNascimento()) < 18) {
            throw new IllegalArgumentException("Usuário deve ser maior de 18 anos.");
        }
        
        // CRIPTOGRAFIA DA SENHA (NRF2)
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        
        return usuarioRepository.save(usuario);
    }

    private int calcularIdade(LocalDate dataNascimento) {
        return Period.between(dataNascimento, LocalDate.now()).getYears();
    }
}