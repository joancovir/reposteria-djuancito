// Archivo: TemporadaServicio.java
package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Producto;
// Debes crear el RepositorioProductoTemporada para la consulta
import com.djuancito.reposteria.repositorio.TemporadaProductoRepositorio; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TemporadaServicio {

    @Autowired
    private TemporadaProductoRepositorio temporadaProductoRepositorio;

    // Método para obtener los productos de la temporada activa
    public List<Producto> obtenerProductosDeTemporadaActiva() {
        // Lógica: Buscar la Temporada donde estado='activo' y fechaActual esté entre fechaInicio y fechaFin.
        // Luego, a través de la tabla TemporadaProducto, traer la lista de Productos.
        // **ESTA CONSULTA REQUIERE CREAR UN MÉTODO EN EL REPOSITORIO**
        
        // Simulación de la llamada al repositorio que buscará la TemporadaProducto
        return temporadaProductoRepositorio.findProductosByTemporadaActiva();
    }
}