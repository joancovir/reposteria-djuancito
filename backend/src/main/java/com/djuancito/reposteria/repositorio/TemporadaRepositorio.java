package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.Temporada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TemporadaRepositorio extends JpaRepository<Temporada, Integer> {

    @Query("SELECT t FROM Temporada t WHERE t.estado = 'activo' AND :fechaActual BETWEEN t.fechaInicio AND t.fechaFin")
    List<Temporada> findTemporadasActivas(@Param("fechaActual") LocalDate fechaActual);
}