package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.*;
import com.djuancito.reposteria.entidad.dto.PedidoRequestDTO;
import com.djuancito.reposteria.entidad.dto.DetalleRequestDTO;
import com.djuancito.reposteria.entidad.dto.AdicionalDTO;
import com.djuancito.reposteria.repositorio.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PedidoServicio {

    @Autowired private PedidoRepositorio pedidoRepo;
    @Autowired private UsuarioRepositorio usuarioRepo;
    @Autowired private ProductoRepositorio productoRepo;
    @Autowired private PromocionRepositorio promocionRepo;
    @Autowired private AdicionalRepositorio adicionalRepo;
    @Autowired private OpcionesGarantiaServicio opcionesGarantiaServicio;

    @Transactional
    public Pedido crearPedido(PedidoRequestDTO dto) {
        Usuario usuario = usuarioRepo.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + dto.getUsuarioId()));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setFechaPedido(LocalDateTime.now());
        pedido.setEstado(EstadoPedido.pendiente);
        pedido.setNota(dto.getNota());

        List<DetallePedido> detalles = new ArrayList<>();
        BigDecimal totalCalculado = BigDecimal.ZERO;

        for (DetalleRequestDTO detDTO : dto.getDetalles()) {
            Producto producto = null;
            if (detDTO.getProductoId() != null) {
                producto = productoRepo.findById(detDTO.getProductoId()).orElse(null);
            }

            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setProducto(producto);
            detalle.setCantidad(detDTO.getCantidad() != null ? detDTO.getCantidad() : 1);

            BigDecimal precioUnitario = detDTO.getPrecioUnitario() != null
                    ? detDTO.getPrecioUnitario()
                    : (producto != null && producto.getPrecioBase() != null ? producto.getPrecioBase() : BigDecimal.ZERO);
            detalle.setPrecioUnitario(precioUnitario);
            detalle.setSubtotal(precioUnitario.multiply(BigDecimal.valueOf(detalle.getCantidad())));

            // PROMOCIÓN
            if (detDTO.getPromocionId() != null) {
                Promocion promo = promocionRepo.findById(detDTO.getPromocionId().intValue()).orElse(null);
                detalle.setPromocion(promo);
            }

            // PERSONALIZACIÓN
            if (detDTO.getPersonalizacion() != null) {
                Personalizacion personalizacion = new Personalizacion();
                String descExtra = detDTO.getPersonalizacion().getDescripcionExtra();
                personalizacion.setDescripcionExtra(descExtra != null && !descExtra.trim().isEmpty() ? descExtra : "Personalización solicitada");
                personalizacion.setCostoAdicional(
                        detDTO.getPersonalizacion().getCostoAdicional() != null
                                ? detDTO.getPersonalizacion().getCostoAdicional()
                                : BigDecimal.ZERO
                );

                // ADICIONALES
                if (detDTO.getPersonalizacion().getAdicionalesSeleccionados() != null
                        && !detDTO.getPersonalizacion().getAdicionalesSeleccionados().isEmpty()) {

                    Set<Adicional> adicionales = detDTO.getPersonalizacion().getAdicionalesSeleccionados()
                            .stream()
                            .map(adicionalDto -> {
                                if (adicionalDto.getAdicionalId() != null) {
                                    return adicionalRepo.findById(adicionalDto.getAdicionalId().intValue())
                                            .orElseGet(() -> {
                                                Adicional a = new Adicional();
                                                a.setAdicionalId(adicionalDto.getAdicionalId().intValue());
                                                a.setNombre(adicionalDto.getNombre() != null ? adicionalDto.getNombre() : "Adicional");
                                                a.setCostoAdicional(adicionalDto.getPrecio() != null ? adicionalDto.getPrecio() : BigDecimal.ZERO);
                                                return a;
                                            });
                                }
                                Adicional a = new Adicional();
                                a.setNombre(adicionalDto.getNombre() != null ? adicionalDto.getNombre() : "Adicional");
                                a.setCostoAdicional(adicionalDto.getPrecio() != null ? adicionalDto.getPrecio() : BigDecimal.ZERO);
                                return a;
                            })
                            .collect(Collectors.toSet());

                    personalizacion.setAdicionalesSeleccionados(adicionales);
                }

                personalizacion.setDetalle(detalle);
                detalle.setPersonalizacion(personalizacion);
            }

            detalles.add(detalle);
            totalCalculado = totalCalculado.add(detalle.getSubtotal());
        }

        pedido.setDetalles(detalles);
        pedido.setTotal(totalCalculado);

        // Valores del frontend (con fallback seguro)
        pedido.setSubtotal(dto.getSubtotal() != null ? dto.getSubtotal() : totalCalculado);
        pedido.setGarantiaPagada(dto.getGarantiaPagada() != null ? dto.getGarantiaPagada() : totalCalculado.multiply(BigDecimal.valueOf(0.5)));
        pedido.setResto(dto.getResto() != null ? dto.getResto() : totalCalculado.subtract(pedido.getGarantiaPagada()));

        // Monto garantía calculado
        Integer porcentaje = opcionesGarantiaServicio.getGarantiaPrincipal();
        BigDecimal montoGarantia = totalCalculado.multiply(BigDecimal.valueOf(porcentaje))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        pedido.setMontoGarantia(montoGarantia);

        return pedidoRepo.save(pedido);
    }

    @Transactional(readOnly = true)
    public List<Pedido> obtenerPedidosPorUsuario(Long usuarioId) {
        return pedidoRepo.findByUsuarioUsuarioId(usuarioId);
    }

    @Transactional(readOnly = true)
    public List<Pedido> obtenerPedidosPorUsuario(Integer usuarioId) {
        return pedidoRepo.findByUsuarioUsuarioId(usuarioId);
    }

    @Transactional(readOnly = true)
    public List<Pedido> obtenerTodosLosPedidos() {
        return pedidoRepo.findAll();
    }

    @Transactional
    public Pedido actualizarEstadoPedido(Integer pedidoId, EstadoPedido nuevoEstado) {
        Pedido pedido = pedidoRepo.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        pedido.setEstado(nuevoEstado);
        return pedidoRepo.save(pedido);
    }

    @Transactional
    public Pedido confirmarPedido(Integer pedidoId) {
        Pedido pedido = pedidoRepo.findById(pedidoId).orElse(null);
        if (pedido == null) return null;
        pedido.setEstado(EstadoPedido.aceptado);
        return pedidoRepo.save(pedido);
    }

    @Transactional(readOnly = true)
    public Pedido obtenerPorId(Integer pedidoId) {
        return pedidoRepo.findById(pedidoId).orElse(null);
    }

    @Transactional
    public Pedido crearPedidoConConfirmacion(PedidoRequestDTO dto) {
        Pedido pedido = crearPedido(dto);
        pedido.setEstado(EstadoPedido.aceptado);
        return pedidoRepo.save(pedido);
    }
}
