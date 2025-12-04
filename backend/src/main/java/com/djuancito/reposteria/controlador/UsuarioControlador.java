package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.*;
import com.djuancito.reposteria.entidad.dto.AuthResponseDTO;
import com.djuancito.reposteria.entidad.dto.PasswordChangeDTO;
import com.djuancito.reposteria.repositorio.UsuarioRepositorio;
import com.djuancito.reposteria.servicio.JwtServicio;
import com.djuancito.reposteria.servicio.UsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioControlador {

    @Autowired private UsuarioServicio usuarioServicio;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtServicio jwtServicio;
    @Autowired private UsuarioRepositorio usuarioRepositorio;

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        try {
            Usuario nuevo = usuarioServicio.registrarUsuario(usuario);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(@RequestBody Map<String, String> credenciales) {
        String email = credenciales.get("email");
        String password = credenciales.get("password");

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Usuario usuario = usuarioRepositorio.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtServicio.generateToken(usuario, userDetails);
        return ResponseEntity.ok(new AuthResponseDTO(token));
    }

    @GetMapping("/mi-perfil")
    public ResponseEntity<Usuario> obtenerMiPerfil() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Usuario usuario = usuarioRepositorio.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/mi-perfil")
    public ResponseEntity<Usuario> actualizarMiPerfil(@RequestBody Usuario datos) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Usuario actualizado = usuarioServicio.actualizarPerfil(email, datos);
        return ResponseEntity.ok(actualizado);
    }

    @PostMapping("/cambiar-password")
    public ResponseEntity<?> cambiarPassword(@RequestBody PasswordChangeDTO dto) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            usuarioServicio.cambiarPassword(email, dto);
            return ResponseEntity.ok("Contraseña cambiada exitosamente");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }
    }

    @GetMapping("/todos")
    @PreAuthorize("hasAuthority('ROLE_Administrador')")
    public ResponseEntity<List<Usuario>> obtenerTodosLosUsuarios() {
        return ResponseEntity.ok(usuarioServicio.obtenerTodosLosUsuarios());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_Administrador')")
    public ResponseEntity<Usuario> actualizarUsuarioPorAdmin(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> campos) {
        Usuario actualizado = usuarioServicio.actualizarUsuarioPorAdmin(id, campos);
        return ResponseEntity.ok(actualizado);
    }
}