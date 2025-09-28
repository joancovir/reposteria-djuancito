package com.djuancito.reposteria.entidad;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Entrega")
public class Entrega {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "entregaId")
    private Integer entregaId;

    @Column(name = "pedidoId")
    private Integer pedidoId;

    @Column(name = "direccionEntrega")
    private String direccionEntrega;

    @Column(name = "referencia")
    private String referencia;

    @Column(name = "fechaEntrega")
    private LocalDateTime fechaEntrega;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo")
    private MetodoEntrega metodo;

    @Column(name = "costoDelivery")
    private BigDecimal costoDelivery;

    @Column(name = "recibidoPor")
    private String recibidoPor;

    @Column(name = "incidencia")
    private String incidencia;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoEntrega estado;
}

enum MetodoEntrega { delivery, recojo }
enum EstadoEntrega { pendiente, en_camino, entregado, incidencia }