package com.example.Aluguel.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.Aluguel.dto.ClienteDTO;
import com.example.Aluguel.service.ClienteService;

@Controller
@RequestMapping("/cliente")
public class ClienteViewController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping("/todos")
    public String listarTodos(Model model) {
        List<ClienteDTO> clientes = clienteService.getAllClientes();
        model.addAttribute("clientes", clientes);
        return "clientes";
    }

    @GetMapping("/novo")
    public String novoCliente(Model model) {
        model.addAttribute("cliente", new ClienteDTO());
        return "formCliente";
    }

    @PostMapping("/salvar")
    public String salvarCliente(@ModelAttribute("cliente") ClienteDTO clienteDTO) {
        if (clienteDTO.getId() == null) {
            clienteService.createCliente(clienteDTO);
        } else {
            clienteService.updateCliente(clienteDTO.getId(), clienteDTO);
        }
        return "redirect:/cliente/todos";
    }

    @GetMapping("/editar/{id}")
    public String editarCliente(@PathVariable("id") Long id, Model model) {
        ClienteDTO clienteDTO = clienteService.getClienteById(id);
        model.addAttribute("cliente", clienteDTO);
        return "formCliente";
    }

    @GetMapping("/deletar/{id}")
    public String deletarCliente(@PathVariable("id") Long id) {
        clienteService.deleteCliente(id);
        return "redirect:/cliente/todos";
    }
}
