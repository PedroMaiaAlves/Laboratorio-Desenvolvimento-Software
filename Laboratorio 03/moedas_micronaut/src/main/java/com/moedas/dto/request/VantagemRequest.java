package com.moedas.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VantagemRequest {
    private String nome;
    private String descricao;
    private String fotoUrl;
    private double custoMoedas;
}