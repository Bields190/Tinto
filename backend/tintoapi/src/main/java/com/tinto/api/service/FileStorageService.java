package com.tinto.api.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    // Define a pasta onde as fotos serão salvas 
    private final Path root = Paths.get("uploads");

    public String salvarArquivo(MultipartFile arquivo) {
        try {
            // Cria a pasta caso não exista
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            // Gera um nome único para o arquivo para não sobrescrever outros
            String nomeArquivo = UUID.randomUUID().toString() + "_" + arquivo.getOriginalFilename();
            
            Files.copy(arquivo.getInputStream(), this.root.resolve(nomeArquivo), StandardCopyOption.REPLACE_EXISTING);
            
            return nomeArquivo; // Retorna o nome para salvar no banco de dados
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível salvar o arquivo: " + e.getMessage());
        }
    }
}