
package com.djuancito.reposteria.entidad;

import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; 

@Data
@Entity
@Table(name = "DetallePedido")
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detalleId")
    private Integer detalleId;

    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "pedidoId")
    @JsonIgnore 
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "productoId", referencedColumnName = "productoId")
    private Producto producto;

    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "promocionId", referencedColumnName = "promocionId")
    @JsonIgnoreProperties({
    "hibernateLazyInitializer", 
    "handler", 
    "promocionProductos",  
    "promocionProducto"        
    })
    private Promocion promocion;

 

    @OneToOne(mappedBy = "detalle", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER) 
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