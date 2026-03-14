package com.tinto.api.repository;

import com.tinto.api.model.Vinho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VinhoRepository extends JpaRepository<Vinho, Long> {

        List<Vinho> findByUsuarioId(Long usuarioId);

        @Query("SELECT v FROM Vinho v WHERE v.usuario.id = :usuarioId " +
                        "AND (:termo IS NULL OR (" +
                        "LOWER(v.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
                        "LOWER(v.vinicola) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
                        "LOWER(v.tipoUva) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
                        "LOWER(v.pais) LIKE LOWER(CONCAT('%', :termo, '%'))" +
                        ")) " +
                        "AND (:safra IS NULL OR v.safra = :safra) " +
                        "AND (:teorAlcoolico IS NULL OR v.teorAlcoolico >= :teorAlcoolico) " +
                        "AND (:dataConsumo IS NULL OR v.dataConsumo = :dataConsumo) " +
                        "AND (:avaliacao IS NULL OR v.avaliacao >= :avaliacao) " +
                        "AND (:isFavorito IS NULL OR v.isFavorito = :isFavorito)")
        List<Vinho> buscarComFiltros(
                        @Param("usuarioId") Long usuarioId,
                        @Param("termo") String termo,
                        @Param("safra") Integer safra,
                        @Param("teorAlcoolico") Double teorAlcoolico,
                        @Param("dataConsumo") LocalDate dataConsumo,
                        @Param("avaliacao") Integer avaliacao,
                        @Param("isFavorito") Boolean isFavorito);

        @Query("SELECT DISTINCT v FROM Vinho v WHERE v.usuario.id = :usuarioId")
        List<Vinho> findByUsuarioIdWithFotos(@Param("usuarioId") Long usuarioId);

}