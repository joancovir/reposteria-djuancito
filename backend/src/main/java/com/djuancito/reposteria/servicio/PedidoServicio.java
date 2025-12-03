package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Pedido;
import com.djuancito.reposteria.entidad.DetallePedido;
import com.djuancito.reposteria.entidad.Usuario;
import com.djuancito.reposteria.entidad.Producto;
import com.djuancito.reposteria.entidad.EstadoPedido;
import com.djuancito.reposteria.entidad.dto.PedidoRequestDTO;     
import com.djuancito.reposteria.entidad.dto.DetalleRequestDTO;   
import com.djuancito.reposteria.repositorio.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.djuancito.reposteria.entidad.Promocion; 
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoServicio {

    @Autowired private PedidoRepositorio pedidoRepo;
    @Autowired private UsuarioRepositorio usuarioRepo;
    @Autowired private ProductoRepositorio productoRepo;
    @Autowired private OpcionesGarantiaServicio opcionesGarantiaServicio;
    @Autowired private PromocionRepositorio promocionRepo; 
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

        BigDecimal precioUsar = detDTO.getPrecioUnitario() != null 
            ? detDTO.getPrecioUnitario() 
            : producto.getPrecioBase();

        detalle.setPrecioUnitario(precioUsar);
        BigDecimal subtotalDetalle = precioUsar.multiply(BigDecimal.valueOf(detDTO.getCantidad()))
            .setScale(2, RoundingMode.HALF_UP);
        detalle.setSubtotal(subtotalDetalle);
        totalCalculado = totalCalculado.add(subtotalDetalle);
        
if (detDTO.getPromocionId() != null) {
    Integer promocionId = detDTO.getPromocionId().intValue(); 

    Promocion promocion = promocionRepo.findById(promocionId)
        .orElseThrow(() -> new RuntimeException("Promoción no encontrada"));
    
    detalle.setPromocion(promocion);
}
}

    pedido.setDetalles(detalles);
    pedido.setTotal(totalCalculado);

    // AQUÍ ESTÁ LA CLAVE: Usa los valores del frontend con seguridad
    pedido.setSubtotal(dto.getSubtotal() != null ? dto.getSubtotal() : totalCalculado);
    pedido.setGarantiaPagada(dto.getGarantiaPagada() != null ? dto.getGarantiaPagada() : totalCalculado.multiply(BigDecimal.valueOf(0.5)));
    pedido.setResto(dto.getResto() != null ? dto.getResto() : totalCalculado.subtract(pedido.getGarantiaPagada()));

    // Opcional: montoGarantia calculado
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
    
}