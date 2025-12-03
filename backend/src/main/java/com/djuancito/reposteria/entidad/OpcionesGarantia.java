package com.djuancito.reposteria.entidad;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "OpcionesGarantia")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString
public class OpcionesGarantia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer porcentaje;

    private String descripcion;

    private Boolean activo = true;
    
    @Column(name = "es_principal", nullable = false)
    private Boolean esPrincipal = false;
}