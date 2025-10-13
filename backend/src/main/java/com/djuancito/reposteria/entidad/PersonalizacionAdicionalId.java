package com.djuancito.reposteria.entidad;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.Data;

@Data
@Embeddable
public class PersonalizacionAdicionalId implements Serializable {

    @Column(name = "personalizacionId")
    private Integer personalizacionId;

    @Column(name = "adicionalId")
    private Integer adicionalId;
}