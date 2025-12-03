package com.djuancito.reposteria.entidad;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "TemporadaProducto")
public class TemporadaProducto {
    
    @EmbeddedId
    private TemporadaProductoId id; 

    @MapsId("producto") 
    @ManyToOne
    @JoinColumn(name = "productoId", insertable = false, updatable = false) 
    private Producto producto;
}