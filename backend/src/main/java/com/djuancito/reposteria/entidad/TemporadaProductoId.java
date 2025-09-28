package com.djuancito.reposteria.entidad;

import jakarta.persistence.*; 
import java.io.Serializable;
import lombok.Data;

@Data
@Embeddable
public class TemporadaProductoId implements Serializable {
    
    // 1. Relación Many-to-One a Temporada
    @ManyToOne
    @JoinColumn(name = "temporadaId")
    private Temporada temporada; // ¡Resuelve el error 'temporada'!

    // 2. Relación Many-to-One a Producto
    @ManyToOne
    @JoinColumn(name = "productoId")
    private Producto producto;
}