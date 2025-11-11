package com.moedas.services;

import com.moedas.dto.request.VantagemRequest;
import com.moedas.entities.Aluno;
import com.moedas.entities.Empresa;
import com.moedas.entities.Vantagem;
import com.moedas.repositories.AlunoRepository;
import com.moedas.repositories.EmpresaRepository;
import com.moedas.repositories.VantagemRepository;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Singleton
@RequiredArgsConstructor
@Slf4j
public class VantagemService {

    private final VantagemRepository vantagemRepository;
    private final AlunoRepository alunoRepository;
    private final EmpresaRepository empresaRepository;

    public Vantagem criarVantagem(Long empresaId, VantagemRequest request) {
        Empresa empresa = empresaRepository.findById(empresaId)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));

        Vantagem vantagem = Vantagem.builder()
                .nome(request.getNome())
                .descricao(request.getDescricao())
                .fotoUrl(request.getFotoUrl())
                .custoMoedas(request.getCustoMoedas())
                .empresa(empresa)
                .ativa(true)
                .alunoId(null) // Inicialmente sem aluno associado
                .build();

        vantagem = vantagemRepository.save(vantagem);

        log.info("Vantagem {} criada pela empresa {}", vantagem.getNome(), empresa.getRazaoSocial());

        return vantagem;
    }

    public List<Vantagem> listarVantagensAtivas() {
        return vantagemRepository.findByAtivaTrue();
    }

    public List<Vantagem> listarVantagensPorEmpresa(Long empresaId) {
        return vantagemRepository.findByEmpresaId(empresaId);
    }

    // NOVO MÉTODO: Listar vantagens por aluno
    public List<Vantagem> listarVantagensPorAluno(Long alunoId) {
        return vantagemRepository.findByAlunoId(alunoId);
    }

    // NOVO MÉTODO: Listar vantagens disponíveis para resgate
    public List<Vantagem> listarVantagensDisponiveis() {
        return vantagemRepository.findAll();
    }

    // NOVO MÉTODO: Resgatar vantagem (associar a um aluno)
    public Vantagem resgatarVantagem(Long vantagemId, Long alunoId) {
        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new RuntimeException("Vantagem não encontrada"));

        if (!vantagem.isAtiva()) {
            throw new RuntimeException("Vantagem não está ativa");
        }

        if (vantagem.getAlunoId() != null) {
            throw new RuntimeException("Vantagem já foi resgatada");
        }
        Aluno aluno = alunoRepository.findById(alunoId).orElseThrow(() -> new RuntimeException("Nenhum aluno encontrado"));
        if(aluno.getSaldoMoedas() < vantagem.getCustoMoedas()){
            throw new RuntimeException("Moedas insuficientes");
        }

        aluno.setSaldoMoedas(aluno.getSaldoMoedas() - vantagem.getCustoMoedas());
        alunoRepository.update(aluno);
        vantagem.setAlunoId(alunoId);
        vantagem = vantagemRepository.update(vantagem);

        log.info("Vantagem {} resgatada pelo aluno {}", vantagem.getNome(), alunoId);

        return vantagem;
    }

    public void deletarVantagem(Long vantagemId, Long empresaId) {
        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new RuntimeException("Vantagem não encontrada"));

        if (!vantagem.getEmpresa().getId().equals(empresaId)) {
            throw new RuntimeException("Vantagem não pertence a esta empresa");
        }

        vantagemRepository.delete(vantagem);
        log.info("Vantagem {} deletada pela empresa {}", vantagem.getNome(), empresaId);
    }
}