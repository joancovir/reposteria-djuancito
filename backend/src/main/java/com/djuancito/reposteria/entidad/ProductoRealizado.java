package com.djuancito.reposteria.entidad;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ProductoRealizado")
public class ProductoRealizado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer realizadoId;

    @Column(length = 100, nullable = false)
    private String nombre;

    @Lob // Para mapear TEXT
    private String descripcion;

    @Column(length = 255, nullable = false)
    private String imagenUrl;

    @Column(length = 50)
    private String categoria;

    private LocalDate fechaRealizacion;

    private Boolean destacado = false;
}