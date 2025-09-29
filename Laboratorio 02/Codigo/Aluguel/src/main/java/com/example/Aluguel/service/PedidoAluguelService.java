package com.example.Aluguel.service;

import com.example.Aluguel.dto.ContratoAluguelDTO;
import com.example.Aluguel.dto.PedidoAluguelDTO;
import com.example.Aluguel.entities.*;
import com.example.Aluguel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PedidoAluguelService {

    private final PedidoAluguelRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final AutomovelRepository automovelRepository;
    private final AgenteRepository agenteRepository;
    private final ContratoAluguelRepository contratoRepository;

    public PedidoAluguelDTO criarPedido(PedidoAluguelDTO pedidoDTO) {
        // Validar se cliente existe
        Cliente cliente = clienteRepository.findById(pedidoDTO.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        // Validar se automóvel existe
        Automovel automovel = automovelRepository.findById(pedidoDTO.getAutomovelId())
                .orElseThrow(() -> new RuntimeException("Automóvel não encontrado"));

        // Criar pedido
        PedidoAluguel pedido = PedidoAluguel.builder()
                .cliente(cliente)
                .automovel(automovel)
                .status(PedidoAluguel.StatusPedido.PENDENTE)
                .dataCriacao(pedidoDTO.getDataCriacao())
                .possuiContratoCredito(pedidoDTO.getPossuiContratoCredito())
                .bancoContrato(pedidoDTO.getBancoContrato())
                .build();

        PedidoAluguel savedPedido = pedidoRepository.save(pedido);
        return convertToDTO(savedPedido);
    }

    public PedidoAluguelDTO consultarPedido(Long id) {
        PedidoAluguel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        return convertToDTO(pedido);
    }

    public List<PedidoAluguelDTO> consultarPedidosPorCliente(Long clienteId) {
        return pedidoRepository.findByClienteId(clienteId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PedidoAluguelDTO modificarPedido(Long id, PedidoAluguelDTO pedidoDTO) {
        PedidoAluguel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        // Só permite modificação se o pedido não estiver em execução
        if (pedido.getStatus() == PedidoAluguel.StatusPedido.CONTRATADO) {
            throw new RuntimeException("Não é possível modificar um pedido já contratado");
        }

        // Atualizar campos permitidos
        pedido.setDataModificacao(LocalDateTime.now());
        pedido.setStatus(PedidoAluguel.StatusPedido.valueOf(pedidoDTO.getStatus().toUpperCase()));

        PedidoAluguel updatedPedido = pedidoRepository.save(pedido);
        return convertToDTO(updatedPedido);
    }

    public void cancelarPedido(Long id) {
        PedidoAluguel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        // Só permite cancelamento se o pedido não estiver em execução
        if (pedido.getStatus() == PedidoAluguel.StatusPedido.CONTRATADO) {
            throw new RuntimeException("Não é possível cancelar um pedido já contratado");
        }

        pedido.setStatus(PedidoAluguel.StatusPedido.CANCELADO);
        pedido.setDataModificacao(LocalDateTime.now());
        pedidoRepository.save(pedido);
    }

    public PedidoAluguelDTO avaliarPedido(Long id, Long agenteId, boolean aprovado, String observacoes) {
        PedidoAluguel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        Agente agente = agenteRepository.findById(agenteId)
                .orElseThrow(() -> new RuntimeException("Agente não encontrado"));

        // Atualizar status do pedido
        pedido.setStatus(aprovado ? PedidoAluguel.StatusPedido.APROVADO : PedidoAluguel.StatusPedido.REJEITADO);
        pedido.setAgente(agente);
        pedidoRepository.save(pedido);

        return convertToDTO(pedido);
    }

    public ContratoAluguelDTO executarContrato(Long pedidoId, Long agenteId, 
                                             java.math.BigDecimal valorMensal, 
                                             Integer prazoMeses) {
        PedidoAluguel pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        if (pedido.getStatus() != PedidoAluguel.StatusPedido.APROVADO) {
            throw new RuntimeException("Apenas pedidos aprovados podem ser contratados");
        }

        Agente agente = agenteRepository.findById(agenteId)
                .orElseThrow(() -> new RuntimeException("Agente não encontrado"));

        // Criar contrato
        ContratoAluguel contrato = ContratoAluguel.builder()
                .pedido(pedido)
                .agente(agente)
                .numeroContrato(gerarNumeroContrato())
                .valorMensal(valorMensal)
                .prazoMeses(prazoMeses)
                .dataInicio(java.time.LocalDateTime.now())
                .dataFim(java.time.LocalDateTime.now().plusMonths(prazoMeses))
                .status(ContratoAluguel.StatusContrato.ATIVO)
                .build();

        ContratoAluguel savedContrato = contratoRepository.save(contrato);

        // Atualizar status do pedido
        pedido.setStatus(PedidoAluguel.StatusPedido.CONTRATADO);
        pedidoRepository.save(pedido);

        return convertContratoToDTO(savedContrato);
    }

    public List<PedidoAluguelDTO> listarPedidosPorStatus(String status) {
        PedidoAluguel.StatusPedido statusEnum = PedidoAluguel.StatusPedido.valueOf(status.toUpperCase());
        return pedidoRepository.findByStatus(statusEnum).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private PedidoAluguelDTO convertToDTO(PedidoAluguel pedido) {
        return PedidoAluguelDTO.builder()
                .id(pedido.getId())
                .clienteId(pedido.getCliente().getId())
                .automovelId(pedido.getAutomovel().getId())
                .status(pedido.getStatus().name())
                .dataCriacao(pedido.getDataCriacao())
                .dataModificacao(pedido.getDataModificacao())
                .possuiContratoCredito(pedido.getPossuiContratoCredito())
                .bancoContrato(pedido.getBancoContrato())
                .build();
    }

    private ContratoAluguelDTO convertContratoToDTO(ContratoAluguel contrato) {
        return ContratoAluguelDTO.builder()
                .id(contrato.getId())
                .pedidoId(contrato.getPedido().getId())
                .agenteId(contrato.getAgente().getId())
                .numeroContrato(contrato.getNumeroContrato())
                .valorMensal(contrato.getValorMensal())
                .prazoMeses(contrato.getPrazoMeses())
                .dataInicio(contrato.getDataInicio())
                .dataFim(contrato.getDataFim())
                .status(contrato.getStatus().name())
                .dataCriacao(contrato.getDataCriacao())
                .dataModificacao(contrato.getDataModificacao())
                .observacoes(contrato.getObservacoes())
                .build();
    }

    private String gerarNumeroContrato() {
        return "CTR" + System.currentTimeMillis();
    }
}
