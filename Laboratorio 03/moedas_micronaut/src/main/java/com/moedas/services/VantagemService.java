package com.moedas.services;

import com.moedas.dto.request.VantagemRequest;
import com.moedas.entities.Empresa;
import com.moedas.entities.Vantagem;
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

    public Vantagem toggleVantagem(Long vantagemId, Long empresaId) {
        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new RuntimeException("Vantagem não encontrada"));

        if (!vantagem.getEmpresa().getId().equals(empresaId)) {
            throw new RuntimeException("Vantagem não pertence a esta empresa");
        }

        vantagem.setAtiva(!vantagem.isAtiva());
        vantagemRepository.update(vantagem);

        log.info("Vantagem {} {} pela empresa {}",
                vantagem.getNome(), vantagem.isAtiva() ? "ativada" : "desativada", empresaId);

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