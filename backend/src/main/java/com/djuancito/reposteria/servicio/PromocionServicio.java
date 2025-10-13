package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Promocion;
import com.djuancito.reposteria.repositorio.PromocionRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDate;

@Service
public class PromocionServicio {

    @Autowired
    private PromocionRepositorio promocionRepositorio;

    public List<Promocion> obtenerPromocionesActivas() {
        LocalDate hoy = LocalDate.now();
        // Llamamos a nuestro nuevo método personalizado
        return promocionRepositorio.findPromocionesActivas(hoy);
    }
}