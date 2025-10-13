package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;
@Repository
public interface PedidoRepositorio extends JpaRepository<Pedido, Integer> {
    List<Pedido> findByUsuarioUsuarioIdOrderByFechaPedidoDesc(Integer usuarioId);
}