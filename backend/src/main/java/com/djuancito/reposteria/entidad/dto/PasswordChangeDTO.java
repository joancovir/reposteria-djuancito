
package com.djuancito.reposteria.entidad.dto;

import lombok.Data;

@Data 
public class PasswordChangeDTO {

    private String passwordActual;
    private String nuevaPassword;

}