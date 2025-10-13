package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Rol;
import com.djuancito.reposteria.entidad.Usuario;
import com.djuancito.reposteria.repositorio.RolRepositorio;
import com.djuancito.reposteria.repositorio.UsuarioRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.Optional;

@Service
public class UsuarioServicio {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Autowired
    private PasswordEncoder passwordEncoder;   

    @Autowired
    private RolRepositorio rolRepositorio; 

    @Transactional
    public Usuario registrarUsuario(Usuario usuario) {
        if (usuarioRepositorio.findByEmail(usuario.getEmail()).isPresent()) {
            throw new IllegalStateException("El correo electrónico ya está registrado.");
        }

        String contrasenaEncriptada = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(contrasenaEncriptada);

        // Asigna el rol de "Cliente" por defecto
        Rol rolCliente = rolRepositorio.findByNombre("Cliente")
                .orElseThrow(() -> new RuntimeException("Error: Rol de cliente no encontrado."));
        usuario.setRoles(Collections.singleton(rolCliente));

        return usuarioRepositorio.save(usuario);
    }

    public Usuario login(String email, String password) {
        Optional<Usuario> usuarioOptional = usuarioRepositorio.findByEmail(email);

        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            if (passwordEncoder.matches(password, usuario.getPassword())) {
                return usuario;
            }
        }

        throw new IllegalStateException("Credenciales inválidas.");
    }
}