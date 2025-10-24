package com.moedas.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransacaoRequest {
    private Long alunoId;
    private double quantidadeMoedas;
    private String motivo;
}