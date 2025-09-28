package com.djuancito.reposteria.entidad;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.Data;

@Data
@Embeddable
public class PromocionProductoId implements Serializable {
    @Column(name = "promocionId")
    private Integer promocionId;

    @Column(name = "productoId")
    private Integer productoId;
}