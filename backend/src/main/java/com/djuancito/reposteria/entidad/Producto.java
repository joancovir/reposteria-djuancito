
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
    @Column(name = "productoId") 
    private Integer productoId;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "precioBase") 
    private BigDecimal precioBase;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria")
    private Categoria categoria; 

    @Column(name = "imagenUrl") 
    private String imagenUrl;

    @Column(name = "personalizable")
    private boolean personalizable; 

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoProducto estado; 
}

