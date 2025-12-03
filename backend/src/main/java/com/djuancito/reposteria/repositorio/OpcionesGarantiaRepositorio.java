package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.OpcionesGarantia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OpcionesGarantiaRepositorio extends JpaRepository<OpcionesGarantia, Long> {
    List<OpcionesGarantia> findByActivoTrue();
}
