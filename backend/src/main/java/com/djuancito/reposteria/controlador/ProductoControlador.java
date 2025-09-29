package com.djuancito.reposteria.controlador;
import com.djuancito.reposteria.entidad.Producto;
import com.djuancito.reposteria.servicio.ProductoServicio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/productos") 
@CrossOrigin(origins = "*")
public class ProductoControlador { 

    @Autowired
    private ProductoServicio productoServicio; 

    @GetMapping
    public List<Producto> obtenerTodosLosProductos() {
        return productoServicio.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable Integer id) {
        return productoServicio.obtenerPorId(id)
                .map(producto -> ResponseEntity.ok(producto))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto) {
        return productoServicio.guardar(producto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Integer id) {
        productoServicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
    
@GetMapping("/personalizables")
    public List<Producto> obtenerPersonalizables() {
        return productoServicio.obtenerPorPersonalizable("si"); 
    }

    @GetMapping("/predeterminados")
    public List<Producto> obtenerPredeterminadas() {
        return productoServicio.obtenerPorPersonalizable("no");
    }
}