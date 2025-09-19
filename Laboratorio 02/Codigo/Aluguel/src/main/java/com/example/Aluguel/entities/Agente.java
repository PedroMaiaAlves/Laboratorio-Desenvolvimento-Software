package com.example.Aluguel.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "agentes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String cnpj;

    private String endereco;

    private String telefone;

    @Enumerated(EnumType.STRING)
    private TipoAgente tipoAgente;

    @Builder.Default
    @Column(nullable = false)
    private Boolean ativo = true;

    public enum TipoAgente {
        BANCO, EMPRESA_FINANCEIRA, LOCADORA
    }
}
