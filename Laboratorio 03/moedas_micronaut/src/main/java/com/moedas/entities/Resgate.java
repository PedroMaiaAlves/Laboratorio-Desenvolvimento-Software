package com.moedas.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity(name = "resgate")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resgate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "vantagem_id")
    private Vantagem vantagem;

    private String codigoCupom;

    private LocalDateTime dataHora;

    private boolean utilizado;

    @PrePersist
    protected void onCreate() {
        dataHora = LocalDateTime.now();
        utilizado = false;
        codigoCupom = java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}