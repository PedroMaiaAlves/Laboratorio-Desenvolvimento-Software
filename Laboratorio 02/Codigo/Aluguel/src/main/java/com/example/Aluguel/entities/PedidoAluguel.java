package com.example.Aluguel.entities;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pedidos_aluguel")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoAluguel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "automovel_id", nullable = false)
    private Automovel automovel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agente_id")
    private Agente agente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPedido status;

    @Column(nullable = false)
    private LocalDateTime dataCriacao;

    private LocalDateTime dataModificacao;

    private Boolean possuiContratoCredito;

    private String bancoContrato;

    public enum StatusPedido {
        PENDENTE, ANALISE_FINANCEIRA, APROVADO, REJEITADO, CONTRATADO, CANCELADO
    }

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        dataModificacao = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dataModificacao = LocalDateTime.now();
    }
}