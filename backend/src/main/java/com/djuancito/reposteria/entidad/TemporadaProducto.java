package com.djuancito.reposteria.entidad;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "TemporadaProducto")
public class TemporadaProducto {
    
    @EmbeddedId
    private TemporadaProductoId id; // Contiene la Temporada y el Producto

    // 💡 CAMPO FALTANTE PARA NAVEGACIÓN:
    // Este campo nos permite acceder al Producto directamente a través del ID
    @MapsId("producto") // Indica que mapee este campo usando el objeto 'producto' del EmbeddedId
    @ManyToOne
    @JoinColumn(name = "productoId", insertable = false, updatable = false) // Columna de la BD
    private Producto producto;
    // La consulta HQL: 'SELECT tp.producto' ahora funcionará gracias a este campo.
}