
package com.djuancito.reposteria.entidad;

import java.math.BigDecimal;
import java.util.Set; 
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Personalizacion")
public class Personalizacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "personalizacionId")
    private Integer personalizacionId;

    @OneToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "detalleId")
    @JsonIgnore 
    private DetallePedido detalle;

    @Column(name = "descripcionExtra") // Instrucciones especiales
    private String descripcionExtra;

    @Column(name = "costoAdicional") // Costo total de los adicionales
    private BigDecimal costoAdicional;

    @ManyToMany(fetch = FetchType.EAGER) 
    @JoinTable(
        name = "PersonalizacionAdicional",
        joinColumns = @JoinColumn(name = "personalizacionId"), 
        inverseJoinColumns = @JoinColumn(name = "adicionalId")
    )
    private Set<Adicional> adicionalesSeleccionados; 
    
}