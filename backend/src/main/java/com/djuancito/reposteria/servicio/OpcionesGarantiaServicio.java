package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.OpcionesGarantia;
import com.djuancito.reposteria.repositorio.OpcionesGarantiaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OpcionesGarantiaServicio {

    @Autowired
    private OpcionesGarantiaRepositorio repo;

    public List<Integer> getOpcionesActivas() {
        return repo.findByActivoTrue()
                   .stream()
                   .map(OpcionesGarantia::getPorcentaje)
                   .sorted()
                   .toList();
    }

    public Integer getGarantiaPrincipal() {
        return repo.findById(1L)
                   .map(OpcionesGarantia::getPorcentaje)
                   .orElse(50);
    }

    // === NUEVOS MÉTODOS PARA ADMIN (CRUD) ===
    public List<OpcionesGarantia> obtenerTodas() {
        return repo.findAll();
    }

    public OpcionesGarantia crear(OpcionesGarantia opcion) {
        return repo.save(opcion);
    }

    public OpcionesGarantia actualizar(Long id, OpcionesGarantia datos) {
        OpcionesGarantia existente = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Opción no encontrada"));
        
        existente.setPorcentaje(datos.getPorcentaje());
        existente.setDescripcion(datos.getDescripcion());
        existente.setActivo(datos.getActivo());
        
        return repo.save(existente);
    }

    public void eliminar(Long id) {
        repo.deleteById(id);
    }

public void establecerPrincipal(Long id) {
    repo.findAll().forEach(o -> {
        o.setEsPrincipal(false);
        repo.save(o);
    });
    OpcionesGarantia nueva = repo.findById(id).orElseThrow();
    nueva.setEsPrincipal(true);
    repo.save(nueva);
}
    public OpcionesGarantia toggleActivo(Long id) {
        OpcionesGarantia opcion = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("No encontrada"));
        opcion.setActivo(!opcion.getActivo());
        return repo.save(opcion);
    }
}