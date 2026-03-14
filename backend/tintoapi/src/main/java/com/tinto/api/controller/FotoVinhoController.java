package com.tinto.api.controller;

import com.tinto.api.model.FotoVinho;
import com.tinto.api.service.FotoVinhoService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fotos")
@CrossOrigin(origins = "http://localhost:4200")
public class FotoVinhoController {

    @Autowired
    private FotoVinhoService fotoVinhoService;

    @PostMapping("/adicionar")
    public ResponseEntity<?> adicionarFoto(@RequestBody FotoVinho foto) {
        try {
            FotoVinho novaFoto = fotoVinhoService.adicionarFoto(foto);
            return new ResponseEntity<>(novaFoto, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/exibir/{nomeArquivo:.+}")
    public ResponseEntity<Resource> exibirFoto(@PathVariable String nomeArquivo) {
        try {
            Path filePath = Paths.get("uploads").resolve(nomeArquivo);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/capa/{vinhoId}")
    public ResponseEntity<String> exibirCapa(@PathVariable Long vinhoId) {
        String url = fotoVinhoService.buscarUrlPrimeiraFoto(vinhoId);
        if (url != null) {
            return ResponseEntity.ok(url);
        } else {
            return ResponseEntity.noContent().build(); // Retorna 204 se não houver foto
        }
    }

    @DeleteMapping("/{fotoId}")
    public ResponseEntity<?> excluirFoto(@PathVariable Long fotoId) {
        try {
            fotoVinhoService.excluirFoto(fotoId);
            return ResponseEntity.ok().body(Collections.singletonMap("mensagem", "Foto excluída com sucesso!"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}