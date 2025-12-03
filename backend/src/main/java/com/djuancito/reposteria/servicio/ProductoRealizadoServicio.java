package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.ProductoRealizado;
import com.djuancito.reposteria.repositorio.ProductoRealizadoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class ProductoRealizadoServicio {
    
@Autowired
    private ProductoRealizadoRepositorio repository;

    public List<ProductoRealizado> obtenerTodos() {
        return repository.findAll();
    }
}
