package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Promocion;
import com.djuancito.reposteria.repositorio.PromocionRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PromocionServicio {

    @Autowired
    private PromocionRepositorio promocionRepositorio;

    @Transactional(readOnly = true)
    public Page<Promocion> obtenerTodasLasPromocionesPaginadas(int page, int size, String sortBy) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return promocionRepositorio.findAllWithProductos(pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Promocion> obtenerPromocionesActivas() {
        return promocionRepositorio.findPromocionesActivas(LocalDate.now());
    }

    @Transactional(readOnly = true)
    public Optional<Promocion> obtenerPromocionConProductos(Integer id) {
        return promocionRepositorio.findByIdWithProductos(id);
    }

    @Transactional(readOnly = true)
    public Optional<Promocion> obtenerPromocionPorId(Integer id) {
        return promocionRepositorio.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Promocion> obtenerTodasLasPromociones() {
        return promocionRepositorio.findAllWithProductos(); 
    }
    

    @Transactional
    public Promocion guardarPromocion(Promocion promocion) {
        return promocionRepositorio.save(promocion);
    }

   
    @Transactional
    public Optional<Promocion> actualizarPromocion(Promocion promocion) {
        if (!promocionRepositorio.existsById(promocion.getPromocionId())) {
            return Optional.empty(); // No existe
        }
        return Optional.of(promocionRepositorio.save(promocion));
    }

    @Transactional
    public boolean eliminarPromocion(Integer id) {
        if (promocionRepositorio.existsById(id)) {
            promocionRepositorio.deleteById(id);
            return true;
        }
        return false;
    }
}