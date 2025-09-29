// PromocionProductoId.java (CÓDIGO FINAL CRÍTICO)
package com.djuancito.reposteria.entidad;

import jakarta.persistence.*;
import java.io.Serializable;
import lombok.Data;

@Data
@Embeddable
public class PromocionProductoId implements Serializable {
    
    // 1. Relación Many-to-One a Promocion
    @ManyToOne
    @JoinColumn(name = "promocionId")
    private Promocion promocion;

    // 2. Relación Many-to-One a Producto
    @ManyToOne
    @JoinColumn(name = "productoId")
    private Producto producto;
}