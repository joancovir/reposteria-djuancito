package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.OpcionesGarantia;
import com.djuancito.reposteria.servicio.OpcionesGarantiaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/config")
@CrossOrigin(origins = "http://localhost:4200")
public class ConfigControlador {

    @Autowired
    private OpcionesGarantiaServicio servicio;

    @GetMapping("/garantias")
    public List<Integer> getActivas() {
        return servicio.getOpcionesActivas();
    }

    @GetMapping("/garantia/actual")
    public Integer getPrincipal() {
        return servicio.getGarantiaPrincipal();
    }

    @GetMapping("/garantias/admin")
    public List<OpcionesGarantia> obtenerTodas() {
        return servicio.obtenerTodas();
    }

    @PostMapping("/garantias")
    public OpcionesGarantia crear(@RequestBody OpcionesGarantia opcion) {
        return servicio.crear(opcion);
    }

    @PutMapping("/garantias/{id}")
    public OpcionesGarantia actualizar(@PathVariable Long id, @RequestBody OpcionesGarantia opcion) {
        return servicio.actualizar(id, opcion);
    }

    @PatchMapping("/garantias/{id}/toggle")
    public OpcionesGarantia toggleActivo(@PathVariable Long id) {
        return servicio.toggleActivo(id);
    }

    @DeleteMapping("/garantias/{id}")
    public void eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
    }
}