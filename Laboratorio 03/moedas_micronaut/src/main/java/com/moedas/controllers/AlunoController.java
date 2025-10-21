package com.moedas.controllers;

import com.moedas.Service.aluno.AlunoService;
import com.moedas.dto.request.CreateAlunoRequestDTO;
import com.moedas.dto.request.UpdateAlunoRequestDTO;
import com.moedas.dto.response.CreateAlunoResponseDTO;
import com.moedas.entities.Aluno;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import lombok.RequiredArgsConstructor;

@Controller("/aluno")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService alunoService;


    @Post("/cadastrar")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> cadastrarAluno(@Body CreateAlunoRequestDTO createAlunoRequestDTO) {
        try {
            CreateAlunoResponseDTO response = alunoService
                    .create(createAlunoRequestDTO);
            return HttpResponse.ok(response);
        } catch (IllegalArgumentException e) {
            return HttpResponse.badRequest(e.getMessage());
        } catch (Exception e) {
            return HttpResponse.serverError("Erro interno no servidor");
        }
    }

    @Put("/update/{id}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> atualizarAluno(@Body UpdateAlunoRequestDTO updateAlunoRequestDTO, @PathVariable int id) {
        try{
            System.out.println(id);
            return HttpResponse.ok(alunoService.update(updateAlunoRequestDTO, id));
        } catch (Exception e) {
            return HttpResponse.serverError("Erro interno no servidor");
        }
    }

    @Get("/view/{id}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> visualizarPerfil(@PathVariable int id) {
        try{
            return HttpResponse.ok(alunoService.viewPerfil(id));
        } catch (Exception e) {
            return HttpResponse.badRequest(e.getMessage());
        }
    }

    @Get("/all")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> listarAlunos() {
        try{
            return HttpResponse.ok(alunoService.lista());
        } catch (Exception e) {
            return HttpResponse.badRequest(e.getMessage());
        }
    }

    @Delete("/{id}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> deletarAluno(@PathVariable int id) {
        try {
            alunoService.delete(id);
            return HttpResponse.noContent();
        }catch (Exception e) {
            return HttpResponse.serverError("Erro interno no servidor");
        }
    }
}