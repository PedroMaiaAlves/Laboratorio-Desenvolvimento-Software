-- Inserir um agente banco de teste
INSERT INTO agentes (nome, cnpj, endereco, telefone, tipo_agente, ativo, email, password) 
VALUES ('Banco Teste', '12345678000199', 'Rua das Flores, 123', '(11) 99999-9999', 'BANCO', true, 'banco@teste.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi');

-- A senha acima é '123456' criptografada com BCrypt