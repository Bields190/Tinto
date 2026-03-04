package com.tinto.api.service;

import com.tinto.api.model.FotoVinho;
import com.tinto.api.repository.FotoVinhoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FotoVinhoService {

    @Autowired
    private FotoVinhoRepository fotoVinhoRepository;

    public FotoVinho adicionarFoto(FotoVinho foto) {
        // Validação 
        int quantidadeFotos = fotoVinhoRepository.countByVinhoId(foto.getVinho().getId());
        if (quantidadeFotos >= 3) {
            throw new IllegalStateException("Limite de 3 fotos por vinho atingido.");
        }
        return fotoVinhoRepository.save(foto);
    }
}