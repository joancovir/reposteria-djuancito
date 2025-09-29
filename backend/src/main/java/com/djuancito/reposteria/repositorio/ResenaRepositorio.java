package com.djuancito.reposteria.repositorio;


import com.djuancito.reposteria.entidad.Resena;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResenaRepositorio extends JpaRepository<Resena, Integer> {

}