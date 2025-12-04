package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.Promocion;
import com.djuancito.reposteria.servicio.PromocionServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/promociones")
@CrossOrigin(origins = "*") 
public class PromocionControlador {

    @Autowired
    private PromocionServicio promocionServicio;


    @GetMapping("/paginadas")
    public ResponseEntity<Page<Promocion>> obtenerPromocionesPaginadas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "promocionId") String sortBy) {
        
        Page<Promocion> promocionesPage = promocionServicio.obtenerTodasLasPromocionesPaginadas(page, size, sortBy);
        return ResponseEntity.ok(promocionesPage);
    }
    
    @GetMapping("/todas")
    public ResponseEntity<List<Promocion>> obtenerTodasLasPromociones() {
 
        return ResponseEntity.ok(promocionServicio.obtenerTodasLasPromociones());
    }

    @GetMapping("/activas")
    public List<Promocion> obtenerActivas() {
        return promocionServicio.obtenerPromocionesActivas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Promocion> obtenerPorId(@PathVariable Integer id) {
        return promocionServicio.obtenerPromocionConProductos(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Promocion> crearPromocion(@RequestBody Promocion promocion) {
        Promocion nuevaPromocion = promocionServicio.guardarPromocion(promocion);
        return new ResponseEntity<>(nuevaPromocion, HttpStatus.CREATED);
    }

   
    @PutMapping("/{id}")
    public ResponseEntity<Promocion> actualizarPromocion(@PathVariable Integer id, @RequestBody Promocion promocion) {
        promocion.setPromocionId(id);
        
        Optional<Promocion> promoActualizada = promocionServicio.actualizarPromocion(promocion);
        
        return promoActualizada
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPromocion(@PathVariable Integer id) {
        boolean fueEliminada = promocionServicio.eliminarPromocion(id);
        
        if (fueEliminada) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build(); 
        }
    }
}