package com.djuancito.reposteria.entidad;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Promocion")
public class Promocion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promocionId")
    private Integer promocionId;

    @Column(name = "titulo")
    private String titulo;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "fechaInicio")
    private LocalDate fechaInicio;

    @Column(name = "fechaFin")
    private LocalDate fechaFin;

    @Column(name = "descuento")
    private BigDecimal descuento;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoPromocion estado;

    @Column(name = "temporadaId")
    private Integer temporadaId;
}

enum EstadoPromocion {
    activo, inactivo
}