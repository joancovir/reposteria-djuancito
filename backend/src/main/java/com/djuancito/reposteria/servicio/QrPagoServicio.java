package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.QrPago;
import com.djuancito.reposteria.repositorio.QrPagoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QrPagoServicio {

    @Autowired
    private QrPagoRepositorio repo;

    public List<QrPago> obtenerTodos() {
        return repo.findAll();
    }

    public List<QrPago> obtenerActivos() {
        return repo.findByActivoTrue();
    }

    // ← AQUÍ ESTABA EL ERROR
    public QrPago guardar(QrPago qr) {
        return repo.save(qr);  
    }

    public QrPago toggleActivo(Long id) {
        QrPago qr = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("QR no encontrado"));
        qr.setActivo(!qr.getActivo());
        return repo.save(qr);
    }

    public void eliminar(Long id) {
        repo.deleteById(id);
    }
}