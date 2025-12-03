package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.EstadoPedido;
import com.djuancito.reposteria.entidad.EstadoResena; // Necesitarás crear este enum si no existe
import com.djuancito.reposteria.repositorio.PedidoRepositorio;
import com.djuancito.reposteria.repositorio.ResenaRepositorio;
import com.djuancito.reposteria.repositorio.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardServicio {
    
@Autowired private PedidoRepositorio pedidoRepositorio;
    @Autowired private ResenaRepositorio resenaRepositorio;
    @Autowired private UsuarioRepositorio usuarioRepositorio;

    public Map<String, Object> obtenerEstadisticasAdmin() {
        Map<String, Object> estadisticas = new HashMap<>();

        
        LocalDateTime inicioHoy = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime finHoy = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
 
        long pedidosHoy = pedidoRepositorio.count(); // Temporal
        estadisticas.put("pedidosHoy", pedidosHoy);

         long pendientes = pedidoRepositorio.countByEstado(EstadoPedido.pendiente) + pedidoRepositorio.countByEstado(EstadoPedido.en_preparacion); // Temporal
        estadisticas.put("pendientes", pendientes);

        long resenasTotal = resenaRepositorio.count();
        estadisticas.put("resenasTotal", resenasTotal);


     
        long pedidosTotales = pedidoRepositorio.count();
        estadisticas.put("pedidosTotales", pedidosTotales);

       
        BigDecimal ventasTotales = pedidoRepositorio.findAll().stream()
                                    .filter(p -> p.getEstado() == EstadoPedido.entregado)
                                    .map(p -> p.getTotal() != null ? p.getTotal() : BigDecimal.ZERO)
                                    .reduce(BigDecimal.ZERO, BigDecimal::add); 
        estadisticas.put("ventasTotales", ventasTotales);

        long resenasPendientes = 0; 
        estadisticas.put("resenasPendientes", resenasPendientes);


        long usuariosRegistrados = usuarioRepositorio.count();
        estadisticas.put("usuariosRegistrados", usuariosRegistrados);

       

        return estadisticas;
    }
}