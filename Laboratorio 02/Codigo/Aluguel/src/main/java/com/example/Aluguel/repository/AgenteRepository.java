package com.example.Aluguel.repository;

import com.example.Aluguel.entities.Agente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgenteRepository extends JpaRepository<Agente, Long> {
    Optional<Agente> findByCnpj(String cnpj);
    boolean existsByCnpj(String cnpj);
    List<Agente> findByTipoAgente(Agente.TipoAgente tipoAgente);
    List<Agente> findByAtivoTrue();
}

