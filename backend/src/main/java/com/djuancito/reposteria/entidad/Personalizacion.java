package com.djuancito.reposteria.entidad;

import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Personalizacion")
public class Personalizacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "personalizacionId")
    private Integer personalizacionId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "detalleId")
    private DetallePedido detalle;

    @Column(name = "descripcionExtra")
    private String descripcionExtra;

    @Column(name = "costoAdicional")
    private BigDecimal costoAdicional;
}