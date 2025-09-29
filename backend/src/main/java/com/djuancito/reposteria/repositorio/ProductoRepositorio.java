package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.Producto;
import com.djuancito.reposteria.entidad.Personalizable; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepositorio extends JpaRepository<Producto, Integer> {
    List<Producto> findByPersonalizable(Personalizable personalizable);
}