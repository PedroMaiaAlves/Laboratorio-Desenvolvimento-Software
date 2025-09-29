-- Dados de teste para a tabela rendimentos
-- Insere alguns rendimentos para os clientes existentes

-- Verifica se a tabela rendimentos existe antes de inserir
-- INSERT INTO rendimentos (entidade_empregadora, valor, cliente_id) VALUES
-- ('Empresa ABC Ltda', 3500.00, 1),
-- ('Empresa XYZ S.A.', 2800.00, 1),
-- ('Autônomo - Consultoria', 1500.00, 2),
-- ('Empresa DEF Corp', 4200.00, 3);

-- Como não sabemos os IDs exatos dos clientes, vamos inserir alguns rendimentos
-- assumindo que os clientes com IDs 1, 2, 3 existem

INSERT IGNORE INTO rendimentos (entidade_empregadora, valor, cliente_id) VALUES
('Tech Solutions Ltda', 4500.00, 1),
('Consultoria Financeira ABC', 3200.00, 1),
('Freelancer - Desenvolvimento', 1800.00, 2),
('Empresa Comercial XYZ', 3800.00, 3),
('Autônomo - Vendas', 2200.00, 4);
