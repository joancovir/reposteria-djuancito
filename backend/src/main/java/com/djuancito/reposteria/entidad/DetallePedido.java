package com.djuancito.reposteria.entidad;

import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Optional; // <-- Importamos para manejar Optional si el Producto no existe
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // <-- ¡IMPORTA ESTO!

@Data
@Entity
@Table(name = "DetallePedido")
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detalleId")
    private Integer detalleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedidoId", referencedColumnName = "pedidoId")
    @JsonIgnoreProperties("detalles") // Evita el bucle al convertir el pedido a JSON
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productoId", referencedColumnName = "productoId")
    private Producto producto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promocionId", referencedColumnName = "promocionId")
    private Promocion promocion;

    @OneToOne(mappedBy = "detalle", cascade = CascadeType.ALL, orphanRemoval = true)
    private Personalizacion personalizacion;

    @Column(name = "cantidad")
    private Integer cantidad;

    @Column(name = "precioUnitario")
    private BigDecimal precioUnitario;

    @Column(name = "subtotal")
    private BigDecimal subtotal;

    @Column(name = "descuentoAplicado")
    private BigDecimal descuentoAplicado;
    

}