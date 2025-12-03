package com.djuancito.reposteria.entidad;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List; 
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pedidoId")
    private Integer pedidoId;


    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "usuarioId")
    private Usuario usuario;

   @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.EAGER) // Carga EAGER
    private List<Pago> pagos;
    
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER) 
    private List<DetallePedido> detalles;

    @Column(name = "fechaPedido")
    private LocalDateTime fechaPedido;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoPedido estado;

    @Column(name = "total")
    private BigDecimal total;

    @Column(name = "montoGarantia") 
    private BigDecimal montoGarantia;

    @Column(name = "nota")
    private String nota;
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal garantiaPagada = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal resto = BigDecimal.ZERO;

}

