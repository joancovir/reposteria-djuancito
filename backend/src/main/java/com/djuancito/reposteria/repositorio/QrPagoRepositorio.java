package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.QrPago;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QrPagoRepositorio extends JpaRepository<QrPago, Long> {
    List<QrPago> findByActivoTrue();
}