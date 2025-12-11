package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Pago;
import com.djuancito.reposteria.entidad.EstadoPago;
import com.djuancito.reposteria.entidad.MetodoPago;
import com.djuancito.reposteria.repositorio.PagoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PagoServicio {

    @Autowired
    private PagoRepositorio repo;

    // LISTAR TODOS CON pedidoId visible en el JSON
    public List<Pago> obtenerTodosConPedidoId() {
        return repo.findAll(); // Ya tiene @JsonProperty en Pago.java
    }

    public List<Pago> obtenerTodos() {
        return repo.findAll();
    }

    public Pago actualizarEstado(Integer id, String nuevoEstado) {
        Pago pago = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        pago.setEstado(EstadoPago.valueOf(nuevoEstado.toUpperCase()));
        return repo.save(pago);
    }

    // MÉTODO CORREGIDO: ahora funciona con enum MetodoPago
    public Pago actualizarMetodo(Integer id, String metodoStr) {
        Pago pago = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        // No permitir cambiar si ya fue validado y estaba PENDIENTE
        if (pago.getEstado() == EstadoPago.validado && pago.getMetodo() == MetodoPago.PENDIENTE) {
            throw new RuntimeException("No se puede cambiar el método una vez validado");
        }

        try {
            MetodoPago metodo = MetodoPago.valueOf(metodoStr.toUpperCase());
            pago.setMetodo(metodo);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Método inválido. Usa: PENDIENTE, yape, plin, efectivo");
        }

        return repo.save(pago);
    }

    public Pago guardar(Pago pago) {
        return repo.save(pago);
    }
}
