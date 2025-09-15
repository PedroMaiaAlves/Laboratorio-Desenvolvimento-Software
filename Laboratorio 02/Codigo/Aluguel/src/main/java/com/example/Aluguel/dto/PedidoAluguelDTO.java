package com.example.Aluguel.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoAluguelDTO {
    private Long id;
    private Long clienteId;
    private Long automovelId;
    private String status;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataModificacao;
    private Boolean possuiContratoCredito;
    private String bancoContrato;
}