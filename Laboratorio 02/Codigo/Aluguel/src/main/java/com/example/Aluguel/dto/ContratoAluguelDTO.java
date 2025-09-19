package com.example.Aluguel.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContratoAluguelDTO {
    private Long id;
    private Long pedidoId;
    private Long agenteId;
    private String numeroContrato;
    private BigDecimal valorMensal;
    private Integer prazoMeses;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private String status;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataModificacao;
    private String observacoes;
}
