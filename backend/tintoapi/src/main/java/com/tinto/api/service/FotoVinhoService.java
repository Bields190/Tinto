package com.tinto.api.service;

import com.tinto.api.model.FotoVinho;
import com.tinto.api.repository.FotoVinhoRepository;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

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

    public void excluirFoto(Long fotoId) {
        // Busca o registro no banco
        FotoVinho foto = fotoVinhoRepository.findById(fotoId)
                .orElseThrow(() -> new RuntimeException("Foto não encontrada com ID: " + fotoId));

        try {
            // Tenta apagar o arquivo físico da pasta uploads
            Path filePath = Paths.get("uploads").resolve(foto.getArquivoPath());
            Files.deleteIfExists(filePath);

            // Remove o registro do banco de dados
            fotoVinhoRepository.delete(foto);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao deletar arquivo físico da foto.");
        }
    }
}