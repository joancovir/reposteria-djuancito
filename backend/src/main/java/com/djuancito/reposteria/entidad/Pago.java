package com.djuancito.reposteria.entidad;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Pago")
public class Pago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pagoId")
    private Integer pagoId;

    @Column(name = "pedidoId")
    private Integer pedidoId;

    @Column(name = "montoAbonado")
    private BigDecimal montoAbonado;

    @Column(name = "fechaPago")
    private LocalDateTime fechaPago;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo")
    private MetodoPago metodo;

    @Column(name = "codigoOperacion")
    private String codigoOperacion;

    @Column(name = "comprobanteUrl")
    private String comprobanteUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoPago estado;
}

enum MetodoPago { yape, plin, efectivo }
enum EstadoPago { pendiente_validacion, validado, rechazado }