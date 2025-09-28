package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Resena;
import com.djuancito.reposteria.repositorio.ResenaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ResenaServicio {

    @Autowired
    private ResenaRepositorio resenaRepositorio; 

    public List<Resena> obtenerTodas() {
        // En un caso real, aquí podrías filtrar para devolver solo las reseñas con estado 'aprobado'
        return resenaRepositorio.findAll();
    }
}