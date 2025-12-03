package com.djuancito.reposteria.entidad;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "QrPagos")
public class QrPago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String tipo;

    @Column(nullable = false, length = 500)
    private String imagenUrl;

    @Column(nullable = false, length = 15)
    private String telefono;

    @Column(length = 100)
    private String nombrePropietario;

    private Boolean activo = true;

    private LocalDateTime creadoEn;
    private LocalDateTime actualizadoEn;
}
