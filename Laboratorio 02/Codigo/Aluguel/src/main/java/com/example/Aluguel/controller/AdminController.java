package com.example.Aluguel.controller;

import com.example.Aluguel.dto.AdminDTO;
import com.example.Aluguel.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/cadastrar")
    public ResponseEntity<AdminDTO> criar(@RequestBody AdminDTO dto) {
        return ResponseEntity.ok(adminService.criar(dto));
    }

    @GetMapping("/listar")
    public ResponseEntity<List<AdminDTO>> listar() {
        return ResponseEntity.ok(adminService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminDTO> obter(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.obter(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminDTO> atualizar(@PathVariable Long id, @RequestBody AdminDTO dto) {
        return ResponseEntity.ok(adminService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        adminService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}


