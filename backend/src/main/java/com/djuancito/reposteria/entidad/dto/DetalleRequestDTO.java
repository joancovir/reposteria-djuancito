package com.djuancito.reposteria.entidad.dto;

import lombok.Data;

@Data
public class DetalleRequestDTO {
    private Integer productoId;
    private int cantidad;
    // Aquí podrías añadir campos para la personalización en el futuro
}