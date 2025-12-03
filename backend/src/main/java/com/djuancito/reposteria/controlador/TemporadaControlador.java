package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.Temporada;
import com.djuancito.reposteria.servicio.TemporadaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/temporada")
@CrossOrigin(origins = "*")
public class TemporadaControlador {

    @Autowired
    private TemporadaServicio temporadaServicio; 

    @GetMapping("/activas")
    public ResponseEntity<List<Temporada>> obtenerActivas() {
        List<Temporada> activas = temporadaServicio.obtenerTemporadasActivas();
        return ResponseEntity.ok(activas);
    }
    
    @GetMapping("/todas")
    public ResponseEntity<List<Temporada>> obtenerTodas() {
        List<Temporada> todas = temporadaServicio.obtenerTodasLasTemporadas();
        return ResponseEntity.ok(todas);
    }
}