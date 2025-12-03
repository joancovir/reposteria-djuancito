package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.QrPago;
import com.djuancito.reposteria.servicio.QrPagoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/config/qr")
@CrossOrigin(origins = "http://localhost:4200")
public class QrPagoControlador {

    @Autowired
    private QrPagoServicio servicio;

    @GetMapping("/activos")
    public ResponseEntity<List<QrPago>> obtenerActivos() {
        return ResponseEntity.ok(servicio.obtenerActivos());
    }

    @GetMapping("/admin")
    public ResponseEntity<List<QrPago>> obtenerTodosAdmin() {
        return ResponseEntity.ok(servicio.obtenerTodos());
    }

    @PostMapping
    public ResponseEntity<QrPago> crear(@RequestBody QrPago qr) {
        return ResponseEntity.ok(servicio.guardar(qr));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QrPago> actualizar(@PathVariable Long id, @RequestBody QrPago qr) {
        qr.setId(id);
        return ResponseEntity.ok(servicio.guardar(qr));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<QrPago> toggleActivo(@PathVariable Long id) {
        return ResponseEntity.ok(servicio.toggleActivo(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
        return ResponseEntity.ok().build();
    }
}