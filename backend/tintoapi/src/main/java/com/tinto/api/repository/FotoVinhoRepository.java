package com.tinto.api.repository;

import com.tinto.api.model.FotoVinho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FotoVinhoRepository extends JpaRepository<FotoVinho, Long> {
    
    // Busca todas as fotos vinculadas a um determinado vinho
    List<FotoVinho> findByVinhoId(Long vinhoId);
    
    // Conta quantas fotos um vinho já possui (essencial para o limite de 3)
    int countByVinhoId(Long vinhoId);
}