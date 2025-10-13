package com.djuancito.reposteria.entidad.dto;

import java.util.List;
import lombok.Data;

@Data
public class PedidoRequestDTO {
    private Integer usuarioId;
    private String nota;
    private List<DetalleRequestDTO> detalles;
}