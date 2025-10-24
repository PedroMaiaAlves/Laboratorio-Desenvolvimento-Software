package com.moedas.controllers;

import com.moedas.dto.request.TransacaoRequest;
import com.moedas.entities.Professor;
import com.moedas.entities.Transacao;
import com.moedas.repositories.ProfessorRepository;
import com.moedas.repositories.TransacaoRepository;
import com.moedas.services.MoedaService;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

@Controller("/professores")
@Secured(SecurityRule.IS_AUTHENTICATED)
@RequiredArgsConstructor
public class ProfessorController {

    private final MoedaService moedaService;
    private final ProfessorRepository professorRepository;
    private final TransacaoRepository transacaoRepository;

    @Post("/{id}/distribuir-moedas")
    @Secured("PROFESSOR")
    public Transacao distribuirMoedas(@PathVariable Long id, @Body TransacaoRequest request) {
        return moedaService.distribuirMoedas(id, request);
    }

    @Get("/{id}/extrato")
    @Secured("PROFESSOR")
    public List<Transacao> getExtrato(@PathVariable Long id) {
        return transacaoRepository.findByProfessorIdOrderByDataHoraDesc(id);
    }

    @Get("/{id}/saldo")
    @Secured("PROFESSOR")
    public Map<String, Double> getSaldo(@PathVariable Long id) {
        double saldo = moedaService.consultarSaldoProfessor(id);
        return Map.of("saldo", saldo);
    }

    @Get("/{id}")
    @Secured("PROFESSOR")
    public Professor getProfessor(@PathVariable Long id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
    }
}