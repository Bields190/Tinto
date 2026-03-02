package com.tinto.api.controller;

import com.tinto.api.model.Vinho;
import com.tinto.api.service.VinhoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vinhos")
public class VinhoController {

    @Autowired
    private VinhoService vinhoService;

    @PostMapping("/registrar")
    public ResponseEntity<Vinho> registrarVinho(@RequestBody Vinho vinho) {
        Vinho novoVinho = vinhoService.registrarVinho(vinho);
        return new ResponseEntity<>(novoVinho, HttpStatus.CREATED);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Vinho>> listarPorUsuario(@PathVariable Long usuarioId) {
        List<Vinho> vinhos = vinhoService.buscarVinhosPorUsuario(usuarioId);
        return new ResponseEntity<>(vinhos, HttpStatus.OK);
    }
}