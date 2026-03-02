package com.tinto.api.controller;

import com.tinto.api.model.FotoVinho;
import com.tinto.api.service.FotoVinhoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fotos")
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
}