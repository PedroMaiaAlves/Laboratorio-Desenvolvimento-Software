package com.example.Aluguel.controller;

import com.example.Aluguel.dto.LoginDTO;
import com.example.Aluguel.dto.TokenDTO;
import com.example.Aluguel.dto.AlterarSenhaDTO;
import com.example.Aluguel.entities.Admin;
import com.example.Aluguel.entities.Agente;
import com.example.Aluguel.entities.Cliente;
import com.example.Aluguel.entities.Usuario;
import com.example.Aluguel.repository.UsuarioRepository;
import com.example.Aluguel.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;
    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<TokenDTO> login(@RequestBody LoginDTO loginDTO) {
        authenticateUser(loginDTO.getEmail(), loginDTO.getPassword());

        Object usuario = findUserByEmail(loginDTO.getEmail());
        String role = determineUserRole(usuario);

        TokenDTO token = generateToken(loginDTO.getEmail(), role);

        return ResponseEntity.ok(token);
    }

    private void authenticateUser(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
    }

    private Usuario findUserByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    private String determineUserRole(Object usuario) {
        if (usuario instanceof Cliente) {
            return "CLIENTE";
        } else if (usuario instanceof Admin) {
            return "ADMIN";
        } else if (usuario instanceof Agente) {
            return "AGENTE";
        } else {
            throw new RuntimeException("Tipo de usuário não suportado");
        }
    }

    private TokenDTO generateToken(String email, String role) {
        return TokenDTO.builder()
                .token("mock-jwt-token-" + System.currentTimeMillis())
                .type("Bearer")
                .username(email)
                .role(role)
                .build();
    }

    @PutMapping("/alterar-senha")
    public ResponseEntity<Void> alterarSenha(@RequestBody AlterarSenhaDTO dto) {
        usuarioService.alterarSenha(dto.getEmail(), dto.getPassword());
        return ResponseEntity.noContent().build();
    }

    // Cadastro e CRUD foram movidos para controllers específicas.

    @GetMapping("/usuarios")
    public ResponseEntity<List<?>> listarUsuarios() {
        List<?> usuarios = usuarioService.listarUsuarios();
        return ResponseEntity.ok(usuarios);
    }
}
