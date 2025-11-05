package com.moedas.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "vantagem")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vantagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String descricao;

    private String fotoUrl;

    private double custoMoedas;

    private boolean ativa;

    @ManyToOne
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    // Novo campo: ID do aluno que resgatou a vantagem
    @Column(name = "aluno_id")
    private Long alunoId;
}