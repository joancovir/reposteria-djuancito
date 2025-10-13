package com.djuancito.reposteria.entidad.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ResenaDTO {
    private Integer resenaId;
    private String comentario;
    private String fotoUrl;
    private Integer valoracion;
    private LocalDateTime fecha;

    // Campos que traeremos de las otras entidades
    private String nombreUsuario;
    private LocalDateTime fechaPedido;
}