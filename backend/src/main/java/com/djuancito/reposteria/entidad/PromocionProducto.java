// PromocionProducto.java (CÓDIGO FINAL CRÍTICO)
package com.djuancito.reposteria.entidad;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "PromocionProducto")
public class PromocionProducto {

    @EmbeddedId
    private PromocionProductoId id;
    
    // Campo de conveniencia para navegar al Producto
    @MapsId("producto")
    @ManyToOne
    @JoinColumn(name = "productoId", insertable = false, updatable = false)
    private Producto producto;

    // Campo de conveniencia para navegar a la Promocion
    @MapsId("promocion")
    @ManyToOne
    @JoinColumn(name = "promocionId", insertable = false, updatable = false)
    private Promocion promocion;
}