package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Temporada;
import com.djuancito.reposteria.repositorio.TemporadaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class TemporadaServicio {

    @Autowired
    private TemporadaRepositorio temporadaRepositorio;

    
    public List<Temporada> obtenerTemporadasActivas() {
        LocalDate hoy = LocalDate.now();
        return temporadaRepositorio.findTemporadasActivas(hoy);
    }

 
    public List<Temporada> obtenerTodasLasTemporadas() {
        return temporadaRepositorio.findAll();
    }
}