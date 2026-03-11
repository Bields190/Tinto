package com.tinto.api.service;

import com.tinto.api.model.FotoVinho;
import com.tinto.api.repository.FotoVinhoRepository;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FotoVinhoService {

    @Autowired
    private FotoVinhoRepository fotoVinhoRepository;

    public String buscarUrlPrimeiraFoto(Long vinhoId) {
        List<FotoVinho> fotos = fotoVinhoRepository.findByVinhoId(vinhoId);

        if (fotos.isEmpty()) {
            return null;
        }

        String baseUrl = "http://localhost:8080/api/fotos/exibir/";
        return baseUrl + fotos.get(0).getArquivoPath();
    }

    public FotoVinho adicionarFoto(FotoVinho foto) {
        // Validação
        int quantidadeFotos = fotoVinhoRepository.countByVinhoId(foto.getVinho().getId());
        if (quantidadeFotos >= 3) {
            throw new IllegalStateException("Limite de 3 fotos por vinho atingido.");
        }
        return fotoVinhoRepository.save(foto);
    }
}