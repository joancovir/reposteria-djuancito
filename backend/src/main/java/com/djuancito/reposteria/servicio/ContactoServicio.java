package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Contacto;
import com.djuancito.reposteria.repositorio.ContactoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class ContactoServicio {

    @Autowired
    private ContactoRepositorio contactoRepositorio;

    public Contacto guardarMensaje(Contacto contacto) {
        return contactoRepositorio.save(contacto);
    }
    
    public List<Contacto> obtenerPorEmail(String email) {
    return contactoRepositorio.findByEmailOrderByFechaDesc(email);
    }

    public Optional<Contacto> obtenerPorId(Integer contactoId) {
        return contactoRepositorio.findById(contactoId);
    }

    public List<Contacto> obtenerTodasLasConsultas() {
        return contactoRepositorio.findAllByOrderByFechaDesc();
    }    
}