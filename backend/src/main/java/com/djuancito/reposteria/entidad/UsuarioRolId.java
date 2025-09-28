package com.djuancito.reposteria.entidad;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.Data;

@Data
@Embeddable
public class UsuarioRolId implements Serializable {

    @Column(name = "usuarioId")
    private Integer usuarioId;

    @Column(name = "rolId")
    private Integer rolId;
}