package com.djuancito.reposteria.entidad;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Resena")
public class Resena {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resenaId")
    private Integer resenaId;

@ManyToOne(fetch = FetchType.LAZY) // Es LAZY
    @JoinColumn(name = "usuarioId")
    @JsonIgnore // <-- AÑADE ESTO
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY) // Es LAZY
    @JoinColumn(name = "pedidoId")
    @JsonIgnore // <-- AÑADE ESTO
    private Pedido pedido;

    @Column(name = "comentario")
    private String comentario;

    @Column(name = "fotoUrl")
    private String fotoUrl;

    @Column(name = "valoracion")
    private Integer valoracion;

    @Column(name = "fecha")
    private LocalDateTime fecha;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoResena estado;
}

enum EstadoResena { pendiente, aprobado, rechazado }