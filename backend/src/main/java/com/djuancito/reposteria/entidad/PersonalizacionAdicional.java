    package com.djuancito.reposteria.entidad;

    import jakarta.persistence.*;
    import lombok.Data;

    @Data
    @Entity
    @Table(name = "personalizacionadicional")
    public class PersonalizacionAdicional {
        @EmbeddedId
        private PersonalizacionAdicionalId id;
    }