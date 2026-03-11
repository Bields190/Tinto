package com.tinto.api.service;

import com.tinto.api.dto.VinhoDTO;
import com.tinto.api.model.FotoVinho;
import com.tinto.api.model.Vinho;
import com.tinto.api.repository.VinhoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VinhoService {

    @Autowired
    private VinhoRepository vinhoRepository;

    public Vinho registrarVinho(Vinho vinho) {
        return vinhoRepository.save(vinho);
    }

    public List<Vinho> buscarVinhosPorUsuario(Long usuarioId) {
        return vinhoRepository.findByUsuarioId(usuarioId);
    }

    public Vinho buscarPorId(Long id) {
        return vinhoRepository.findById(id).orElseThrow(() -> new RuntimeException("Vinho não encontrado"));
    }

    public void deletarVinho(Vinho vinho) {
        // Apagar TODOS os arquivos físicos das fotos vinculadas
        if (vinho.getFotos() != null) {
            for (FotoVinho foto : vinho.getFotos()) {
                try {
                    Path rotaFoto = Paths.get("uploads").resolve(foto.getArquivoPath());
                    Files.deleteIfExists(rotaFoto);
                } catch (Exception e) {
                    System.err.println("Erro ao deletar arquivo: " + e.getMessage());
                }
            }
        }
        // Apagar do banco de dados
        vinhoRepository.delete(vinho);
    }

    public List<VinhoDTO> buscarVinhosComCapa(Long usuarioId) {
        List<Vinho> vinhos = vinhoRepository.findByUsuarioIdWithFotos(usuarioId);

        return vinhos.stream()
                .map(VinhoDTO::new)
                .collect(Collectors.toList());
    }
}