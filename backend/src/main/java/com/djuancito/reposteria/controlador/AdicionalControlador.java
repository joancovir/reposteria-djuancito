package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.Adicional;
import com.djuancito.reposteria.servicio.AdicionalServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/adicionales")
@CrossOrigin(origins = "*")
public class AdicionalControlador {

    @Autowired
    private AdicionalServicio adicionalServicio;

    @GetMapping
    public List<Adicional> obtenerTodos() {
        return adicionalServicio.obtenerTodos();
    }
}