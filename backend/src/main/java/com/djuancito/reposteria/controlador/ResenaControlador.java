package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.Resena;
import com.djuancito.reposteria.servicio.ResenaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resenas") 
@CrossOrigin(origins = "*") // ¡Importante para que Angular pueda acceder!
public class ResenaControlador { 

    @Autowired
    private ResenaServicio resenaServicio; 

    @GetMapping
    public List<Resena> obtenerTodasLasResenas() {
        return resenaServicio.obtenerTodas();
    }
}