
package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.servicio.DashboardServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*") 
public class DashboardControlador {

    @Autowired
    private DashboardServicio dashboardService;


    @GetMapping("/admin")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticasAdmin() {
        Map<String, Object> estadisticas = dashboardService.obtenerEstadisticasAdmin();
        return ResponseEntity.ok(estadisticas);
    }

}