package com.tinto.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "fotos_vinho")
public class FotoVinho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String arquivoPath;

    @ManyToOne
    @JoinColumn(name = "vinho_id")
    @JsonIgnore 
    private Vinho vinho;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getArquivoPath() { return arquivoPath; }
    public void setArquivoPath(String arquivoPath) { this.arquivoPath = arquivoPath; }

    public Vinho getVinho() { return vinho; }
    public void setVinho(Vinho vinho) { this.vinho = vinho; }
}