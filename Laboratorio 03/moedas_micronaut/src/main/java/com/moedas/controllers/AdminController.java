package com.moedas.controllers;

import com.moedas.services.MoedaService;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import lombok.RequiredArgsConstructor;

import java.util.Map;

@Controller("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final MoedaService moedaService;

    @Post("/adicionar-moedas-semestrais")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public Map<String, String> adicionarMoedasSemestrais() {
        moedaService.adicionarMoedasSemestrais();
        return Map.of("message", "Moedas semestrais adicionadas a todos os professores");
    }
}