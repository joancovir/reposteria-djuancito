package com.djuancito.reposteria;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import com.djuancito.reposteria.repositorio.*;
import com.djuancito.reposteria.servicio.PedidoServicio;
import com.djuancito.reposteria.controlador.PedidoControlador;

@SpringBootTest
class ReposteriaApplicationTests {

    @Autowired private ProductoRepositorio productoRepo;
    @Autowired private PromocionRepositorio promoRepo;
    @Autowired private ProductoRealizadoRepositorio realizadoRepo;
    @Autowired private ConfiguracionTiendaRepositorio configRepo;
    @Autowired private OpcionesGarantiaRepositorio garantiaRepo;
    @Autowired private QrPagoRepositorio qrRepo;
    @Autowired private UsuarioRepositorio usuarioRepo;
    @Autowired private PedidoRepositorio pedidoRepo;
    @Autowired private DetallePedidoRepositorio detalleRepo;
    @Autowired private ResenaRepositorio resenaRepo;
    @Autowired private TemporadaRepositorio temporadaRepo;
    @Autowired private AdicionalRepositorio adicionalRepo;
    @Autowired private ContactoRepositorio contactoRepo;

    @Autowired private PedidoServicio pedidoServicio;
    @Autowired private PedidoControlador pedidoControlador;

    @Test
    void testDiagnosticoTablas() {
        org.junit.jupiter.api.Assertions.assertTrue(productoRepo.count() > 0, "Debe cargar productos");
        org.junit.jupiter.api.Assertions.assertTrue(promoRepo.count() > 0, "Debe cargar promociones");
        org.junit.jupiter.api.Assertions.assertTrue(realizadoRepo.count() > 0, "Debe cargar productos realizados");
    }

    @Autowired private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Test
    void testDiagnosticoPedidos() {
        var usuarios = usuarioRepo.findAll();
        var productos = productoRepo.findAll();
        if (!usuarios.isEmpty() && !productos.isEmpty()) {
            var usuario = usuarios.get(0);
            var producto = productos.get(0);
            com.djuancito.reposteria.entidad.dto.PedidoRequestDTO dto = new com.djuancito.reposteria.entidad.dto.PedidoRequestDTO();
            dto.setUsuarioId(usuario.getUsuarioId());
            dto.setSubtotal(new java.math.BigDecimal("50.00"));
            dto.setGarantiaPagada(new java.math.BigDecimal("25.00"));
            dto.setResto(new java.math.BigDecimal("25.00"));
            dto.setTotal(new java.math.BigDecimal("50.00"));
            com.djuancito.reposteria.entidad.dto.DetalleRequestDTO det = new com.djuancito.reposteria.entidad.dto.DetalleRequestDTO();
            det.setProductoId(producto.getProductoId());
            det.setCantidad(1);
            det.setPrecioUnitario(producto.getPrecioBase());
            det.setSubtotal(producto.getPrecioBase());
            dto.setDetalles(java.util.List.of(det));

            System.out.println("Creando pedido de prueba...");
            var res = pedidoControlador.crearPedido(dto);
            System.out.println("RESULTADO crearPedido status: " + res.getStatusCode());
            var pedidoCreado = (com.djuancito.reposteria.entidad.Pedido) res.getBody();
            System.out.println("Pedido creado exitosamente con ID: " + pedidoCreado.getPedidoId());
            System.out.println("Usuario asignado al pedido: " + pedidoCreado.getUsuario().getNombre());

            System.out.println("Probando obtenerPedidosPorUsuario...");
            var resList = pedidoControlador.obtenerPedidosPorUsuario(usuario.getUsuarioId().longValue());
            System.out.println("obtenerPedidosPorUsuario status: " + resList.getStatusCode() + ", count: " + resList.getBody().size());
        }
    }
}

