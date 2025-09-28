package com.djuancito.reposteria.entidad;

import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Adicional")
public class Adicional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "adicionalId")
    private Integer adicionalId;

    @Column(name = "nombre")
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria")
    private CategoriaAdicional categoria;

    @Column(name = "costoAdicional")
    private BigDecimal costoAdicional;
}

enum CategoriaAdicional {
    relleno, decorado, topping, mensaje, extra
}