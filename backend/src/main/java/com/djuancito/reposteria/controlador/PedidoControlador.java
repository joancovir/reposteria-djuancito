package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.Pedido;
import com.djuancito.reposteria.entidad.dto.PedidoRequestDTO;
import com.djuancito.reposteria.servicio.PedidoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoControlador {

    @Autowired
    private PedidoServicio pedidoServicio;
    @GetMapping("/usuario/{usuarioId}")
public ResponseEntity<List<Pedido>> obtenerPedidosPorUsuario(@PathVariable Integer usuarioId) {
    // En un sistema con seguridad, verificaríamos que el usuario logueado
    // es el mismo que el {usuarioId} de la URL.
    List<Pedido> pedidos = pedidoServicio.obtenerPedidosPorUsuario(usuarioId);
    return ResponseEntity.ok(pedidos);
}
    // NOTA: En el futuro, este endpoint debería estar protegido y solo accesible para usuarios logueados.
    @PostMapping
    public ResponseEntity<Pedido> crearPedido(@RequestBody PedidoRequestDTO pedidoDTO) {
        try {
            Pedido pedidoCreado = pedidoServicio.crearPedido(pedidoDTO);
            return new ResponseEntity<>(pedidoCreado, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}