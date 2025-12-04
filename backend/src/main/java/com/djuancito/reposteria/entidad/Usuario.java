package com.djuancito.reposteria.entidad;
import java.util.Set; 
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usuarioId")
    private Integer usuarioId;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "email")
    private String email;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "password")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipoCliente")
    private TipoCliente tipoCliente;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoUsuario estado;

    @Column(name = "fechaRegistro")
    private LocalDateTime fechaRegistro;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "UsuarioRol",
        joinColumns = @JoinColumn(name = "usuarioId"),
        inverseJoinColumns = @JoinColumn(name = "rolId")
    )
    private Set<Rol> roles;
}


