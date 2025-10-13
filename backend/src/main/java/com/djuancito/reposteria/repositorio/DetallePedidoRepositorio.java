package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetallePedidoRepositorio extends JpaRepository<DetallePedido, Integer> {
}