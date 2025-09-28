package com.djuancito.reposteria.entidad;

import jakarta.persistence.*; // Asegúrate de importar esto
import java.io.Serializable;
import lombok.Data;

@Data
@Embeddable
public class PersonalizacionAdicionalId implements Serializable {
    
    // Un Detalle tiene una Personalizacion
    @ManyToOne
    @JoinColumn(name = "personalizacionId")
    private Personalizacion personalizacion; // <-- ¡OBJETO DE ENTIDAD COMPLETO!

    // Un Detalle de Personalizacion tiene UN Adicional
    @ManyToOne
    @JoinColumn(name = "adicionalId")
    private Adicional adicional; // <-- ¡OBJETO DE ENTIDAD COMPLETO!
}