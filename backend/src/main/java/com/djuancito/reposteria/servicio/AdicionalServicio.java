package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Adicional;
import com.djuancito.reposteria.repositorio.AdicionalRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AdicionalServicio {

    @Autowired
    private AdicionalRepositorio adicionalRepositorio;

    public List<Adicional> obtenerTodos() {
        return adicionalRepositorio.findAll();
    }
}