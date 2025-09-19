package com.example.Aluguel.controller;

import com.example.Aluguel.dto.AutomovelDTO;
import com.example.Aluguel.service.AutomovelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/automoveis")
@RequiredArgsConstructor
public class AutomovelController {

    private final AutomovelService automovelService;

    @PostMapping("/cadastrar")
    public ResponseEntity<AutomovelDTO> criarAutomovel(@RequestBody AutomovelDTO automovelDTO) {
        AutomovelDTO createdAutomovel = automovelService.criarAutomovel(automovelDTO);
        return ResponseEntity.ok(createdAutomovel);
    }

    @GetMapping("/listar")
    public ResponseEntity<List<AutomovelDTO>> listarAutomoveis() {
        List<AutomovelDTO> automoveis = automovelService.listarAutomoveis();
        return ResponseEntity.ok(automoveis);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AutomovelDTO> buscarAutomovel(@PathVariable Long id) {
        AutomovelDTO automovel = automovelService.buscarPorId(id);
        return ResponseEntity.ok(automovel);
    }

    @PutMapping("/{id}/atualizar")
    public ResponseEntity<AutomovelDTO> atualizarAutomovel(@PathVariable Long id, @RequestBody AutomovelDTO automovelDTO) {
        AutomovelDTO updatedAutomovel = automovelService.atualizarAutomovel(id, automovelDTO);
        return ResponseEntity.ok(updatedAutomovel);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAutomovel(@PathVariable Long id) {
        automovelService.deletarAutomovel(id);
        return ResponseEntity.noContent().build();
    }
}
