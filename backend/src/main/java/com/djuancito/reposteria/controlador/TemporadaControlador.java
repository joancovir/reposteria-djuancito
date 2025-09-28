// Archivo: TemporadaControlador.java
package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.Producto;
import com.djuancito.reposteria.servicio.TemporadaServicio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/temporada") 
@CrossOrigin(origins = "*")
public class TemporadaControlador { 

    @Autowired
    private TemporadaServicio temporadaServicio; 

    @GetMapping("/productos-destacados") // Nuevo endpoint: /api/temporada/productos-destacados
    public List<Producto> obtenerDestacados() {
        return temporadaServicio.obtenerProductosDeTemporadaActiva();
    }
}