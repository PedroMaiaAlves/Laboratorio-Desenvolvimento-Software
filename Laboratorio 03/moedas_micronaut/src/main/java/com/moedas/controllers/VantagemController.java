package com.moedas.controllers;

import com.moedas.dto.request.VantagemRequest;
import com.moedas.repositories.UsarVantagemRepository;
import com.moedas.services.VantagemService;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Controller("/vantagem")
@RequiredArgsConstructor
public class VantagemController {

    private final VantagemService vantagemService;

    @Post("{idEmpresa}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> createVantagem(@PathVariable Long idEmpresa, @Body VantagemRequest vantagemRequest) {
        try {
            return HttpResponse.created(vantagemService.criarVantagem(idEmpresa, vantagemRequest));
        } catch (Exception e) {
            return HttpResponse.serverError();
        }
    }

    // NOVO ENDPOINT: Listar vantagens por aluno
    @Get("/aluno/{alunoId}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> listarVantagensPorAluno(@PathVariable Long alunoId) {
        try {
            List<?> vantagens = vantagemService.listarVantagensPorAluno(alunoId);
            return HttpResponse.ok(vantagens);
        } catch (Exception e) {
            return HttpResponse.serverError();
        }
    }

    // NOVO ENDPOINT: Resgatar vantagem
    @Post("/resgatar/{vantagemId}/aluno/{alunoId}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> resgatarVantagem(@PathVariable Long vantagemId, @PathVariable Long alunoId) {
        try {
            return HttpResponse.ok(vantagemService.resgatarVantagem(vantagemId, alunoId));
        } catch (Exception e) {
            return HttpResponse.badRequest(e.getMessage());
        }
    }

    // Endpoint para listar vantagens por empresa
    @Get("/empresa/{empresaId}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> listarVantagensPorEmpresa(@PathVariable Long empresaId) {
        try {
            List<?> vantagens = vantagemService.listarVantagensPorEmpresa(empresaId);
            return HttpResponse.ok(vantagens);
        } catch (Exception e) {
            return HttpResponse.serverError();
        }
    }

    // Endpoint para listar todas as vantagens ativas
    @Get("/ativas")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> listarVantagensAtivas() {
        try {
            List<?> vantagens = vantagemService.listarVantagensAtivas();
            return HttpResponse.ok(vantagens);
        } catch (Exception e) {
            return HttpResponse.serverError();
        }
    }
}