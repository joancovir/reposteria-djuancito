package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional; // <-- AÑADE ESTA LÍNEA

@Repository
public interface RolRepositorio extends JpaRepository<Rol, Integer> {
    // El método debe estar aquí adentro
    Optional<Rol> findByNombre(String nombre);
}