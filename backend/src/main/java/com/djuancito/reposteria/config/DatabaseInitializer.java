package com.djuancito.reposteria.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);
    private final JdbcTemplate jdbcTemplate;

    public DatabaseInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        log.info("Verificando consistencia de esquema en la base de datos...");
        ejecutarSilencioso("ALTER TABLE pedido MODIFY COLUMN garantia_pagada decimal(10,2) NULL DEFAULT 0.00");
        ejecutarSilencioso("ALTER TABLE pedido MODIFY COLUMN garantiaPagada decimal(10,2) NOT NULL DEFAULT 0.00");
        ejecutarSilencioso("ALTER TABLE pedido MODIFY COLUMN subtotal decimal(10,2) NOT NULL DEFAULT 0.00");
        ejecutarSilencioso("ALTER TABLE pedido MODIFY COLUMN resto decimal(10,2) NOT NULL DEFAULT 0.00");
        ejecutarSilencioso("ALTER TABLE personalizacion MODIFY COLUMN descripcionExtra varchar(255) NULL DEFAULT ''");
        ejecutarSilencioso("ALTER TABLE pago MODIFY COLUMN metodo enum('yape','plin','efectivo','PENDIENTE') NULL DEFAULT 'yape'");
    }

    private void ejecutarSilencioso(String sql) {
        try {
            jdbcTemplate.execute(sql);
            log.info("Ajuste de esquema aplicado: {}", sql);
        } catch (Exception e) {
            log.debug("Aviso al ejecutar '{}': {}", sql, e.getMessage());
        }
    }
}
