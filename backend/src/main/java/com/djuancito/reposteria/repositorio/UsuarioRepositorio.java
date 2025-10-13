package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepositorio extends JpaRepository<Usuario, Integer> {
    // Método para buscar un usuario por su email y ver si ya existe
    Optional<Usuario> findByEmail(String email);
}