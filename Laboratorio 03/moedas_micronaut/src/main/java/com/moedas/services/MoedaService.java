package com.moedas.services;

import com.moedas.dto.request.TransacaoRequest;
import com.moedas.entities.*;
import com.moedas.repositories.*;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

@Singleton
@RequiredArgsConstructor
@Slf4j
public class MoedaService {

    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final TransacaoRepository transacaoRepository;

    @Transactional
    public Transacao distribuirMoedas(Long professorId, TransacaoRequest request) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));

        Aluno aluno = alunoRepository.findById(request.getAlunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        if (professor.getSaldoMoedas() < request.getQuantidadeMoedas()) {
            throw new RuntimeException("Saldo insuficiente do professor");
        }

        if (request.getQuantidadeMoedas() <= 0) {
            throw new RuntimeException("Quantidade de moedas deve ser maior que zero");
        }

        // Atualizar saldos
        professor.setSaldoMoedas(professor.getSaldoMoedas() - request.getQuantidadeMoedas());
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() + request.getQuantidadeMoedas());

        professorRepository.update(professor);
        alunoRepository.update(aluno);

        // Registrar transação
        Transacao transacao = Transacao.builder()
                .professor(professor)
                .aluno(aluno)
                .quantidadeMoedas(request.getQuantidadeMoedas())
                .motivo(request.getMotivo())
                .dataHora(LocalDateTime.now())
                .build();

        transacao = transacaoRepository.save(transacao);

        log.info("Professor {} distribuiu {} moedas para o aluno {}",
                professor.getNome(), request.getQuantidadeMoedas(), aluno.getNome());

        return transacao;
    }

    @Transactional
    public void adicionarMoedasSemestrais() {
        professorRepository.findAll().forEach(professor -> {
            double novoSaldo = professor.getSaldoMoedas() + 1000;
            professor.setSaldoMoedas(novoSaldo);
            professorRepository.update(professor);
            log.info("Adicionadas 1000 moedas semestrais para professor {}. Novo saldo: {}",
                    professor.getNome(), novoSaldo);
        });
    }

    public double consultarSaldoProfessor(Long professorId) {
        return professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"))
                .getSaldoMoedas();
    }

    public double consultarSaldoAluno(Long alunoId) {
        return alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"))
                .getSaldoMoedas();
    }
}