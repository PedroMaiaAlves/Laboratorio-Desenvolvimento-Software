package com.moedas.controllers;

import com.moedas.services.MoedaService;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import lombok.RequiredArgsConstructor;

import java.util.Map;

@Controller("/admin")
@Secured(SecurityRule.IS_AUTHENTICATED)
@RequiredArgsConstructor
public class AdminController {

    private final MoedaService moedaService;

    @Post("/adicionar-moedas-semestrais")
    @Secured({"PROFESSOR", "ADMIN"})
    public Map<String, String> adicionarMoedasSemestrais() {
        moedaService.adicionarMoedasSemestrais();
        return Map.of("message", "Moedas semestrais adicionadas a todos os professores");
    }
}