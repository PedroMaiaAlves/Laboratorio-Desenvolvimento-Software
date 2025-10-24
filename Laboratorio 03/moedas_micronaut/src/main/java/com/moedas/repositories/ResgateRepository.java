package com.moedas.repositories;

import com.moedas.entities.Resgate;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResgateRepository extends JpaRepository<Resgate, Long> {
    List<Resgate> findByAlunoIdOrderByDataHoraDesc(Long alunoId);
    Optional<Resgate> findByCodigoCupom(String codigoCupom);
}