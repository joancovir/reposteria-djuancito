package com.djuancito.reposteria.entidad;

import java.time.LocalDateTime;
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

@ManyToOne(fetch = FetchType.EAGER) // Usamos EAGER para este ejemplo simple
@JoinColumn(name = "usuarioId")
private Usuario usuario; // <-- ¡Añade esto!

@ManyToOne(fetch = FetchType.EAGER) // Usamos EAGER para este ejemplo simple
@JoinColumn(name = "pedidoId")
private Pedido pedido; // <-- ¡Añade esto!

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