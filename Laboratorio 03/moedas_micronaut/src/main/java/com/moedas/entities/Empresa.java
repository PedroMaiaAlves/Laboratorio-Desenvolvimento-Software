package com.moedas.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity(name = "empresa")
@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Empresa extends Usuario{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cnpj;

    private String razaoSocial;

    private String telefone;

    @Override
    public String getRole() {
        return "EMPRESA";
    }
}
