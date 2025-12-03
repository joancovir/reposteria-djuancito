package com.djuancito.reposteria.entidad;

import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;

@Data
@Embeddable
public class PromocionProductoId implements Serializable {
    private Integer promocionId;
    private Integer productoId;
}