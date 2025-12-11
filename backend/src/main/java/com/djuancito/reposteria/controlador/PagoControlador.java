package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.Pago;
import com.djuancito.reposteria.servicio.PagoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
                                                 @RequestBody EstadoPagoRequest request) {
        Pago pago = pagoServicio.actualizarEstado(id, request.getEstado());
        return ResponseEntity.ok(pago);
    }

    @PutMapping("/{id}/metodo")
    public ResponseEntity<Pago> actualizarMetodo(@PathVariable Integer id,
                                                 @RequestBody MetodoPagoRequest request) {
        Pago pago = pagoServicio.actualizarMetodo(id, request.getMetodo());
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
