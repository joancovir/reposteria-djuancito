package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.Adicional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdicionalRepositorio extends JpaRepository<Adicional, Integer> {
}