package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.ConfiguracionTienda;
import com.djuancito.reposteria.repositorio.ConfiguracionTiendaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class ConfigTiendaControlador {

    @Autowired
    private ConfiguracionTiendaRepositorio repo;

    @GetMapping("/api/config-tienda")
    public ResponseEntity<Map<String, Object>> obtenerConfig() {
        ConfiguracionTienda config = repo.findById(1L)
                .orElseThrow(() -> new RuntimeException("Configuración no encontrada"));

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("nombreTienda", config.getNombreTienda());
        respuesta.put("direccion", config.getDireccion());
        respuesta.put("referencia", config.getReferencia());
        respuesta.put("telefono", config.getTelefono());
        respuesta.put("latitud", config.getLatitud());
        respuesta.put("longitud", config.getLongitud());
        respuesta.put("googleMapsEmbed", config.getGoogleMapsEmbed());

        return ResponseEntity.ok(respuesta);
    }
}
