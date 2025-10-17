package com.moedas.Service.aluno;

import com.moedas.dto.request.CreateAlunoRequestDTO;
import com.moedas.dto.response.CreateAlunoResponseDTO;
import com.moedas.entities.Aluno;
import com.moedas.repositories.AlunoRepository;
import com.nimbusds.jose.crypto.PasswordBasedEncrypter;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

@Singleton
@RequiredArgsConstructor
public class CadastrarAlunoService {

    private final AlunoRepository alunoRepository;
    private final PasswordBasedEncrypter passwordBasedEncrypter;

    public CreateAlunoResponseDTO create(CreateAlunoRequestDTO createAlunoRequestDTO) {
        if (createAlunoRequestDTO.getCpf() == null || createAlunoRequestDTO.getCpf().trim().isEmpty()) {
            throw new IllegalArgumentException("CPF é obrigatório");
        }

        if (createAlunoRequestDTO.getEmail() == null || createAlunoRequestDTO.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email é obrigatório");
        }

        if (createAlunoRequestDTO.getSenha() == null || createAlunoRequestDTO.getSenha().trim().isEmpty()) {
            throw new IllegalArgumentException("Senha é obrigatória");
        }

        String senhaCriptografada = passwordBasedEncrypter.encrypt(createAlunoRequestDTO.getSenha(), 12);
        createAlunoRequestDTO.setSenha(senhaCriptografada);

        Aluno aluno = createEntity(createAlunoRequestDTO);
        aluno = alunoRepository.save(aluno);
        return createDTO(aluno);
    }

    private Aluno createEntity(CreateAlunoRequestDTO createAlunoRequestDTO) {
        return Aluno.builder()
                .rg(createAlunoRequestDTO.getRg())
                .cpf(createAlunoRequestDTO.getCpf())
                .email(createAlunoRequestDTO.getEmail())
                .senha(createAlunoRequestDTO.getSenha())
                .endereco(createAlunoRequestDTO.getEndereco())
                .nome(createAlunoRequestDTO.getNome())
                .build();
    }

    private CreateAlunoResponseDTO createDTO(Aluno aluno) {
        return CreateAlunoResponseDTO.builder()
                .id(aluno.getId())
                .email(aluno.getEmail())
                .senha(aluno.getSenha())
                .nome(aluno.getNome())
                .endereco(aluno.getEndereco())
                .rg(aluno.getRg())
                .cpf(aluno.getCpf())
                .build();
    }
}