package com.tinto.api.service;

import com.tinto.api.model.Usuario;
import com.tinto.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.Period;
import java.util.Optional;


@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public Usuario cadastrarUsuario(Usuario usuario) {
        if (calcularIdade(usuario.getDataNascimento()) < 18) {
            throw new IllegalArgumentException("Usuário deve ser maior de 18 anos.");
        }
        
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        
        return usuarioRepository.save(usuario);
    }

    public boolean validarSenha(String senhaAtual) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Optional<Usuario> optUsuario = usuarioRepository.findByEmail(email);
        if (optUsuario.isEmpty()) return false;
        Usuario usuario = optUsuario.get();
        return passwordEncoder.matches(senhaAtual, usuario.getSenha());
    }

    public Usuario alterarNome(String senhaAtual, String novoNome) {
        if (!validarSenha(senhaAtual)) {
            throw new IllegalArgumentException("Senha atual incorreta");
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        usuario.setNome(novoNome);
        return usuarioRepository.save(usuario);
    }

    public Usuario alterarSenha(String senhaAtual, String novaSenha) {
        if (!validarSenha(senhaAtual)) {
            throw new IllegalArgumentException("Senha atual incorreta");
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        return usuarioRepository.save(usuario);
    }

    public Usuario alterarEmail(String senhaAtual, String novoEmail) {
        if (!validarSenha(senhaAtual)) {
            throw new IllegalArgumentException("Senha atual incorreta");
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        if (usuarioRepository.findByEmail(novoEmail).isPresent()) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        usuario.setEmail(novoEmail);
        return usuarioRepository.save(usuario);
    }

    private int calcularIdade(LocalDate dataNascimento) {
        return Period.between(dataNascimento, LocalDate.now()).getYears();
    }

    public Usuario buscarPorEmail(String email) {
    return usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
}
}