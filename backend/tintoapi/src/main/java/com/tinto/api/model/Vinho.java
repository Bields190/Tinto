package com.tinto.api.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "vinhos")
public class Vinho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome; // Nome do vinho 

    private String vinicola; // Vinícola de origem 
    
    private Integer safra; // Ano de fabricação 
    
    private Double teorAlcoolico; // Teor alcoólico 
    
    private String tipoUva; // Tipo da uva 
    
    private LocalDate dataConsumo; // Data do registro 

    @Column(length = 1000)
    private String comentario; // Comentário pessoal/Opinião 

    private Integer avaliacao; // Avaliação de 1 a 5 estrelas 
    
    private Boolean isFavorito = false; // Marcador de favorito 

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario; // Relacionamento com o perfil pessoal [cite: 16, 37]

    @ElementCollection
    @CollectionTable(name = "harmonizacoes", joinColumns = @JoinColumn(name = "vinho_id"))
    @Column(name = "descricao")
    private List<String> harmonizacoes; // Sugestões como 'Massas', 'Queijos' [cite: 10, 38]

    // Construtor Padrão (Obrigatório para o JPA)
    public Vinho() {
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getVinicola() { return vinicola; }
    public void setVinicola(String vinicola) { this.vinicola = vinicola; }

    public Integer getSafra() { return safra; }
    public void setSafra(Integer safra) { this.safra = safra; }

    public Double getTeorAlcoolico() { return teorAlcoolico; }
    public void setTeorAlcoolico(Double teorAlcoolico) { this.teorAlcoolico = teorAlcoolico; }

    public String getTipoUva() { return tipoUva; }
    public void setTipoUva(String tipoUva) { this.tipoUva = tipoUva; }

    public LocalDate getDataConsumo() { return dataConsumo; }
    public void setDataConsumo(LocalDate dataConsumo) { this.dataConsumo = dataConsumo; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

    public Integer getAvaliacao() { return avaliacao; }
    public void setAvaliacao(Integer avaliacao) { this.avaliacao = avaliacao; }

    public Boolean getIsFavorito() { return isFavorito; }
    public void setIsFavorito(Boolean isFavorito) { this.isFavorito = isFavorito; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public List<String> getHarmonizacoes() { return harmonizacoes; }
    public void setHarmonizacoes(List<String> harmonizacoes) { this.harmonizacoes = harmonizacoes; }

    // Equals e HashCode baseados no ID para garantir integridade em coleções
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Vinho vinho = (Vinho) o;
        return Objects.equals(id, vinho.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}