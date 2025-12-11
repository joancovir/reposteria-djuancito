    package com.djuancito.reposteria.entidad.dto;

    import java.math.BigDecimal;
    import java.util.List;
    import lombok.Data;

  @Data
public class PedidoRequestDTO {
    private Integer usuarioId;
    private String nota;
    private List<DetalleRequestDTO> detalles;
    private BigDecimal subtotal;
    private BigDecimal garantiaPagada;
    private BigDecimal resto;
    private BigDecimal total;
    private String codigoOperacion;  // ← ESTE ES EL CAMPO QUE FALTABA
}
