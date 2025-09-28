package com.djuancito.reposteria.entidad;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "UsuarioRol")
public class UsuarioRol {

    @EmbeddedId
    private UsuarioRolId id;
}