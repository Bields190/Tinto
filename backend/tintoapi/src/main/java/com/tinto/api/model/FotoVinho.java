package com.tinto.api.model;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "fotos_vinho")
public class FotoVinho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String caminhoArquivo; // Caminho no servidor ou bucket (RF7) 

    @ManyToOne
    @JoinColumn(name = "vinho_id", nullable = false)
    private Vinho vinho; // Vinho ao qual a foto pertence

    // Construtor Padrão (Obrigatório para o JPA)
    public FotoVinho() {
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCaminhoArquivo() {
        return caminhoArquivo;
    }

    public void setCaminhoArquivo(String caminhoArquivo) {
        this.caminhoArquivo = caminhoArquivo;
    }

    public Vinho getVinho() {
        return vinho;
    }

    public void setVinho(Vinho vinho) {
        this.vinho = vinho;
    }

    // Equals e HashCode baseados no ID para garantir integridade
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FotoVinho fotoVinho = (FotoVinho) o;
        return Objects.equals(id, fotoVinho.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}