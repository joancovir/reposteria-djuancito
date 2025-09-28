package com.djuancito.reposteria.entidad;

import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Producto")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "productoId") // <-- ESTA LÍNEA ES ESENCIAL
    private Integer productoId;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "precioBase") // <-- Y ESTA
    private BigDecimal precioBase;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria")
    private Categoria categoria;

    @Column(name = "imagenUrl") // <-- Y ESTA
    private String imagenUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "personalizable")
    private Personalizable personalizable;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoProducto estado;
}

// Enums que necesita la clase Producto
enum Categoria { torta, postre, bocadito }
enum EstadoProducto { activo, inactivo }