package com.moedas.controllers;

import com.moedas.dto.request.CreateAlunoRequestDTO;
import com.moedas.dto.request.ResgateRequest;
import com.moedas.dto.request.UpdateAlunoRequestDTO;
import com.moedas.dto.response.CreateAlunoResponseDTO;
import com.moedas.entities.Aluno;
import com.moedas.entities.Resgate;
import com.moedas.entities.Transacao;
import com.moedas.entities.Vantagem;
import com.moedas.repositories.AlunoRepository;
import com.moedas.repositories.ResgateRepository;
import com.moedas.repositories.TransacaoRepository;
import com.moedas.repositories.VantagemRepository;
import com.moedas.services.MoedaService;
import com.moedas.services.ResgateService;
import com.moedas.services.aluno.AlunoService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

@Controller("/alunos")
@Secured(SecurityRule.IS_AUTHENTICATED)
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;
    private final TransacaoRepository transacaoRepository;
    private final ResgateRepository resgateRepository;
    private final MoedaService moedaService;
    private final ResgateService resgateService;
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
    public HttpResponse<?> atualizarAluno(@Body UpdateAlunoRequestDTO updateAlunoRequestDTO, @PathVariable long id) {
        try{
            System.out.println(id);
            return HttpResponse.ok(alunoService.update(updateAlunoRequestDTO, id));
        } catch (Exception e) {
            return HttpResponse.serverError("Erro interno no servidor");
        }
    }

    @Get("/view/{id}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> visualizarPerfil(@PathVariable long id) {
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
    public HttpResponse<?> deletarAluno(@PathVariable long id) {
        try {
            alunoService.delete(id);
            return HttpResponse.noContent();
        }catch (Exception e) {
            return HttpResponse.serverError("Erro interno no servidor");
        }
    }

    @Get("/vantagens")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public List<Vantagem> getVantagens() {
        return vantagemRepository.findByAtivaTrue();
    }

    @Post("/{id}/resgatar")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public Resgate resgatarVantagem(@PathVariable Long id, @Body ResgateRequest request) {
        return resgateService.resgatarVantagem(id, request);
    }

    @Get("/{id}/extrato-transacoes")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public List<Transacao> getExtratoTransacoes(@PathVariable Long id) {
        return transacaoRepository.findByAlunoIdOrderByDataHoraDesc(id);
    }

    @Get("/{id}/extrato-resgates")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public List<Resgate> getExtratoResgates(@PathVariable Long id) {
        return resgateRepository.findByAlunoIdOrderByDataHoraDesc(id);
    }

    @Get("/{id}/saldo")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public Map<String, Double> getSaldo(@PathVariable Long id) {
        double saldo = moedaService.consultarSaldoAluno(id);
        return Map.of("saldo", saldo);
    }
}