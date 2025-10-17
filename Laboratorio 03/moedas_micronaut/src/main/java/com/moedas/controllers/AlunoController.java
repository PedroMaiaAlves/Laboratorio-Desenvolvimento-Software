package com.moedas.controllers;

import com.moedas.Service.aluno.CadastrarAlunoService;
import com.moedas.dto.request.CreateAlunoRequestDTO;
import com.moedas.dto.response.CreateAlunoResponseDTO;
import com.moedas.entities.Aluno;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Controller("/aluno")
@RequiredArgsConstructor
public class AlunoController {

    private final CadastrarAlunoService cadastrarAlunoService;


    @Post("/cadastrar")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> cadastrarAluno(@Body CreateAlunoRequestDTO createAlunoRequestDTO) {
        try {
            CreateAlunoResponseDTO response = cadastrarAlunoService.create(createAlunoRequestDTO);
            return HttpResponse.ok(response);
        } catch (IllegalArgumentException e) {
            return HttpResponse.badRequest(e.getMessage());
        } catch (Exception e) {
            return HttpResponse.serverError("Erro interno no servidor");
        }
    }
}