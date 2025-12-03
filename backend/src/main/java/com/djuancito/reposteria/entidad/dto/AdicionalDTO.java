package com.djuancito.reposteria.entidad.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class AdicionalDTO {
    private Long adicionalId;
    private String nombre;
    private BigDecimal precio;
}
