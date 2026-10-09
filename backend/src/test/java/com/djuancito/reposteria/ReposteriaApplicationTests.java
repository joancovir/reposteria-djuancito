package com.djuancito.reposteria;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import com.djuancito.reposteria.repositorio.*;

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

    @Test
    void testDiagnosticoTablas() {
        org.junit.jupiter.api.Assertions.assertTrue(productoRepo.count() > 0, "Debe cargar productos");
        org.junit.jupiter.api.Assertions.assertTrue(promoRepo.count() > 0, "Debe cargar promociones");
        org.junit.jupiter.api.Assertions.assertTrue(realizadoRepo.count() > 0, "Debe cargar productos realizados");
    }

}

