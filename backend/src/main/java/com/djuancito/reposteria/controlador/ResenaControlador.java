package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.dto.ResenaDTO; // <-- Cambia la importación
import com.djuancito.reposteria.servicio.ResenaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resenas")
@CrossOrigin(origins = "*")
public class ResenaControlador { 

    @Autowired
    private ResenaServicio resenaServicio; 

    @GetMapping
    public List<ResenaDTO> obtenerTodasLasResenas() { // <-- Cambia el tipo de retorno
        return resenaServicio.obtenerTodas();
    }
}