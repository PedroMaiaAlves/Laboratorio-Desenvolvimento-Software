package com.example.Aluguel.service;

import com.example.Aluguel.dto.AgenteDTO;
import com.example.Aluguel.entities.Agente;
import com.example.Aluguel.repository.AgenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgenteService {

    private final AgenteRepository agenteRepository;

    public AgenteDTO criarAgente(AgenteDTO agenteDTO) {
        if (agenteRepository.existsByCnpj(agenteDTO.getCnpj())) {
            throw new RuntimeException("CNPJ já cadastrado");
        }

        Agente agente = Agente.builder()
                .nome(agenteDTO.getNome())
                .cnpj(agenteDTO.getCnpj())
                .endereco(agenteDTO.getEndereco())
                .telefone(agenteDTO.getTelefone())
                .tipoAgente(Agente.TipoAgente.valueOf(agenteDTO.getTipoAgente()))
                .ativo(true)
                .build();

        Agente savedAgente = agenteRepository.save(agente);
        return convertToDTO(savedAgente);
    }

    public List<AgenteDTO> listarAgentes() {
        return agenteRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AgenteDTO> listarAgentesAtivos() {
        return agenteRepository.findByAtivoTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AgenteDTO> listarAgentesPorTipo(String tipo) {
        Agente.TipoAgente tipoEnum = Agente.TipoAgente.valueOf(tipo.toUpperCase());
        return agenteRepository.findByTipoAgente(tipoEnum).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AgenteDTO buscarPorId(Long id) {
        Agente agente = agenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agente não encontrado"));
        return convertToDTO(agente);
    }

    private AgenteDTO convertToDTO(Agente agente) {
        return AgenteDTO.builder()
                .id(agente.getId())
                .nome(agente.getNome())
                .cnpj(agente.getCnpj())
                .endereco(agente.getEndereco())
                .telefone(agente.getTelefone())
                .tipoAgente(agente.getTipoAgente().name())
                .ativo(agente.getAtivo())
                .build();
    }
}
