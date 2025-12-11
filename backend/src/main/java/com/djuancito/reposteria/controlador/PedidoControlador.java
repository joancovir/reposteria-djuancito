package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.Pedido;
import com.djuancito.reposteria.entidad.EstadoPedido;
import com.djuancito.reposteria.entidad.dto.PedidoRequestDTO;
import com.djuancito.reposteria.servicio.PedidoServicio;
import com.djuancito.reposteria.servicio.PagoServicio; 
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Date;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*") 
public class PedidoControlador {

    @Autowired
    private PedidoServicio pedidoServicio;
    @Autowired
    private PagoServicio pagoServicio;
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

        // CREAR AUTOMÁTICAMENTE EL PAGO DE GARANTÍA
        if (dto.getGarantiaPagada() != null && dto.getGarantiaPagada().doubleValue() > 0) {
            Pago pagoGarantia = new Pago();
            pagoGarantia.setPedido(pedido);
            pagoGarantia.setMonto(dto.getGarantiaPagada());
            pagoGarantia.setMetodo("PENDIENTE");
            pagoGarantia.setCodigoOperacion("PENDIENTE_VALIDACION");
            pagoGarantia.setTipo("GARANTIA");
            pagoGarantia.setEstado(EstadoPago.pendiente_validacion);
            pagoGarantia.setFecha(new Date());

            pagoServicio.guardar(pagoGarantia);
        }

        // Inicializar detalles para el frontend
        Hibernate.initialize(pedido.getDetalles());
        if (pedido.getDetalles() != null) {
            pedido.getDetalles().forEach(detalle -> {
                Hibernate.initialize(detalle.getProducto());
                if (detalle.getPersonalizacion() != null) {
                    Hibernate.initialize(detalle.getPersonalizacion().getAdicionalesSeleccionados());
                }
            });
        }

        return ResponseEntity.ok(pedido);
    }
@PostMapping("/confirmar")
public ResponseEntity<?> confirmarPedido(@RequestBody PedidoRequestDTO request) {
    try {
        Pedido pedidoCreado = pedidoServicio.crearPedidoConConfirmacion(request);
        
        // FORZAR CARGA DE DETALLES
        Hibernate.initialize(pedidoCreado.getDetalles());
        if (pedidoCreado.getDetalles() != null) {
            pedidoCreado.getDetalles().forEach(d -> {
                Hibernate.initialize(d.getProducto());
                if (d.getPersonalizacion() != null) {
                    Hibernate.initialize(d.getPersonalizacion().getAdicionalesSeleccionados());
                }
            });
        }
        
        return ResponseEntity.ok(pedidoCreado);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Error: " + e.getMessage());
    }
}}
