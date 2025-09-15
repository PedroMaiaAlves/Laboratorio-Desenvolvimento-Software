package com.example.Aluguel.repository;

import com.example.Aluguel.entities.PedidoAluguel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoAluguelRepository extends JpaRepository<PedidoAluguel, Long> {
    List<PedidoAluguel> findByClienteId(Long clienteId);
    List<PedidoAluguel> findByStatus(PedidoAluguel.StatusPedido status);
}