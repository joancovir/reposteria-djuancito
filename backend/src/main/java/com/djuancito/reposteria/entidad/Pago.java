package com.djuancito.reposteria.entidad;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Data
@Entity
@Table(name = "Pago")
public class Pago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pagoId")
    private Integer pagoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedidoId")
    @JsonIgnore
    private Pedido pedido;

    @Column(name = "montoAbonado")
    private BigDecimal montoAbonado;

    @Column(name = "fechaPago")
    private LocalDateTime fechaPago;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipoPago")
    private TipoPago tipoPago; 

    @Column(name = "comprobanteUrl")
    private String comprobanteUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo")
    private MetodoPago metodo; 

    @Column(name = "codigoOperacion")
    private String codigoOperacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoPago estado; 
    
}