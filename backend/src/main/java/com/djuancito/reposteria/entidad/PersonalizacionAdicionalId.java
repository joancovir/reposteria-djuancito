package com.djuancito.reposteria.entidad;

import jakarta.persistence.*; 
import java.io.Serializable;
import lombok.Data;

@Data
@Embeddable
public class PersonalizacionAdicionalId implements Serializable {
    

    @ManyToOne
    @JoinColumn(name = "personalizacionId")
    private Personalizacion personalizacion; 

    @ManyToOne
    @JoinColumn(name = "adicionalId")
    private Adicional adicional; 
}