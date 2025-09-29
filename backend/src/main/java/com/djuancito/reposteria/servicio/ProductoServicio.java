package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Producto;
import com.djuancito.reposteria.entidad.Personalizable;
import com.djuancito.reposteria.repositorio.ProductoRepositorio; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoServicio {

    @Autowired
    private ProductoRepositorio productoRepositorio; 

    public List<Producto> obtenerTodos() {
        return productoRepositorio.findAll();
    }

    public Optional<Producto> obtenerPorId(Integer id) {
        return productoRepositorio.findById(id);
    }

    public Producto guardar(Producto producto) {
        return productoRepositorio.save(producto);
    }

    public void eliminar(Integer id) {
        productoRepositorio.deleteById(id);
    }

public List<Producto> obtenerPorPersonalizable(String valor) {
        try {
            Personalizable personalizableEnum = Personalizable.valueOf(valor.toLowerCase()); 
            return productoRepositorio.findByPersonalizable(personalizableEnum);
        } catch (IllegalArgumentException e) {
            return java.util.Collections.emptyList();
        }
    }
}