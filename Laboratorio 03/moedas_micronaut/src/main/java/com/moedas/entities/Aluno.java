package com.moedas.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity(name = "aluno")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Aluno{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String senha;

    private String cpf;

    private String rg;

    private String endereco;

    @ManyToOne
    @JoinColumn(name = "instituicao_id")
    private Instituicao instituicao;

    private String curso;

    private double saldoMoedas;

    public String getRole() {
        return "ALUNO";
    }
}
