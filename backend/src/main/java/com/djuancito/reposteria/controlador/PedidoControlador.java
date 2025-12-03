package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.Pedido;
import com.djuancito.reposteria.entidad.EstadoPedido;
import com.djuancito.reposteria.entidad.dto.PedidoRequestDTO;
import com.djuancito.reposteria.servicio.PedidoServicio;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*") 
public class PedidoControlador {

    @Autowired
    private PedidoServicio pedidoServicio;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Pedido>> obtenerPedidosPorUsuario(@PathVariable Long usuarioId) {
        try {
            List<Pedido> pedidos = pedidoServicio.obtenerPedidosPorUsuario(usuarioId);
            
            pedidos.forEach(pedido -> {
                Hibernate.initialize(pedido.getDetalles());
                if (pedido.getPagos() != null) {
                    Hibernate.initialize(pedido.getPagos());
                }
            });

            return ResponseEntity.ok(pedidos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    
    @GetMapping("/todos")
    public ResponseEntity<List<Pedido>> obtenerTodosLosPedidos() {
        List<Pedido> pedidos = pedidoServicio.obtenerTodosLosPedidos();
        return ResponseEntity.ok(pedidos);
    }

    
    @PutMapping("/{pedidoId}/estado")
    public ResponseEntity<Pedido> actualizarEstadoPedido(
            @PathVariable Integer pedidoId,
            @RequestBody Map<String, String> body) {

        String nuevoEstadoStr = body.get("estado");
        if (nuevoEstadoStr == null || nuevoEstadoStr.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
            EstadoPedido nuevoEstado = EstadoPedido.valueOf(nuevoEstadoStr.toUpperCase());
            Pedido pedido = pedidoServicio.actualizarEstadoPedido(pedidoId, nuevoEstado);
            
            if (pedido == null) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(pedido);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
    
    @PostMapping
    public ResponseEntity<Pedido> crearPedido(@RequestBody PedidoRequestDTO dto) {
        if (dto == null || dto.getUsuarioId() == null || dto.getDetalles() == null || dto.getDetalles().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Pedido pedido = pedidoServicio.crearPedido(dto);
        return ResponseEntity.ok(pedido);
    }

@PostMapping("/confirmar")
public ResponseEntity<?> confirmarPedido(@RequestBody PedidoRequestDTO request) {
    try {
        // Validación básica
        if (request.getUsuarioId() == null || request.getDetalles() == null || request.getDetalles().isEmpty()) {
            return ResponseEntity.badRequest().body("Faltan datos obligatorios");
        }

        // Usa el mismo servicio que ya tienes en @PostMapping
        Pedido pedidoCreado = pedidoServicio.crearPedidoConConfirmacion(request);
        
        return ResponseEntity.ok(pedidoCreado);

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Error al confirmar: " + e.getMessage());
    }
}

}