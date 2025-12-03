package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Pago;
import com.djuancito.reposteria.entidad.EstadoPago;  
import com.djuancito.reposteria.repositorio.PagoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PagoServicio {

    @Autowired
    private PagoRepositorio repo;

    public List<Pago> obtenerTodos() {
        return repo.findAll();
    }

    public Pago actualizarEstado(Integer id, String nuevoEstado) {
        Pago pago = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado: " + id));

        try {
            pago.setEstado(EstadoPago.valueOf(nuevoEstado.toLowerCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado inválido: " + nuevoEstado);
        }

        return repo.save(pago);
    }

    
}