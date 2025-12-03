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
    @Autowired private OpcionesGarantiaServicio opcionesGarantiaServicio;

    @Transactional
    public Pedido crearPedido(PedidoRequestDTO dto) {
        Usuario usuario = usuarioRepo.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setFechaPedido(LocalDateTime.now());
        pedido.setEstado(EstadoPedido.pendiente);
        pedido.setNota(dto.getNota());

        List<DetallePedido> detalles = new ArrayList<>();
        BigDecimal totalCalculado = BigDecimal.ZERO;

        for (DetalleRequestDTO detDTO : dto.getDetalles()) {
            Producto producto = productoRepo.findById(detDTO.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setProducto(producto);
            detalle.setCantidad(detDTO.getCantidad());

            BigDecimal precioUnitario = detDTO.getPrecioUnitario() != null
                    ? detDTO.getPrecioUnitario()
                    : producto.getPrecioBase();
            detalle.setPrecioUnitario(precioUnitario);
            detalle.setSubtotal(precioUnitario.multiply(BigDecimal.valueOf(detalle.getCantidad())));

            // PROMOCIÓN
            if (detDTO.getPromocionId() != null) {
                Promocion promo = promocionRepo.findById(detDTO.getPromocionId().intValue()).orElse(null);
                detalle.setPromocion(promo);
            }

            // PERSONALIZACIÓN - VERSIÓN FINAL 100% FUNCIONAL
            if (detDTO.getPersonalizacion() != null) {
                Personalizacion personalizacion = new Personalizacion();
                personalizacion.setDescripcionExtra(detDTO.getPersonalizacion().getDescripcionExtra());
                personalizacion.setCostoAdicional(
                        detDTO.getPersonalizacion().getCostoAdicional() != null
                                ? detDTO.getPersonalizacion().getCostoAdicional()
                                : BigDecimal.ZERO
                );

                // ADICIONALES: VIENEN COMO LISTA DE AdicionalDTO
                if (detDTO.getPersonalizacion().getAdicionalesSeleccionados() != null
                        && !detDTO.getPersonalizacion().getAdicionalesSeleccionados().isEmpty()) {

                    Set<Adicional> adicionales = detDTO.getPersonalizacion().getAdicionalesSeleccionados()
                            .stream()
                            .map(adicionalDto -> {  // AQUÍ ESTABA EL ERROR → usábamos "dto", ahora "adicionalDto"
                                Adicional adicional = new Adicional();
                                adicional.setAdicionalId(
                                        adicionalDto.getAdicionalId() != null
                                                ? adicionalDto.getAdicionalId().intValue()
                                                : null
                                );
                                adicional.setNombre(adicionalDto.getNombre());
                                adicional.setCostoAdicional(adicionalDto.getPrecio());
                                return adicional;
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

    public List<Pedido> obtenerPedidosPorUsuario(Long usuarioId) {
        return pedidoRepo.findByUsuarioUsuarioId(usuarioId);
    }

    public List<Pedido> obtenerTodosLosPedidos() {
        return pedidoRepo.findAll();
    }

    public Pedido actualizarEstadoPedido(Integer pedidoId, EstadoPedido nuevoEstado) {
        Pedido pedido = pedidoRepo.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        pedido.setEstado(nuevoEstado);
        return pedidoRepo.save(pedido);
    }

    public Pedido confirmarPedido(Integer pedidoId) {
        Pedido pedido = pedidoRepo.findById(pedidoId).orElse(null);
        if (pedido == null) return null;
        pedido.setEstado(EstadoPedido.aceptado);
        return pedidoRepo.save(pedido);
    }

    @Transactional
    public Pedido crearPedidoConConfirmacion(PedidoRequestDTO dto) {
        Pedido pedido = crearPedido(dto);
        pedido.setEstado(EstadoPedido.aceptado);
        return pedidoRepo.save(pedido);
    }
}