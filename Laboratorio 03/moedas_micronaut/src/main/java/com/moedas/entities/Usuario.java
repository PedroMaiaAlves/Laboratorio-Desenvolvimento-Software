package com.moedas.entities;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Usuario {
    private String nome;
    private String email;
    private String senha;

    public String getRole(){
        return "ROLE_USER";
    }
}
