package com.djuancito.reposteria.entidad;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Entity
@Table(name = "Pago")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pagoId")
    private Integer pagoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedidoId")
    @JsonIgnore
    private Pedido pedido;

    @Transient
    @JsonProperty("pedidoId")  // ← Esto hace que aparezca en el JSON
    public Integer getPedidoId() {
        return pedido != null ? pedido.getPedidoId() : null;
    }

    @Column(name = "montoAbonado")
    private BigDecimal montoAbonado;

    @Column(name = "fechaPago")
    private LocalDateTime fechaPago;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipoPago")
    private TipoPago tipoPago;

    @Column(name = "comprobanteUrl")
    private String comprobanteUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo")
    private MetodoPago metodo = MetodoPago.PENDIENTE;  // valor por defecto

    @Column(name = "codigoOperacion")
    private String codigoOperacion;

    @Enumerated(EnumType.STRING)
    @Column(name = EstadoPago.pendiente_validacion;
    private EstadoPago estado;
}
