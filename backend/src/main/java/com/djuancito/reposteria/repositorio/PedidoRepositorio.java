package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PedidoRepositorio extends JpaRepository<Pedido, Integer> {

List<Pedido> findByUsuarioUsuarioId(Long usuarioId);
    @Query("SELECT p FROM Pedido p ORDER BY p.fechaPedido DESC")
    List<Pedido> findAllOrderedByFecha();

    long countByEstado(com.djuancito.reposteria.entidad.EstadoPedido estado);
}