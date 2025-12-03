package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.Contacto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContactoRepositorio extends JpaRepository<Contacto, Integer> {
    List<Contacto> findByEmailOrderByFechaDesc(String email);
    List<Contacto> findAllByOrderByFechaDesc();
}