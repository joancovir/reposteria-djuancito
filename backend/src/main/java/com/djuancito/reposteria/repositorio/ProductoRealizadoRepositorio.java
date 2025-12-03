package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.ProductoRealizado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRealizadoRepositorio  extends JpaRepository<ProductoRealizado, Integer>{
    
}
