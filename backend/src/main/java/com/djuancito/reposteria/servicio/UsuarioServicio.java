package com.djuancito.reposteria.servicio;
import com.djuancito.reposteria.entidad.*; 
import com.djuancito.reposteria.entidad.EstadoUsuario;
import com.djuancito.reposteria.entidad.TipoCliente;
import com.djuancito.reposteria.entidad.dto.PasswordChangeDTO;
import com.djuancito.reposteria.repositorio.RolRepositorio;
import com.djuancito.reposteria.repositorio.UsuarioRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class UsuarioServicio {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Autowired
    private RolRepositorio rolRepositorio;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Usuario registrarUsuario(Usuario usuario) {
        if (usuarioRepositorio.findByEmail(usuario.getEmail()).isPresent()) {
            throw new IllegalStateException("El correo ya está registrado");
        }

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setFechaRegistro(LocalDateTime.now());
        usuario.setEstado(EstadoUsuario.activo);
        usuario.setTipoCliente(TipoCliente.nuevo);

        Rol rolCliente = rolRepositorio.findByNombre("Cliente")
                .orElseThrow(() -> new RuntimeException("Rol Cliente no encontrado"));
        usuario.setRoles(Collections.singleton(rolCliente));

        return usuarioRepositorio.save(usuario);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepositorio.findByEmail(email);
    }

    @Transactional
    public Usuario actualizarPerfil(String email, Usuario datos) {
        Usuario usuario = usuarioRepositorio.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (datos.getNombre() != null) usuario.setNombre(datos.getNombre());
        if (datos.getTelefono() != null) usuario.setTelefono(datos.getTelefono());
        if (datos.getDireccion() != null) usuario.setDireccion(datos.getDireccion());

        return usuarioRepositorio.save(usuario);
    }

    @Transactional
    public void cambiarPassword(String email, PasswordChangeDTO dto) {
        Usuario usuario = usuarioRepositorio.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (!passwordEncoder.matches(dto.getPasswordActual(), usuario.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Contraseña actual incorrecta");
        }

        usuario.setPassword(passwordEncoder.encode(dto.getNuevaPassword()));
        usuarioRepositorio.save(usuario);
    }

    // LISTAR TODOS LOS USUARIOS (solo admin)
    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioRepositorio.findAllByOrderByFechaRegistroDesc();
    }

   @Transactional
public Usuario actualizarUsuarioPorAdmin(Integer id, Map<String, Object> campos) {
    Usuario usuario = usuarioRepositorio.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

    if (campos.containsKey("nombre") && campos.get("nombre") != null) {
        usuario.setNombre((String) campos.get("nombre"));
    }
    if (campos.containsKey("telefono") && campos.get("telefono") != null) {
        usuario.setTelefono((String) campos.get("telefono"));
    }
    if (campos.containsKey("estado") && campos.get("estado") != null) {
        String estadoStr = ((String) campos.get("estado")).toUpperCase();
        try {
            usuario.setEstado(EstadoUsuario.valueOf(estadoStr)); // ← AHORA SÍ FUNCIONA
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado inválido. Usa: ACTIVO o INACTIVO");
        }
    }

    return usuarioRepositorio.save(usuario);
}
}