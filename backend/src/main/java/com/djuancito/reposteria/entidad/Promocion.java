package com.djuancito.reposteria.entidad;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "Promocion")
public class Promocion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promocionId")
    private Integer promocionId;

    @Column(name = "titulo", nullable = false)
    private String titulo;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "imagenUrl")
    private String imagenUrl;

    @Column(name = "fechaInicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fechaFin", nullable = false)
    private LocalDate fechaFin;

    @Column(name = "descuento", nullable = false)
    private BigDecimal descuento;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoPromocion estado = EstadoPromocion.activo;

    @Column(name = "temporadaId")
    private Integer temporadaId;

    // RELACIÓN CON PRODUCTOS
    @OneToMany(mappedBy = "promocion", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<PromocionProducto> promocionProductos;
}

enum EstadoPromocion {
    activo, inactivo
}