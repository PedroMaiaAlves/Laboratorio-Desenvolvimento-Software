package com.example.Aluguel.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteDTO {
    private Long id;
    private String cpf;
    private String nome;
    private String endereco;
}