package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.Promocion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromocionRepositorio extends JpaRepository<Promocion, Integer> {

    @Query("SELECT DISTINCT p FROM Promocion p " +
           "LEFT JOIN FETCH p.promocionProductos pp " +
           "LEFT JOIN FETCH pp.producto prod " +
           "WHERE p.estado = 'activo' AND :fechaActual BETWEEN p.fechaInicio AND p.fechaFin")
    List<Promocion> findPromocionesActivas(@Param("fechaActual") LocalDate fechaActual);

    @Query("SELECT DISTINCT p FROM Promocion p " +
           "LEFT JOIN FETCH p.promocionProductos pp " +
           "LEFT JOIN FETCH pp.producto prod " +
           "WHERE p.promocionId = :id")
    Optional<Promocion> findByIdWithProductos(@Param("id") Integer id);
}