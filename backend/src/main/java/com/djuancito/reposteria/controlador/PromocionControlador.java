package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.Promocion;
import com.djuancito.reposteria.servicio.PromocionServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/promociones")
@CrossOrigin(origins = "*")
public class PromocionControlador {

    @Autowired
    private PromocionServicio promocionServicio;

    @GetMapping("/activas")
    public List<Promocion> obtenerActivas() {
        return promocionServicio.obtenerPromocionesActivas();
    }
}