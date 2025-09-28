package com.djuancito.reposteria.entidad;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Rol")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rolId")
    private Integer rolId;

    @Column(name = "nombre")
    private String nombre;
}