
package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Rol;
import com.djuancito.reposteria.entidad.Usuario;
import com.djuancito.reposteria.entidad.dto.PasswordChangeDTO; 
import com.djuancito.reposteria.repositorio.RolRepositorio;
import com.djuancito.reposteria.repositorio.UsuarioRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder; 
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.Collections;
import java.util.Optional;
import java.util.List;
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
        Rol rolCliente = rolRepositorio.findByNombre("Cliente")
                .orElseThrow(() -> new RuntimeException("Error: Rol de cliente no encontrado."));
        usuario.setRoles(Collections.singleton(rolCliente));
        return usuarioRepositorio.save(usuario);
    }

    public Usuario login(String email, String password) {
        // ... (código sin cambios) ...
        Optional<Usuario> usuarioOptional = usuarioRepositorio.findByEmail(email);
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            if (passwordEncoder.matches(password, usuario.getPassword())) {
                return usuario;
            }
        }
        throw new IllegalStateException("Credenciales inválidas.");
    }

    @Transactional
    public Usuario actualizarPerfil(String emailUsuario, Usuario datosActualizados) {
        // ... (código sin cambios) ...
        Usuario usuarioExistente = usuarioRepositorio.findByEmail(emailUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        usuarioExistente.setNombre(datosActualizados.getNombre());
        usuarioExistente.setTelefono(datosActualizados.getTelefono());
        usuarioExistente.setDireccion(datosActualizados.getDireccion());
        return usuarioRepositorio.save(usuarioExistente);
    }

  
    @Transactional
    public void cambiarPassword(String emailUsuario, PasswordChangeDTO passwordDTO) {
        // 1. Busca al usuario existente
        Usuario usuario = usuarioRepositorio.findByEmail(emailUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        // 2. Verifica si la contraseña actual proporcionada coincide con la guardada
        if (!passwordEncoder.matches(passwordDTO.getPasswordActual(), usuario.getPassword())) {
            // Lanza una excepción si no coinciden (el controlador la capturará)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña actual es incorrecta.");
        }

        // 3. Verifica que la nueva contraseña no esté vacía (aunque el frontend ya lo hace)
        if (passwordDTO.getNuevaPassword() == null || passwordDTO.getNuevaPassword().isEmpty()) {
             throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La nueva contraseña no puede estar vacía.");
        }

        String nuevaContrasenaEncriptada = passwordEncoder.encode(passwordDTO.getNuevaPassword());

        usuario.setPassword(nuevaContrasenaEncriptada);

        usuarioRepositorio.save(usuario);
    }
    public List<Usuario> obtenerTodosLosUsuarios() {
         return usuarioRepositorio.findAllByOrderByFechaRegistroDesc();
     }
}