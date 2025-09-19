package com.example.Aluguel.controller;

import com.example.Aluguel.dto.PedidoAluguelDTO;
import com.example.Aluguel.service.PedidoAluguelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
public class PedidoAluguelController {

    private final PedidoAluguelService pedidoService;

    @PostMapping("/criar")
    public ResponseEntity<PedidoAluguelDTO> criarPedido(@RequestBody PedidoAluguelDTO pedidoDTO) {
        PedidoAluguelDTO createdPedido = pedidoService.criarPedido(pedidoDTO);
        return ResponseEntity.ok(createdPedido);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoAluguelDTO> consultarPedido(@PathVariable Long id) {
        PedidoAluguelDTO pedido = pedidoService.consultarPedido(id);
        return ResponseEntity.ok(pedido);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<PedidoAluguelDTO>> consultarPedidosPorCliente(@PathVariable Long clienteId) {
        List<PedidoAluguelDTO> pedidos = pedidoService.consultarPedidosPorCliente(clienteId);
        return ResponseEntity.ok(pedidos);
    }

    @PutMapping("/{id}/modificar")
    public ResponseEntity<PedidoAluguelDTO> modificarPedido(@PathVariable Long id, @RequestBody PedidoAluguelDTO pedidoDTO) {
        PedidoAluguelDTO updatedPedido = pedidoService.modificarPedido(id, pedidoDTO);
        return ResponseEntity.ok(updatedPedido);
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelarPedido(@PathVariable Long id) {
        pedidoService.cancelarPedido(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/avaliar")
    public ResponseEntity<PedidoAluguelDTO> avaliarPedido(
            @PathVariable Long id,
            @RequestParam Long agenteId,
            @RequestParam boolean aprovado,
            @RequestParam(required = false) String observacoes) {
        PedidoAluguelDTO pedido = pedidoService.avaliarPedido(id, agenteId, aprovado, observacoes);
        return ResponseEntity.ok(pedido);
    }

    @PostMapping("/{id}/executar-contrato")
    public ResponseEntity<Object> executarContrato(
            @PathVariable Long id,
            @RequestParam Long agenteId,
            @RequestParam java.math.BigDecimal valorMensal,
            @RequestParam Integer prazoMeses) {
        Object contrato = pedidoService.executarContrato(id, agenteId, valorMensal, prazoMeses);
        return ResponseEntity.ok(contrato);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PedidoAluguelDTO>> listarPedidosPorStatus(@PathVariable String status) {
        List<PedidoAluguelDTO> pedidos = pedidoService.listarPedidosPorStatus(status);
        return ResponseEntity.ok(pedidos);
    }
}
