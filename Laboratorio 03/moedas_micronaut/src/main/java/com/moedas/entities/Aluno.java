package com.moedas.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity(name = "aluno")
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Aluno extends Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String cpf;

    private String rg;

    private String endereco;

    @ManyToOne
    @JoinColumn(name = "instituicao_id")
    private Instituicao instituicao;

    private String curso;

    private double saldoMoedas;

    @Override
    public String getRole() {
        return "ALUNO";
    }
}
