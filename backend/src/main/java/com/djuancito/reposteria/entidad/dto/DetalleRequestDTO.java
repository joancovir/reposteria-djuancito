package com.djuancito.reposteria.entidad.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class DetalleRequestDTO {
    private Integer productoId;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
    private Long promocionId;
    private PersonalizacionDTO personalizacion;

}