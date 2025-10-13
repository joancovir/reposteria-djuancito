package com.djuancito.reposteria.controlador;

import com.djuancito.reposteria.entidad.Contacto;
import com.djuancito.reposteria.servicio.ContactoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contacto")
@CrossOrigin(origins = "*")
public class ContactoControlador {

    @Autowired
    private ContactoServicio contactoServicio;

    @GetMapping("/usuario/{email}")
    public List<Contacto> obtenerContactosPorEmail(@PathVariable String email) {
    // En un futuro, esto se protegería para que solo el usuario logueado pueda ver sus consultas
    return contactoServicio.obtenerPorEmail(email);
    }

    @PostMapping
    public Contacto recibirMensaje(@RequestBody Contacto contacto) {
        return contactoServicio.guardarMensaje(contacto);
    }
}