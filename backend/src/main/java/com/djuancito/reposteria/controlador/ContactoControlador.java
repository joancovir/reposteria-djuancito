
package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.Contacto;
import com.djuancito.reposteria.servicio.ContactoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/contacto")
@CrossOrigin(origins = "*") 
public class ContactoControlador {

    @Autowired
    private ContactoServicio contactoServicio;


    @GetMapping("/usuario/{email}")
    public List<Contacto> obtenerContactosPorEmail(@PathVariable String email) {
        return contactoServicio.obtenerPorEmail(email);
    }

    
    @PostMapping
    public Contacto recibirMensaje(@RequestBody Contacto contacto) {

        return contactoServicio.guardarMensaje(contacto);
    }

    @GetMapping("/mi-historial")
    public ResponseEntity<List<Contacto>> obtenerMiHistorialDeConsultas() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        String emailUsuario = authentication.getName();

        List<Contacto> consultas = contactoServicio.obtenerPorEmail(emailUsuario);
        
        return ResponseEntity.ok(consultas);
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Contacto>> obtenerTodasLasConsultas() {
        List<Contacto> todasLasConsultas = contactoServicio.obtenerTodasLasConsultas();
        return ResponseEntity.ok(todasLasConsultas);
    }

  @GetMapping("/{id}")
    public ResponseEntity<Contacto> obtenerConsultaPorId(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuario = authentication.getName();
        
        Optional<Contacto> contactoOpt = contactoServicio.obtenerPorId(id);

        if (contactoOpt.isPresent()) {
            Contacto consulta = contactoOpt.get();
            
           
            if (consulta.getEmail().equals(emailUsuario)) {
                return ResponseEntity.ok(consulta);
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); 
            }

        } else {
            return ResponseEntity.notFound().build(); 
        }
    }
}