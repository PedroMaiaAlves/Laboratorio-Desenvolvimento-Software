package com.moedas.services;

import com.moedas.dto.request.ResgateRequest;
import com.moedas.entities.*;
import com.moedas.repositories.*;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Singleton
@RequiredArgsConstructor
@Slf4j
public class ResgateService {

    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;
    private final ResgateRepository resgateRepository;
    private final EmpresaRepository empresaRepository;

    @Transactional
    public Resgate resgatarVantagem(Long alunoId, ResgateRequest request) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        Vantagem vantagem = vantagemRepository.findById(request.getVantagemId())
                .orElseThrow(() -> new RuntimeException("Vantagem não encontrada"));

        if (!vantagem.isAtiva()) {
            throw new RuntimeException("Vantagem não está disponível");
        }

        if (aluno.getSaldoMoedas() < vantagem.getCustoMoedas()) {
            throw new RuntimeException("Saldo insuficiente para resgatar esta vantagem");
        }

        // Debitar moedas do aluno
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() - vantagem.getCustoMoedas());
        alunoRepository.update(aluno);

        // Criar resgate
        Resgate resgate = Resgate.builder()
                .aluno(aluno)
                .vantagem(vantagem)
                .build();

        resgate = resgateRepository.save(resgate);

        log.info("Aluno {} resgatou vantagem {} por {} moedas. Código cupom: {}",
                aluno.getNome(), vantagem.getNome(), vantagem.getCustoMoedas(), resgate.getCodigoCupom());

        return resgate;
    }

    @Transactional
    public Resgate validarResgate(String codigoCupom, Long empresaId) {
        Resgate resgate = resgateRepository.findByCodigoCupom(codigoCupom)
                .orElseThrow(() -> new RuntimeException("Cupom não encontrado"));

        if (!resgate.getVantagem().getEmpresa().getId().equals(empresaId)) {
            throw new RuntimeException("Este cupom não pertence a esta empresa");
        }

        if (resgate.isUtilizado()) {
            throw new RuntimeException("Cupom já foi utilizado");
        }

        resgate.setUtilizado(true);
        resgateRepository.update(resgate);

        log.info("Cupom {} validado com sucesso pela empresa {}", codigoCupom, empresaId);

        return resgate;
    }
}