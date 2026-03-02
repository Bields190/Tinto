package com.tinto.api.repository;

import com.tinto.api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Busca usuário pelo e-mail para autenticação
    Optional<Usuario> findByEmail(String email);
}