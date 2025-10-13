package com.djuancito.reposteria.controlador;
import com.djuancito.reposteria.entidad.Usuario;
import com.djuancito.reposteria.entidad.dto.AuthResponseDTO;
import com.djuancito.reposteria.servicio.JwtServicio;
import com.djuancito.reposteria.servicio.UsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;


@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioControlador {
    @Autowired private UsuarioServicio usuarioServicio;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtServicio jwtServicio;

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

    // Autentica con Spring Security
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(email, password)
    );

    // Si la autenticación es exitosa, genera el token
    final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
    final String token = jwtServicio.generateToken(userDetails);

    // Devuelve el token en la respuesta
    return ResponseEntity.ok(new AuthResponseDTO(token));
}

    // Dentro de UsuarioControlador.java
    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerPerfil() {
    // Lógica para obtener el usuario autenticado (lo haremos después)
    // Por ahora, solo confirma que se puede acceder al endpoint
        return ResponseEntity.ok("Acceso al perfil concedido.");
}
}