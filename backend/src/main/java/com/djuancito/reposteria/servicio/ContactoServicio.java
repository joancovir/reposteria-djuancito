package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Contacto;
import com.djuancito.reposteria.repositorio.ContactoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ContactoServicio {

    @Autowired
    private ContactoRepositorio contactoRepositorio;

    public Contacto guardarMensaje(Contacto contacto) {
        // Aquí podrías añadir lógica en el futuro, como enviar un email de notificación.
        return contactoRepositorio.save(contacto);
    }
    public List<Contacto> obtenerPorEmail(String email) {
    return contactoRepositorio.findByEmailOrderByFechaDesc(email);
}
}