// ConfiguracionTiendaRepositorio.java
package com.djuancito.reposteria.repositorio;

import com.djuancito.reposteria.entidad.ConfiguracionTienda;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfiguracionTiendaRepositorio extends JpaRepository<ConfiguracionTienda, Long> {
}
