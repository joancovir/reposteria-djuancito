package com.djuancito.reposteria.entidad;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "ConfiguracionTienda")
public class ConfiguracionTienda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreTienda;
    private String direccion;
    private String referencia;
    private String telefono;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private String googleMapsEmbed;
}
