package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.EstadoResena; 
import com.djuancito.reposteria.entidad.Resena; 
import com.djuancito.reposteria.entidad.dto.ResenaDTO;
import com.djuancito.reposteria.servicio.ResenaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException; 
import java.util.List;
import java.util.Map; 

@RestController
@RequestMapping("/api/resenas")
@CrossOrigin(origins = "*")
public class ResenaControlador { 

    @Autowired
    private ResenaServicio resenaServicio; 

   @GetMapping("/todas")
    @PreAuthorize("hasAuthority('ROLE_Administrador')")
      public List<ResenaDTO> obtenerTodasLasResenas() { 
      return resenaServicio.obtenerTodas();
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstadoResena(@PathVariable Integer id, @RequestBody Map<String, String> body) {
         try {
            String nuevoEstadoStr = body.get("estado");
            if (nuevoEstadoStr == null) {
                return ResponseEntity.badRequest().body("Falta el campo 'estado'.");
            }
            // Convierte string a Enum
            EstadoResena nuevoEstado = EstadoResena.valueOf(nuevoEstadoStr.toLowerCase());

            Resena resenaActualizada = resenaServicio.actualizarEstadoResena(id, nuevoEstado);
            return ResponseEntity.ok(resenaActualizada);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Valor de 'estado' inválido. Debe ser 'aprobado' o 'rechazado'.");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error inesperado.");
        }
    }

    @GetMapping
public ResponseEntity<List<ResenaDTO>> obtenerResenasPublicas() {
    List<ResenaDTO> resenas = resenaServicio.obtenerTodasAprobadasDTO();
    return ResponseEntity.ok(resenas);
}
}