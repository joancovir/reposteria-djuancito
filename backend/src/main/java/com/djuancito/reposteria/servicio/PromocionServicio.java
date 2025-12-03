package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Promocion;
import com.djuancito.reposteria.repositorio.PromocionRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PromocionServicio {

    @Autowired
    private PromocionRepositorio promocionRepositorio;

    public List<Promocion> obtenerPromocionesActivas() {
        return promocionRepositorio.findPromocionesActivas(LocalDate.now());
    }

    public Optional<Promocion> obtenerPromocionConProductos(Integer id) {
        return promocionRepositorio.findByIdWithProductos(id);
    }

    public Optional<Promocion> obtenerPromocionPorId(Integer id) {
        return promocionRepositorio.findById(id);
    }

    public List<Promocion> obtenerTodasLasPromociones() {
        return promocionRepositorio.findAll();
    }
}