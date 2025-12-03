package com.djuancito.reposteria.entidad;

import jakarta.persistence.*; 
import java.io.Serializable;
import lombok.Data;

@Data
@Embeddable
public class TemporadaProductoId implements Serializable {
    
    @ManyToOne
    @JoinColumn(name = "temporadaId")
    private Temporada temporada; 

    @ManyToOne
    @JoinColumn(name = "productoId")
    private Producto producto;
}