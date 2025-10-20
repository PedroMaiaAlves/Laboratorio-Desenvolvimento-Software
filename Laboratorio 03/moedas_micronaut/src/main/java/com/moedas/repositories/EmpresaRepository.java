package com.moedas.repositories;

import com.moedas.entities.Empresa;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
}
