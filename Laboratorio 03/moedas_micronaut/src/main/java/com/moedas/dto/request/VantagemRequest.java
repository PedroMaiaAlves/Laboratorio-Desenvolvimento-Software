package com.moedas.dto.request;

import lombok.Data;

@Data
public class VantagemRequest {
    private String nome;
    private String descricao;
    private String fotoUrl;
    private double custoMoedas;
}