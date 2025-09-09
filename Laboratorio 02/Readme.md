# Laboratorio-Desenvolvimento-Software

## 📋 História de Usuário: Introduzir Pedido de Aluguel - HS01

**👤 Como Cliente,**
Eu quero introduzir um pedido de aluguel no sistema,
Para que eu possa solicitar um contrato de aluguel associado a crédito, acompanhar e gerenciar meus pedidos.

**🎯 Critérios de Aceitação**
✔ O sistema deve permitir o cadastro de um novo pedido de aluguel.
✔ O cliente pode associar um contrato de crédito ao pedido.
✔ Deve ser possível consultar o status do pedido.
✔ Deve ser possível modificar ou cancelar o pedido após a criação, desde que ainda não esteja em execução.
✔ O pedido deve ser avaliado automaticamente ou por agentes (empresas/bancos) antes da execução.
✔ O cliente deve estar autenticado (login realizado).

**🔍 Detalhamento Técnico**

Pré-condição: Cliente deve estar logado no sistema.

Fonte de dados: Base de pedidos e contratos do sistema.

Pós-condição: Pedido registrado e associado a um contrato de aluguel.

Regra de negócio: Apenas pedidos aprovados por agentes ou pelo sistema podem ser executados.

## 📋 História de Usuário: Consultar Pedido - HS02

**👤 Como Cliente,**
Eu quero consultar os pedidos de aluguel que realizei,
Para que eu possa acompanhar o status, verificar detalhes e decidir se preciso modificar ou cancelar.

**🎯 Critérios de Aceitação**
✔ O sistema deve exibir uma lista de pedidos do cliente logado.
✔ Cada pedido deve mostrar: número do pedido, data, status (em análise, aprovado, em execução, cancelado), valor e agente associado.
✔ O cliente deve poder filtrar os pedidos por status ou período.
✔ Deve existir uma opção para visualizar os detalhes completos do pedido.
✔ Apenas o cliente autenticado pode visualizar seus próprios pedidos.

**🔍 Detalhamento Técnico**

Pré-condição: Cliente deve estar autenticado no sistema.

Fonte de dados: Base de pedidos do sistema.

Pós-condição: Dados exibidos em tela de forma paginável/ordenável.

Regra de negócio: O cliente só tem acesso aos pedidos que ele próprio cadastrou.
