package com.djuancito.reposteria.entidad;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "usuariorol")
public class UsuarioRol {

    @EmbeddedId
    private UsuarioRolId id;
}