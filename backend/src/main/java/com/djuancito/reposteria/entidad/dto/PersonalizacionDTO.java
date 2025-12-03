package com.djuancito.reposteria.entidad.dto;

import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

@Data
public class PersonalizacionDTO {
    private String descripcionExtra;
    private BigDecimal costoAdicional;
    private List<AdicionalDTO> adicionalesSeleccionados;
}
