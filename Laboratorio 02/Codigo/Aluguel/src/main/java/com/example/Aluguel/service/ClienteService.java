package com.example.Aluguel.service;

import com.example.Aluguel.dto.ClienteDTO;
import com.example.Aluguel.entities.Cliente;
import com.example.Aluguel.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteDTO createCliente(ClienteDTO clienteDTO) {
        Cliente cliente = Cliente.builder()
                .cpf(clienteDTO.getCpf())
                .nome(clienteDTO.getNome())
                .endereco(clienteDTO.getEndereco())
                .build();

        Cliente savedCliente = clienteRepository.save(cliente);
        return convertToDTO(savedCliente);
    }

    public List<ClienteDTO> getAllClientes() {
        return clienteRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ClienteDTO getClienteById(Long id) {
        return clienteRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
    }

    public ClienteDTO updateCliente(Long id, ClienteDTO clienteDTO) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        cliente.setCpf(clienteDTO.getCpf());
        cliente.setNome(clienteDTO.getNome());
        cliente.setEndereco(clienteDTO.getEndereco());

        Cliente updatedCliente = clienteRepository.save(cliente);
        return convertToDTO(updatedCliente);
    }

    public void deleteCliente(Long id) {
        clienteRepository.deleteById(id);
    }

    private ClienteDTO convertToDTO(Cliente cliente) {
        return ClienteDTO.builder()
                .id(cliente.getId())
                .cpf(cliente.getCpf())
                .nome(cliente.getNome())
                .endereco(cliente.getEndereco())
                .build();
    }
}