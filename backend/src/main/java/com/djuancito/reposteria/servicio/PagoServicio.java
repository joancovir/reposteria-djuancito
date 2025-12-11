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

    // LISTAR TODOS CON pedidoId visible en JSON
    public List<Pago> obtenerTodosConPedidoId() {
        return repo.findAll();
        // El @JsonProperty en Pago.java ya hace que pedidoId aparezca
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

    // CAMBIAR MÉTODO: ahora acepta String y lo convierte a enum
    public Pago actualizarMetodo(Integer id, String metodoStr) {
        Pago pago = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        if (pago.getEstado() == EstadoPago.validado && pago.getMetodo() == MetodoPago.PENDIENTE) {
            throw new RuntimeException("No se puede cambiar método una vez validado");
        }

        MetodoPago metodo;
        try {
            metodo = MetodoPago.valueOf(metodoStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Método inválido: " + metodoStr);
        }

        }

        pago.setMetodo(metodo);
        return repo.save(pago);
    }

    public Pago guardar(Pago pago) {
        return repo.save(pago);
    }
}
