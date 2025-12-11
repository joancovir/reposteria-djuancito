package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.Pago;
import com.djuancito.reposteria.servicio.PagoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/pagos")
@CrossOrigin(origins = "http://localhost:4200")
public class PagoControlador {

    @Autowired
    private PagoServicio pagoServicio;

    // LISTAR TODOS (admin)
    @GetMapping
    public ResponseEntity<List<Pago>> obtenerTodos() {
        return ResponseEntity.ok(pagoServicio.obtenerTodosConPedidoId());
    }

    // CAMBIAR ESTADO
    @PutMapping("/{id}/estado")
public ResponseEntity<Pago> actualizarEstado(@PathVariable Integer id,
                                             @RequestBody Map<String, String> body) {
    String estado = body.get("estado"); // o "nuevoEstado", según lo que envíe el frontend
    if (estado == null || estado.isBlank()) {
        return ResponseEntity.badRequest().body(null);
    }
    Pago pago = pagoServicio.actualizarEstado(id, estado);
    return ResponseEntity.ok(pago);
}

    @PutMapping("/{id}/metodo")
public ResponseEntity<Pago> actualizarMetodo(@PathVariable Integer id,
                                             @RequestBody Map<String, String> body) {
    String metodo = body.get("metodo");
    Pago pago = pagoServicio.actualizarMetodo(id, metodo);
    return ResponseEntity.ok(pago);
}
}

class EstadoPagoRequest {
    private String estado;
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}

class MetodoPagoRequest {
    private String metodo;
    public String getMetodo() { return metodo; }
    public void setMetodo(String metodo) { this.metodo = metodo; }
}
