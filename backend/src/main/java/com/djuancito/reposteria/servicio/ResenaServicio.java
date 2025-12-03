


package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.EstadoResena; 
import com.djuancito.reposteria.entidad.Resena;
import com.djuancito.reposteria.entidad.dto.ResenaDTO;
import com.djuancito.reposteria.repositorio.ResenaRepositorio;
import jakarta.transaction.Transactional; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; 
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException; 
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResenaServicio {

    
    @Autowired
    private ResenaRepositorio resenaRepositorio; 

    public List<ResenaDTO> obtenerTodas() {
        return resenaRepositorio.findAll()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    public List<ResenaDTO> obtenerTodasAprobadasDTO() {
    
        return resenaRepositorio.findAllByOrderByFechaDesc() 
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }


    public List<Resena> obtenerTodasAdmin() {
    
        return resenaRepositorio.findAllByOrderByFechaDesc();
    }
    
    @Transactional
    public Resena actualizarEstadoResena(Integer resenaId, EstadoResena nuevoEstado) {
        Resena resenaExistente = resenaRepositorio.findById(resenaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reseña no encontrada con ID: " + resenaId));

        // Solo permite cambiar a aprobado o rechazado
        if (nuevoEstado == EstadoResena.aprobado || nuevoEstado == EstadoResena.rechazado) {
            resenaExistente.setEstado(nuevoEstado);
            return resenaRepositorio.save(resenaExistente);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado de reseña no válido para actualización: " + nuevoEstado);
        }
    }
    
    private ResenaDTO convertirADTO(Resena resena) {
        ResenaDTO dto = new ResenaDTO();
        dto.setResenaId(resena.getResenaId());
        dto.setComentario(resena.getComentario());
        dto.setFotoUrl(resena.getFotoUrl());
        dto.setValoracion(resena.getValoracion());
        dto.setFecha(resena.getFecha());

        if (resena.getUsuario() != null) {
            dto.setNombreUsuario(resena.getUsuario().getNombre());
        } else {
            dto.setNombreUsuario("Anónimo");
        }
        if (resena.getPedido() != null) {
            dto.setFechaPedido(resena.getPedido().getFechaPedido());
        }
        return dto;
    }
}