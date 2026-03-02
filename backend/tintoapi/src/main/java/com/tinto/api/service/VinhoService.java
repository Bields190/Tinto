package com.tinto.api.service;

import com.tinto.api.model.Vinho;
import com.tinto.api.repository.VinhoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VinhoService {

    @Autowired
    private VinhoRepository vinhoRepository;

    public Vinho registrarVinho(Vinho vinho) {
        // Lógica de negócio extra pode ser adicionada aqui
        return vinhoRepository.save(vinho);
    }

    public List<Vinho> buscarVinhosPorUsuario(Long usuarioId) {
        return vinhoRepository.findByUsuarioId(usuarioId);
    }
}