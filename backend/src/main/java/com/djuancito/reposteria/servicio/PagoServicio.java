package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Pago;
import com.djuancito.reposteria.entidad.EstadoPago;
import com.djuancito.reposteria.repositorio.PagoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PagoServicio {

    @Autowired
    private PagoRepositorio repo;

    // LISTAR TODOS CON pedidoId (para que el admin vea el número de pedido)
    public List<Pago> obtenerTodosConPedidoId() {
        return repo.findAll().stream()
                .peek(p -> {
                    if (p.getPedido() != null) {
                        p.setPedidoId(p.getPedido().getId());
                    }
                })
                .collect(Collectors.toList());
    }

    // Método viejo (puedes dejarlo)
    public List<Pago> obtenerTodos() {
        return repo.findAll();
    }

    // CAMBIAR ESTADO: validar o rechazar
    public Pago actualizarEstado(Integer id, String nuevoEstado) {
        Pago pago = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado: " + id));

        try {
            pago.setEstado(EstadoPago.valueOf(nuevoEstado.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado inválido: " + nuevoEstado);
        }
        return repo.save(pago);
    }

    // CAMBIAR MÉTODO: YAPE / PLIN / EFECTIVO (ahora con public bien escrito)
    public Pago actualizarMetodo(Integer id, String nuevoMetodo) {
        Pago pago = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado: " + id));

        // No permitir cambiar método si ya fue validado y estaba en PENDIENTE
        if (pago.getEstado() == EstadoPago.validado && "PENDIENTE".equalsIgnoreCase(pago.getMetodo())) {
            throw new RuntimeException("No se puede cambiar el método una vez validado");
        }

        pago.setMetodo(nuevoMetodo.toLowerCase());
        return repo.save(pago);
    }

    // GUARDAR PAGO (para crear nuevos)
    public Pago guardar(Pago pago) {
        return repo.save(pago);
    }
}
