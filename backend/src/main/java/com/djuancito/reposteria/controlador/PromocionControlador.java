package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.Promocion;
import com.djuancito.reposteria.servicio.PromocionServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/promociones")
public class PromocionControlador {

    @Autowired
    private PromocionServicio promocionServicio;

    @GetMapping("/activas")
    public List<Promocion> obtenerActivas() {
        return promocionServicio.obtenerPromocionesActivas();
    }

    @GetMapping("/todas")
    public ResponseEntity<List<Promocion>> obtenerTodasLasPromociones() {
        return ResponseEntity.ok(promocionServicio.obtenerTodasLasPromociones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Promocion> obtenerPorId(@PathVariable Integer id) {
        return promocionServicio.obtenerPromocionConProductos(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}