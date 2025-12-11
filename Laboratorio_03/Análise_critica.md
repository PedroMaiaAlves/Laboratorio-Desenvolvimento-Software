# Análise Crítica do Projeto – Grupo João Almeida, Aulus Batista e Lucas Ferreira

Este relatório apresenta uma análise crítica do projeto desenvolvido pelo grupo composto por **João Almeida**, **Aulus Batista** e **Lucas Ferreira**, considerando arquitetura, tecnologias, organização, facilidade de configuração e possíveis melhorias.

---

## 1. Arquitetura e Tecnologias Utilizadas

O projeto utiliza:

* **Front-end:** React (JavaScript)
* **Back-end:** Java com Spring Boot
* **Banco de Dados:** MySQL
* **Arquitetura:** MVC Estendida

No back-end, a arquitetura MVC estendida é organizada da seguinte forma:

<img width="342" height="526" alt="Captura de tela 2025-12-11 164554" src="https://github.com/user-attachments/assets/3bf12efc-58e1-4c74-af3e-dc7ba7ad1614" />

* **config:** gerenciamento de configurações gerais;
* **controller:** recebimento das requisições HTTP e direcionamento das ações;
* **dto:** objetos para transporte de dados de forma estruturada;
* **model:** entidades e mapeamentos para o banco de dados;
* **repository:** camadas responsáveis pela comunicação com o banco;
* **service:** encapsula a lógica de negócio, evitando que a controller seja sobrecarregada.

Essa estrutura é apropriada para aplicações Java/Spring, favorecendo separação de responsabilidades e organização do código.

No front-end, a estrutura é dividida em:

<img width="335" height="583" alt="Captura de tela 2025-12-11 164609" src="https://github.com/user-attachments/assets/a8a16b7a-8998-47c3-9513-d5fe45116ce8" />

* **config:** configurações gerais da aplicação;
* **hooks:** lógicas reutilizáveis baseadas no React;
* **lib:** utilidades e bibliotecas auxiliares;
* **pages:** páginas principais da aplicação;
* **services:** chamadas de API e integração com o backend;
* **utils:** funções auxiliares;
* **components:** componentes reutilizáveis;
* **assets:** imagens, ícones e arquivos estáticos.

O uso de React fornece flexibilidade, reutilização de componentes e dinamismo na interface, contribuindo para um desenvolvimento de front-end moderno e visualmente atraente.

---

## 2. Organização do GitHub

A organização do repositório apresenta problemas.
Existem pastas redundantes como **backend** e **código**, cuja coexistência não tem um propósito claro.
Além disso, diversos arquivos desnecessários foram enviados à branch principal, incluindo:

* `.env`
* `.env.example`
* arquivos gerados automaticamente por ferramentas de IA.

O README também poderia estar melhor estruturado, contendo um índice que facilitasse a navegação e fornecendo uma visão geral mais clara do projeto.

<img width="341" height="558" alt="Captura de tela 2025-12-11 164848" src="https://github.com/user-attachments/assets/fc9ab892-d0d5-42fc-8d79-d8a633d7c788" />
<img width="365" height="236" alt="Captura de tela 2025-12-11 164911" src="https://github.com/user-attachments/assets/c4f42fc7-47dc-4807-9fc4-a601de57c452" />


---

## 3. Dificuldade para Configuração do Ambiente

As instruções de execução estão presentes, porém alguns pontos dificultam a configuração completa:

* Existem arquivos `.example` cuja origem não é clara, sugerindo inconsistência na organização.
* Não há indicação explícita de que a aplicação está hospedada.
* O repositório não apresenta links diretos ou documentados para acessar o sistema em produção.

Esses fatores tornam o processo de preparação e execução do projeto mais confuso do que deveria ser.

---

## 4. Sugestões de Melhorias

### Melhorias no Back-end

<img width="840" height="635" alt="Captura de tela 2025-12-11 165221" src="https://github.com/user-attachments/assets/47632725-6891-4190-b103-f4395a617c06" />
<img width="953" height="632" alt="Captura de tela 2025-12-11 165359" src="https://github.com/user-attachments/assets/2c8db012-37c0-4301-b20e-b4f332d8b899" />
<img width="753" height="435" alt="Captura de tela 2025-12-11 165608" src="https://github.com/user-attachments/assets/2395abf7-f841-455b-8ea3-2ed7caa3eb98" />

* Adotar de forma mais consistente as convenções REST, evitando endpoints como `/register`, que fogem do padrão esperado.
* Remover lógicas de negócio das **controllers**, encaminhando tudo para as **services**, conforme recomendado na arquitetura MVC.
* Organizar melhor o retorno de dados complexos utilizando classes específicas, evitando manipulações diretas dentro da controller.
* Utilizar **Lombok** nas entidades da camada model para reduzir código repetitivo.
* Ajustar a geração de códigos nas vantagens, evitando strings estáticas e valores fixos, que podem gerar conflitos.

### Melhorias no Front-end

* Reduzir o número de componentes duplicados ou pouco reutilizados.
* Revisar os hooks e services, pois há funções extensas e pouco claras, prejudicando manutenção e entendimento.
* Melhorar a organização das responsabilidades dentro do front, tornando mais evidente a separação entre lógica, visual e serviços.

### Melhorias no GitHub

* Reestruturar as pastas para refletir a real divisão entre front-end e back-end.
* Remover arquivos indevidos, sensíveis ou gerados automaticamente.
* Aprimorar o README com:

  * índice,
  * explicações diretas,
  * links importantes,
  * documentação de execução.

### Melhorias no Deploy

* Informar claramente se a aplicação está hospedada.
* Disponibilizar links oficiais no README.
* A documentação deve deixar o acesso ao ambiente de produção evidente.

---

## Conclusão

O projeto apresenta uma boa escolha de tecnologias, com React no front-end e Spring Boot no back-end, além de uma arquitetura adequada que segue conceitos de separação de responsabilidades. Entretanto, há oportunidades significativas de melhoria na organização do repositório, na clareza da documentação, na padronização do código e no uso adequado das camadas da aplicação.
