package com.djuancito.reposteria.entidad;

import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.Data;

@Data // Anotación de Lombok para generar getters, setters, etc.
@Entity 
@Table(name = "Productos")
public class Producto {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Integer producto_id;

    private String nombre;
    private String descripcion;
    private BigDecimal precio_base;

    @Enumerated(EnumType.STRING) 
    private Categoria categoria;

    private String imagen_url;

    @Enumerated(EnumType.STRING)
    private Personalizable personalizable;

    @Enumerated(EnumType.STRING)
    private EstadoProducto estado;
}

// Enums que necesita la clase Producto
enum Categoria { torta, postre, bocadito }
enum Personalizable { si, no }
enum EstadoProducto { activo, inactivo }