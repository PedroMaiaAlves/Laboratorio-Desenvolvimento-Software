# Sistema de Aluguel de Veículos - Frontend

Este é o frontend do sistema de aluguel de veículos desenvolvido em HTML, JavaScript e Bootstrap.

## 📋 Funcionalidades

### 🔐 Autenticação
- **Login**: Sistema de autenticação com email e senha
- **Cadastro**: Cadastro de novos clientes
- **Alteração de senha**: Funcionalidade para alterar senha do usuário

### 👤 Clientes
- **Meus Pedidos**: Visualizar todos os pedidos do cliente
- **Novo Pedido**: Criar novos pedidos de aluguel
- **Modificar Pedido**: Editar pedidos pendentes
- **Cancelar Pedido**: Cancelar pedidos pendentes
- **Perfil**: Visualizar e editar dados pessoais

### 🏢 Agentes (Bancos e Empresas)
- **Avaliar Pedidos**: Aprovar ou rejeitar pedidos de aluguel
- **Executar Contratos**: Executar contratos de aluguel aprovados
- **Visualizar Pedidos**: Listar todos os pedidos para avaliação

### ⚙️ Administradores
- **Dashboard**: Painel com estatísticas do sistema
- **Gerenciar Clientes**: CRUD completo de clientes
- **Gerenciar Veículos**: CRUD completo de automóveis
- **Gerenciar Agentes**: CRUD completo de agentes
- **Visualizar Pedidos**: Listar todos os pedidos do sistema

## 🚀 Como Executar

### Pré-requisitos
- Servidor Spring Boot rodando na porta 8080
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

### Instalação
1. Clone ou baixe os arquivos do frontend
2. Abra o arquivo `index.html` em um navegador web
3. Ou use um servidor web local (recomendado):
   ```bash
   # Usando Python
   python -m http.server 8000
   
   # Usando Node.js
   npx http-server -p 8000
   
   # Usando PHP
   php -S localhost:8000
   ```

### Acesso
- **URL Principal**: `http://localhost:8000/index.html`
- **Administração**: `http://localhost:8000/admin.html`

## 📁 Estrutura de Arquivos

```
FrontEnd/
├── index.html              # Página principal
├── admin.html              # Página de administração
├── css/
│   └── style.css          # Estilos customizados
├── scripts/
│   ├── api.js             # Serviços de API
│   ├── auth.js            # Autenticação
│   ├── pedidos.js         # Gerenciamento de pedidos
│   ├── admin.js           # Funcionalidades administrativas
│   ├── app.js             # Aplicação principal
│   └── admin-page.js      # Script da página de admin
└── README.md              # Este arquivo
```

## 🔧 Configuração

### URL da API
Por padrão, o sistema está configurado para se conectar com a API em `http://localhost:8080`. Para alterar, edite o arquivo `scripts/api.js`:

```javascript
constructor() {
    this.baseUrl = 'http://localhost:8080'; // Altere aqui
    // ...
}
```

### Endpoints da API
O sistema espera os seguintes endpoints no backend:

#### Autenticação
- `POST /auth/login` - Login
- `PUT /auth/alterar-senha` - Alterar senha
- `GET /auth/usuarios` - Listar usuários

#### Clientes
- `POST /cliente/cadastrar` - Cadastrar cliente
- `GET /cliente/listar` - Listar clientes
- `GET /cliente/{id}` - Obter cliente
- `PUT /cliente/atualizar/{id}` - Atualizar cliente
- `DELETE /cliente/{id}` - Deletar cliente

#### Pedidos
- `POST /pedidos/criar` - Criar pedido
- `GET /pedidos/{id}` - Consultar pedido
- `GET /pedidos/cliente/{clienteId}` - Pedidos por cliente
- `PUT /pedidos/{id}/modificar` - Modificar pedido
- `PUT /pedidos/{id}/cancelar` - Cancelar pedido
- `PUT /pedidos/{id}/avaliar` - Avaliar pedido
- `POST /pedidos/{id}/executar-contrato` - Executar contrato
- `GET /pedidos/status/{status}` - Pedidos por status

#### Automóveis
- `POST /automoveis/cadastrar` - Cadastrar automóvel
- `GET /automoveis/listar` - Listar automóveis
- `GET /automoveis/{id}` - Obter automóvel
- `PUT /automoveis/{id}/atualizar` - Atualizar automóvel
- `DELETE /automoveis/{id}` - Deletar automóvel

#### Agentes
- `POST /agentes/cadastrar` - Cadastrar agente
- `GET /agentes/listar` - Listar agentes
- `GET /agentes/ativos` - Listar agentes ativos
- `GET /agentes/tipo/{tipo}` - Listar agentes por tipo
- `GET /agentes/{id}` - Obter agente

#### Administradores
- `POST /admins/cadastrar` - Cadastrar admin
- `GET /admins/listar` - Listar admins
- `GET /admins/{id}` - Obter admin
- `PUT /admins/{id}` - Atualizar admin
- `DELETE /admins/{id}` - Deletar admin

## 🎨 Personalização

### Cores e Tema
As cores principais podem ser alteradas no arquivo `css/style.css`:

```css
:root {
    --primary-color: #0d6efd;    /* Azul principal */
    --secondary-color: #6c757d;  /* Cinza secundário */
    --success-color: #198754;     /* Verde sucesso */
    --danger-color: #dc3545;     /* Vermelho perigo */
    --warning-color: #ffc107;    /* Amarelo aviso */
    --info-color: #0dcaf0;       /* Azul informação */
}
```

### Logo e Branding
Para alterar o logo e nome da aplicação, edite o arquivo `index.html`:

```html
<a class="navbar-brand" href="#">
    <i class="fas fa-car"></i> Sistema de Aluguel
</a>
```

## 🔒 Segurança

### Autenticação
- O sistema usa tokens JWT para autenticação
- Tokens são armazenados no localStorage
- Verificação de permissões baseada em roles (CLIENTE, AGENTE, ADMIN)

### Validações
- Validação de CPF
- Validação de email
- Validação de senha (mínimo 6 caracteres)
- Validação de campos obrigatórios

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 💻 Desktop
- 📱 Tablet
- 📱 Smartphone

## 🐛 Solução de Problemas

### Erro de CORS
Se encontrar erros de CORS, configure o backend Spring Boot para aceitar requisições do frontend:

```java
@CrossOrigin(origins = "http://localhost:8000")
```

### Erro de Conexão
Verifique se:
1. O backend Spring Boot está rodando na porta 8080
2. A URL da API está correta no arquivo `scripts/api.js`
3. Não há firewall bloqueando as requisições

### Problemas de Autenticação
- Verifique se o token está sendo enviado corretamente
- Confirme se o backend está retornando tokens válidos
- Limpe o localStorage se necessário

## 📞 Suporte

Para suporte ou dúvidas sobre o sistema, consulte a documentação do backend ou entre em contato com a equipe de desenvolvimento.

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte do Laboratório de Desenvolvimento de Software.
