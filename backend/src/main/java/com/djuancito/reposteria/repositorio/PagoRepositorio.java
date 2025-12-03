
package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PagoRepositorio extends JpaRepository<Pago, Integer> {
}