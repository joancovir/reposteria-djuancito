package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Adicional;
import com.djuancito.reposteria.repositorio.AdicionalRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AdicionalServicio {

    @Autowired
    private AdicionalRepositorio adicionalRepositorio;

    public List<Adicional> obtenerTodos() {
        return adicionalRepositorio.findAll();
    }

    public Adicional crear(Adicional adicional) {
        return adicionalRepositorio.save(adicional);
    }

    public Adicional actualizar(Integer id, Adicional adicional) {
        Optional<Adicional> existente = adicionalRepositorio.findById(id);
        if (existente.isPresent()) {
            Adicional actual = existente.get();
            actual.setNombre(adicional.getNombre());
            actual.setCategoria(adicional.getCategoria());
            actual.setCostoAdicional(adicional.getCostoAdicional());
            return adicionalRepositorio.save(actual);
        } else {
            throw new RuntimeException("Adicional no encontrado");
        }
    }

    public void eliminar(Integer id) {
        adicionalRepositorio.deleteById(id);
    }
}