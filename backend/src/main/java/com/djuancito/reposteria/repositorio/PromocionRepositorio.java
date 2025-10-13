package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.Promocion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // <-- Importante
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDate;

@Repository
public interface PromocionRepositorio extends JpaRepository<Promocion, Integer> {

    // Reemplazamos el método automático por una consulta explícita y más segura
    @Query("SELECT p FROM Promocion p WHERE p.estado = 'activo' AND :fechaActual BETWEEN p.fechaInicio AND p.fechaFin")
    List<Promocion> findPromocionesActivas(@Param("fechaActual") LocalDate fechaActual);
}