package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.DetallePedido;
import com.djuancito.reposteria.entidad.EstadoPedido;
import com.djuancito.reposteria.entidad.Pedido;
import com.djuancito.reposteria.entidad.Producto;
import com.djuancito.reposteria.entidad.Usuario; // <-- Importa Usuario
import com.djuancito.reposteria.entidad.dto.PedidoRequestDTO;
import com.djuancito.reposteria.repositorio.PedidoRepositorio;
import com.djuancito.reposteria.repositorio.ProductoRepositorio;
import com.djuancito.reposteria.repositorio.UsuarioRepositorio; // <-- Importa el Repositorio de Usuario
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoServicio {

    @Autowired
    private PedidoRepositorio pedidoRepositorio;

    @Autowired
    private ProductoRepositorio productoRepositorio;
    
    @Autowired
    private UsuarioRepositorio usuarioRepositorio; // <-- Inyecta el Repositorio de Usuario

    public List<Pedido> obtenerPedidosPorUsuario(Integer usuarioId) {
        return pedidoRepositorio.findByUsuarioUsuarioIdOrderByFechaPedidoDesc(usuarioId);
    }
    
    @Transactional
    public Pedido crearPedido(PedidoRequestDTO pedidoDTO) {
        // Busca el usuario completo a partir del ID
        Usuario usuario = usuarioRepositorio.findById(pedidoDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + pedidoDTO.getUsuarioId()));

        // 1. Crear el objeto Pedido principal
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario); // <-- CORRECCIÓN 1: Asigna el objeto Usuario completo
        pedido.setNota(pedidoDTO.getNota());
        pedido.setEstado(EstadoPedido.pendiente); 

        BigDecimal totalPedido = BigDecimal.ZERO;
        List<DetallePedido> detalles = new ArrayList<>();

        // 2. Recorrer los items del carrito para crear los detalles
        for (var detalleDTO : pedidoDTO.getDetalles()) {
            Producto producto = productoRepositorio.findById(detalleDTO.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + detalleDTO.getProductoId()));

            DetallePedido detalle = new DetallePedido();
            detalle.setProducto(producto);
            detalle.setCantidad(detalleDTO.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecioBase());
            
            BigDecimal subtotal = producto.getPrecioBase().multiply(new BigDecimal(detalleDTO.getCantidad()));
            detalle.setSubtotal(subtotal);
            
            detalle.setPedido(pedido);
            detalles.add(detalle);

            totalPedido = totalPedido.add(subtotal);
        }
        

        // 3. Asignar la lista de detalles y el total al pedido
        pedido.setDetalles(detalles);
        pedido.setTotal(totalPedido);

        // 4. Guardar el pedido
        return pedidoRepositorio.save(pedido);
    }
}