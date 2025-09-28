package com.djuancito.reposteria.entidad;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Temporada")
public class Temporada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "temporadaId")
    private Integer temporadaId;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "fechaInicio")
    private LocalDate fechaInicio;

    @Column(name = "fechaFin")
    private LocalDate fechaFin;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoTemporada estado;
}

enum EstadoTemporada {
    activo, inactivo
}