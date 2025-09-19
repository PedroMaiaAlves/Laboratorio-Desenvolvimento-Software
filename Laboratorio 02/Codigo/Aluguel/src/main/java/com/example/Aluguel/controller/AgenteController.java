package com.example.Aluguel.controller;

import com.example.Aluguel.dto.AgenteDTO;
import com.example.Aluguel.service.AgenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agentes")
@RequiredArgsConstructor
public class AgenteController {

    private final AgenteService agenteService;

    @PostMapping("/cadastrar")
    public ResponseEntity<AgenteDTO> criarAgente(@RequestBody AgenteDTO agenteDTO) {
        AgenteDTO createdAgente = agenteService.criarAgente(agenteDTO);
        return ResponseEntity.ok(createdAgente);
    }

    @GetMapping("/listar")
    public ResponseEntity<List<AgenteDTO>> listarAgentes() {
        List<AgenteDTO> agentes = agenteService.listarAgentes();
        return ResponseEntity.ok(agentes);
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<AgenteDTO>> listarAgentesAtivos() {
        List<AgenteDTO> agentes = agenteService.listarAgentesAtivos();
        return ResponseEntity.ok(agentes);
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<AgenteDTO>> listarAgentesPorTipo(@PathVariable String tipo) {
        List<AgenteDTO> agentes = agenteService.listarAgentesPorTipo(tipo);
        return ResponseEntity.ok(agentes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgenteDTO> buscarAgente(@PathVariable Long id) {
        AgenteDTO agente = agenteService.buscarPorId(id);
        return ResponseEntity.ok(agente);
    }
}
