package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.Producto;
import com.djuancito.reposteria.entidad.TemporadaProducto;
import com.djuancito.reposteria.entidad.TemporadaProductoId;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemporadaProductoRepositorio extends JpaRepository<TemporadaProducto, TemporadaProductoId> {

    /**
     * Busca los productos asociados a la temporada que esté activa actualmente.
     * Criterios: estado='activo' Y la fecha actual (CURRENT_DATE()) está entre fechaInicio y fechaFin.
     */
    @Query("SELECT tp.producto FROM TemporadaProducto tp " +
           "JOIN tp.id.temporada t " + // Navegamos a la entidad Temporada
        "WHERE t.estado = 'activo' AND CURRENT_DATE() BETWEEN t.fechaInicio AND t.fechaFin")
    List<Producto> findProductosByTemporadaActiva();
}