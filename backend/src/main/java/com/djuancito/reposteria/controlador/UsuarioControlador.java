
package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.Usuario;
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
import java.util.Map;
import java.util.List;

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
            Usuario nuevoUsuario = usuarioServicio.registrarUsuario(usuario);
            return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
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
        final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Usuario usuario = usuarioRepositorio.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        final String token = jwtServicio.generateToken(usuario, userDetails);
        return ResponseEntity.ok(new AuthResponseDTO(token));
    }


    @GetMapping("/mi-perfil")
    public ResponseEntity<Usuario> obtenerMiPerfil() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuario = authentication.getName();
        Usuario usuario = usuarioRepositorio.findByEmail(emailUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/mi-perfil")
    public ResponseEntity<Usuario> actualizarMiPerfil(@RequestBody Usuario datosUsuario) {
        //  Obtiene el email del usuario desde el token (para seguridad)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuarioAutenticado = authentication.getName();
        Usuario usuarioActualizado = usuarioServicio.actualizarPerfil(emailUsuarioAutenticado, datosUsuario);
        
        return ResponseEntity.ok(usuarioActualizado);
    }

    
    @GetMapping("/todos")
    @PreAuthorize("hasAuthority('ROLE_Administrador')")
    public ResponseEntity<List<Usuario>> obtenerTodosLosUsuarios() {
        List<Usuario> usuarios = usuarioServicio.obtenerTodosLosUsuarios();
        return ResponseEntity.ok(usuarios);
    }
    @PostMapping("/cambiar-password")
    public ResponseEntity<?> cambiarMiPassword(@RequestBody PasswordChangeDTO passwordDTO) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String emailUsuarioAutenticado = authentication.getName();

            usuarioServicio.cambiarPassword(emailUsuarioAutenticado, passwordDTO);
            return ResponseEntity.ok().body("Contraseña cambiada con éxito.");
     

        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error inesperado al cambiar la contraseña.");
        }
    }
}