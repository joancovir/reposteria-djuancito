
package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.Producto;
import com.djuancito.reposteria.entidad.Categoria; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepositorio extends JpaRepository<Producto, Integer> {
    
    List<Producto> findByPersonalizable(boolean personalizable);
    
    List<Producto> findByCategoria(Categoria categoria);

    List<Producto> findByNombreContainingIgnoreCase(String nombre);
}