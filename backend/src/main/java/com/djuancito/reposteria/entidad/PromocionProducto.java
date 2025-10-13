package com.djuancito.reposteria.entidad;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "PromocionProducto")
public class PromocionProducto {

    @EmbeddedId
    private PromocionProductoId id;

    @ManyToOne
    @MapsId("promocionId") // Se enlaza con la propiedad 'promocionId' de la clase Id
    @JoinColumn(name = "promocionId")
    private Promocion promocion;

    @ManyToOne
    @MapsId("productoId") // Se enlaza con la propiedad 'productoId' de la clase Id
    @JoinColumn(name = "productoId")
    private Producto producto;
}