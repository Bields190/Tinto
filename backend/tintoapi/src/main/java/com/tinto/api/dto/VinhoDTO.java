package com.tinto.api.dto;

import com.tinto.api.model.Vinho;

public class VinhoDTO {
    private Long id;
    private String nome;
    private String pais;
    private Integer avaliacao; 
    private String urlCapa;

    public VinhoDTO(Vinho vinho) {
        this.id = vinho.getId();
        this.nome = vinho.getNome();
        this.pais = vinho.getPais();
        this.avaliacao = vinho.getAvaliacao();

        if (vinho.getFotos() != null && !vinho.getFotos().isEmpty()) {
            this.urlCapa = "http://localhost:8080/api/fotos/exibir/" + vinho.getFotos().get(0).getArquivoPath();
        } else {
            this.urlCapa = null;
        }
    }

    // Getters
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getPais() { return pais; }
    public Integer getAvaliacao() { return avaliacao; }
    public String getUrlCapa() { return urlCapa; }
}