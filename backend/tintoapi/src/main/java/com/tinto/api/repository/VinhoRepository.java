package com.tinto.api.repository;

import com.tinto.api.model.Vinho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VinhoRepository extends JpaRepository<Vinho, Long> {
    
    // Busca vinhos de um usuário específico
    List<Vinho> findByUsuarioId(Long usuarioId);
    
    List<Vinho> findByNomeContainingIgnoreCase(String nome);
    List<Vinho> findByVinicolaContainingIgnoreCase(String vinicola);
    List<Vinho> findByTipoUvaContainingIgnoreCase(String tipoUva);
}