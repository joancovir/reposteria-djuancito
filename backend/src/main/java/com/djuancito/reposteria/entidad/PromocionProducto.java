package com.djuancito.reposteria.entidad;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "PromocionProducto")
@IdClass(PromocionProductoId.class)
public class PromocionProducto {

    @Id
    @Column(name = "promocionId")
    private Integer promocionId;

    @Id
    @Column(name = "productoId")
    private Integer productoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promocionId", insertable = false, updatable = false)
    @JsonIgnore  
    private Promocion promocion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productoId", insertable = false, updatable = false)
    private Producto producto;
}