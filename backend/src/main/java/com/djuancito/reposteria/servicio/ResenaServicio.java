package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Resena;
import com.djuancito.reposteria.entidad.dto.ResenaDTO;
import com.djuancito.reposteria.repositorio.ResenaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

    private ResenaDTO convertirADTO(Resena resena) {
        ResenaDTO dto = new ResenaDTO();
        dto.setResenaId(resena.getResenaId());
        dto.setComentario(resena.getComentario());
        dto.setFotoUrl(resena.getFotoUrl());
        dto.setValoracion(resena.getValoracion());
        dto.setFecha(resena.getFecha());
        
        // --- VERIFICACIÓN AÑADIDA ---
        if (resena.getUsuario() != null) {
            dto.setNombreUsuario(resena.getUsuario().getNombre());
        } else {
            dto.setNombreUsuario("Anónimo"); // Asigna un valor por defecto si no hay usuario
        }
        
        // --- VERIFICACIÓN AÑADIDA ---
        if (resena.getPedido() != null) {
            dto.setFechaPedido(resena.getPedido().getFechaPedido());
        }
        
        return dto;
    }
}