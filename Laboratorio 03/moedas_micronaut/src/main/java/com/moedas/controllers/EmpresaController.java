package com.moedas.controllers;

import com.moedas.Service.empresa.EmpresaService;
import com.moedas.dto.request.CreateEmpresaRequestDTO;
import com.moedas.dto.request.UpdateEmpresaRequestDTO;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import lombok.RequiredArgsConstructor;

@Controller("/empresa")
@RequiredArgsConstructor
public class EmpresaController {

    private final EmpresaService empresaService;

    @Post("/create")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> createEmpresa(@Body  CreateEmpresaRequestDTO createEmpresaRequestDTO) {
        try{
            return HttpResponse.ok(empresaService.createEmpresa(createEmpresaRequestDTO));
        }catch (Exception e) {
            return HttpResponse.badRequest(e.getMessage());
        }
    }

    @Put("/update/{id}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> updateEmpresa(@Body UpdateEmpresaRequestDTO updateEmpresaRequestDTO, @PathVariable Long id) {
        try{
            return HttpResponse.ok(empresaService.updateEmpresa(updateEmpresaRequestDTO, id));
        } catch (Exception e) {
            return HttpResponse.badRequest(e.getMessage());
        }
    }

    @Get("/view/{id}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> viewEmpresa(@PathVariable Long id) {
        try {
            return HttpResponse.ok(empresaService.viewEmpresa(id));
        }catch (Exception e) {
            return HttpResponse.badRequest(e.getMessage());
        }
    }

    @Delete("/{id}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> deleteEmpresa(@PathVariable Long id) {
        try{
            empresaService.deleteEmpresa(id);
            return HttpResponse.noContent();
        }catch (Exception e) {
            return HttpResponse.badRequest(e.getMessage());
        }
    }

}
