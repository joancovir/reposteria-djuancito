package com.djuancito.reposteria.entidad;
import com.fasterxml.jackson.annotation.JsonIgnore; // <-- ¡IMPORTA ESTO!
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List; 
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; 

@Data
@Entity
@Table(name = "Pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pedidoId")
    private Integer pedidoId;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuarioId")
    @JsonIgnore // <-- AÑADE ESTO
    private Usuario usuario; 

    
    // En la clase Pedido.java
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detalles;

    @Column(name = "fechaPedido")
    private LocalDateTime fechaPedido;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoPedido estado;

    @Column(name = "total")
    private BigDecimal total;

    @Column(name = "nota")
    private String nota;
}

