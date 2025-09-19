package com.example.Aluguel.service;

import com.example.Aluguel.dto.ClienteDTO;
import com.example.Aluguel.entities.Cliente;
import com.example.Aluguel.entities.Usuario;
import com.example.Aluguel.repository.ClienteRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    public ClienteDTO createCliente(ClienteDTO clienteDTO) {
        if (clienteRepository.existsByCpf(clienteDTO.getCpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }
        if (clienteRepository.existsByEmail(clienteDTO.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }
        Cliente cliente = Cliente.builder()
                .cpf(clienteDTO.getCpf())
                .nome(clienteDTO.getNome())
                .endereco(clienteDTO.getEndereco())
                .email(clienteDTO.getEmail())
                .password(passwordEncoder.encode(clienteDTO.getPassword()))
                .role(Usuario.Role.CLIENTE)
                .ativo(true)
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
        cliente.setEmail(clienteDTO.getEmail());
        if (clienteDTO.getPassword() != null && !clienteDTO.getPassword().isBlank()) {
            cliente.setPassword(passwordEncoder.encode(clienteDTO.getPassword()));
        }

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
                .email(cliente.getEmail())
                .build();
    }
}