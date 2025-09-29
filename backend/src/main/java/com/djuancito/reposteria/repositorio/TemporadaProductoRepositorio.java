package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.TemporadaProducto;
import com.djuancito.reposteria.entidad.TemporadaProductoId;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TemporadaProductoRepositorio extends JpaRepository<TemporadaProducto, TemporadaProductoId> {


}