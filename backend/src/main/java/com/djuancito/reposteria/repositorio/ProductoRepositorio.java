package com.djuancito.reposteria.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.djuancito.reposteria.entidad.Producto;

@Repository
public interface ProductoRepositorio extends JpaRepository<Producto, Integer> {
}