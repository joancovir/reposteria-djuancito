package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.Pedido;
import com.djuancito.reposteria.entidad.TipoPago;
import com.djuancito.reposteria.entidad.EstadoPedido;
import com.djuancito.reposteria.entidad.MetodoPago;
import com.djuancito.reposteria.entidad.dto.PedidoRequestDTO;
import com.djuancito.reposteria.servicio.PedidoServicio;
import com.djuancito.reposteria.servicio.PagoServicio; 
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.djuancito.reposteria.entidad.Pago;
import com.djuancito.reposteria.entidad.EstadoPago;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.Date;
import com.djuancito.reposteria.entidad.TipoPago;
import com.djuancito.reposteria.entidad.MetodoPago;
import java.time.LocalDateTime;
import com.djuancito.reposteria.repositorio.UsuarioRepositorio;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*") 
public class PedidoControlador {

    @Autowired
    private PedidoServicio pedidoServicio;
    @Autowired
    private PagoServicio pagoServicio;
    @Autowired
    private UsuarioRepositorio usuarioRepo;
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
    public ResponseEntity<?> crearPedido(@RequestBody PedidoRequestDTO dto) {
        if (dto == null || dto.getDetalles() == null || dto.getDetalles().isEmpty()) {
            return ResponseEntity.badRequest().body("El pedido debe contener al menos un producto.");
        }

        // Si usuarioId no viene en el body, resolverlo desde el contexto de seguridad
        if (dto.getUsuarioId() == null) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
                usuarioRepo.findByEmail(auth.getName()).ifPresent(u -> dto.setUsuarioId(u.getUsuarioId()));
            }
        }

        if (dto.getUsuarioId() == null) {
            return ResponseEntity.badRequest().body("No se pudo identificar al usuario para asignar el pedido. Por favor inicia sesión.");
        }

        try {
            Pedido pedido = pedidoServicio.crearPedido(dto);

            // CREAR PAGO DE GARANTÍA AUTOMÁTICO SI APLICA
            if (dto.getGarantiaPagada() != null && dto.getGarantiaPagada().doubleValue() > 0) {
                Pago pagoGarantia = new Pago();
                pagoGarantia.setPedido(pedido);
                pagoGarantia.setMontoAbonado(dto.getGarantiaPagada());
                pagoGarantia.setFechaPago(LocalDateTime.now());
                pagoGarantia.setTipoPago(TipoPago.GARANTIA);
                pagoGarantia.setMetodo(MetodoPago.yape);
                pagoGarantia.setCodigoOperacion(dto.getCodigoOperacion() != null && !dto.getCodigoOperacion().trim().isEmpty() 
                        ? dto.getCodigoOperacion().trim() : "PENDIENTE_VALIDACION");
                pagoGarantia.setEstado(EstadoPago.pendiente_validacion);

                pagoServicio.guardar(pagoGarantia);
            }

            // Inicializar detalles para el frontend
            if (pedido.getDetalles() != null) {
                Hibernate.initialize(pedido.getDetalles());
                pedido.getDetalles().forEach(detalle -> {
                    if (detalle.getProducto() != null) {
                        Hibernate.initialize(detalle.getProducto());
                    }
                    if (detalle.getPersonalizacion() != null) {
                        Hibernate.initialize(detalle.getPersonalizacion().getAdicionalesSeleccionados());
                    }
                });
            }

            return ResponseEntity.ok(pedido);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al crear el pedido: " + e.getMessage());
        }
    }

    @PostMapping("/{pedidoId}/pago-garantia")
    public ResponseEntity<?> registrarPagoGarantia(
            @PathVariable Integer pedidoId,
            @RequestBody Map<String, String> body) {

        String codigoOperacion = body.get("codigoOperacion");
        if (codigoOperacion == null || codigoOperacion.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El código de operación es requerido.");
        }

        Pedido pedido = pedidoServicio.obtenerPorId(pedidoId);
        if (pedido == null) {
            return ResponseEntity.notFound().build();
        }

        String metodoStr = body.get("metodo");
        MetodoPago metodo = MetodoPago.yape;
        if (metodoStr != null) {
            try {
                metodo = MetodoPago.valueOf(metodoStr.toLowerCase());
            } catch (Exception e) {
                try {
                    metodo = MetodoPago.valueOf(metodoStr.toUpperCase());
                } catch (Exception ignored) {}
            }
        }

        Pago pago = new Pago();
        pago.setPedido(pedido);
        pago.setMontoAbonado(pedido.getGarantiaPagada() != null ? pedido.getGarantiaPagada() : BigDecimal.ZERO);
        pago.setFechaPago(LocalDateTime.now());
        pago.setTipoPago(TipoPago.GARANTIA);
        pago.setMetodo(metodo);
        pago.setCodigoOperacion(codigoOperacion.trim());
        pago.setEstado(EstadoPago.pendiente_validacion);

        Pago guardado = pagoServicio.guardar(pago);
        return ResponseEntity.ok(guardado);
    }

    @PostMapping("/confirmar")
    public ResponseEntity<?> confirmarPedido(@RequestBody PedidoRequestDTO request) {
        try {
            if (request.getUsuarioId() == null) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
                    usuarioRepo.findByEmail(auth.getName()).ifPresent(u -> request.setUsuarioId(u.getUsuarioId()));
                }
            }

            if (request.getUsuarioId() == null) {
                return ResponseEntity.badRequest().body("No se pudo identificar al usuario para asignar el pedido. Por favor inicia sesión.");
            }

            Pedido pedidoCreado = pedidoServicio.crearPedidoConConfirmacion(request);

            // FORZAR CARGA DE DETALLES
            if (pedidoCreado.getDetalles() != null) {
                Hibernate.initialize(pedidoCreado.getDetalles());
                pedidoCreado.getDetalles().forEach(d -> {
                    if (d.getProducto() != null) {
                        Hibernate.initialize(d.getProducto());
                    }
                    if (d.getPersonalizacion() != null) {
                        Hibernate.initialize(d.getPersonalizacion().getAdicionalesSeleccionados());
                    }
                });
            }

            return ResponseEntity.ok(pedidoCreado);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al confirmar pedido: " + e.getMessage());
        }
    }
}
