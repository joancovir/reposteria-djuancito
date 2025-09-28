package com.djuancito.reposteria.entidad;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "PromocionProducto")
public class PromocionProducto {
    @EmbeddedId
    private PromocionProductoId id;
}