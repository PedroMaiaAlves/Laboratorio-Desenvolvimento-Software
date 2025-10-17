package com.moedas.repositories;

import com.moedas.entities.Professor;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {
}
