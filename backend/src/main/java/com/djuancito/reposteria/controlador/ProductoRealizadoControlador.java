package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.ProductoRealizado;
import com.djuancito.reposteria.servicio.ProductoRealizadoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/productos-realizados")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductoRealizadoControlador {
@Autowired
    private ProductoRealizadoServicio service;

    @GetMapping
    public List<ProductoRealizado> listarProductosRealizados() {
        return service.obtenerTodos();
    }
}
