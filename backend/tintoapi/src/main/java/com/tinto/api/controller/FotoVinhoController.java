package com.tinto.api.controller;

import com.tinto.api.model.FotoVinho;
import com.tinto.api.service.FotoVinhoService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;

import java.net.MalformedURLException;
import java.net.URI;
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

    @GetMapping("/capa/{vinhoId}")
    public ResponseEntity<Void> exibirCapa(@PathVariable Long vinhoId) {
        String urlCompleta = fotoVinhoService.buscarUrlPrimeiraFoto(vinhoId);

        if (urlCompleta == null) {
            return ResponseEntity.notFound().build();
        }

        // Redireciona para a URL que o WebConfig agora gerencia
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(urlCompleta))
                .build();
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