
package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Producto;
import com.djuancito.reposteria.repositorio.ProductoRepositorio; 
import com.djuancito.reposteria.entidad.Categoria; 
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

   public List<Producto> obtenerPorCategoria(Categoria categoria) {
        return productoRepositorio.findByCategoria(categoria);
    }

    public List<Producto> obtenerPorPersonalizable(boolean esPersonalizable) {
        return productoRepositorio.findByPersonalizable(esPersonalizable);
    }
    
    public List<Producto> obtenerPorNombre(String termino) {
        return productoRepositorio.findByNombreContainingIgnoreCase(termino);
    }
}