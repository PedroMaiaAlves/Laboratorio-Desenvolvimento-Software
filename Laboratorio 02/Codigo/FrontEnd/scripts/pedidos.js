// Módulo de gerenciamento de pedidos
class PedidosService {
    constructor() {
        this.pedidos = [];
        this.automoveis = [];
        this.agentes = [];
    }

    async carregarPedidos() {
        try {
            if (authService.hasRole('CLIENTE')) {
                // Para clientes, carregar apenas seus pedidos
                const user = authService.getCurrentUser();
                if (!user) {
                    authService.showMessage('Usuário não autenticado. Faça login novamente.', 'danger');
                    return;
                }

                // Obter o ID do cliente da tabela usuarios
                const clienteData = await apiService.obterUsuarioLogado(user.email);
                if (!clienteData || !clienteData.id) {
                    authService.showMessage('Erro ao obter dados do cliente. Tente novamente.', 'danger');
                    return;
                }

                // Carregar pedidos específicos do cliente
                this.pedidos = await apiService.consultarPedidosPorCliente(clienteData.id);
            } else if (authService.hasRole('AGENTE') || authService.hasRole('ADMIN')) {
                // Para agentes e admins, carregar pedidos pendentes para avaliação
                this.pedidos = await apiService.listarPedidosPorStatus('PENDENTE');
            }
            
            this.renderPedidos();
        } catch (error) {
            authService.showMessage('Erro ao carregar pedidos: ' + error.message, 'danger');
        }
    }

    async carregarAutomoveis() {
        try {
            this.automoveis = await apiService.listarAutomoveis();
            this.renderAutomoveisSelect();
        } catch (error) {
            authService.showMessage('Erro ao carregar veículos: ' + error.message, 'danger');
        }
    }

    async carregarAgentes() {
        try {
            console.log('Carregando agentes...');
            this.agentes = await apiService.listarAgentesAtivos();
            console.log('Agentes carregados:', this.agentes);
            console.log('Tipo de dados:', typeof this.agentes, 'Array?', Array.isArray(this.agentes));
            
            // Teste adicional: verificar se há dados
            if (!this.agentes || this.agentes.length === 0) {
                console.warn('Nenhum agente retornado do backend');
                // Tentar carregar todos os agentes para debug
                console.log('Tentando carregar todos os agentes...');
                const todosAgentes = await apiService.listarAgentes();
                console.log('Todos os agentes:', todosAgentes);
            }
            
            this.renderAgentesSelect();
        } catch (error) {
            console.error('Erro ao carregar agentes:', error);
            console.error('Detalhes do erro:', error);
            authService.showMessage('Erro ao carregar agentes: ' + error.message, 'danger');
        }
    }

    renderPedidos() {
        const container = document.getElementById('pedidos-list');
        const avaliacaoContainer = document.getElementById('pedidos-avaliacao');
        
        if (!container && !avaliacaoContainer) return;

        const targetContainer = authService.hasRole('CLIENTE') ? container : avaliacaoContainer;
        
        if (this.pedidos.length === 0) {
            targetContainer.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    Nenhum pedido encontrado.
                </div>
            `;
            return;
        }

        const pedidosHTML = this.pedidos.map(pedido => this.createPedidoCard(pedido)).join('');
        targetContainer.innerHTML = pedidosHTML;
    }

    createPedidoCard(pedido) {
        const statusClass = this.getStatusClass(pedido.status);
        const statusText = this.getStatusText(pedido.status);
        const dataCriacao = new Date(pedido.dataCriacao).toLocaleDateString('pt-BR');
        
        let actionsHTML = '';
        
        if (authService.hasRole('CLIENTE')) {
            // Ações para clientes
            if (pedido.status === 'PENDENTE') {
                actionsHTML = `
                    <button class="btn btn-warning btn-sm" onclick="pedidosService.modificarPedido(${pedido.id})">
                        <i class="fas fa-edit"></i> Modificar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="pedidosService.cancelarPedido(${pedido.id})">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                `;
            }
        } else if (authService.hasRole('AGENTE') || authService.hasRole('ADMIN')) {
            // Ações para agentes
            if (pedido.status === 'PENDENTE') {
                actionsHTML = `
                    <button class="btn btn-success btn-sm" onclick="pedidosService.avaliarPedido(${pedido.id}, true)">
                        <i class="fas fa-check"></i> Aprovar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="pedidosService.avaliarPedido(${pedido.id}, false)">
                        <i class="fas fa-times"></i> Rejeitar
                    </button>
                `;
            } else if (pedido.status === 'APROVADO') {
                actionsHTML = `
                    <button class="btn btn-primary btn-sm" onclick="pedidosService.executarContrato(${pedido.id})">
                        <i class="fas fa-file-contract"></i> Executar Contrato
                    </button>
                `;
            }
        }

        return `
            <div class="card pedido-card ${statusClass.toLowerCase()}">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <h5 class="card-title">
                                Pedido #${pedido.id}
                                <span class="status-badge status-${statusClass.toLowerCase()}">${statusText}</span>
                            </h5>
                            <p class="card-text">
                                <strong>Cliente ID:</strong> ${pedido.clienteId}<br>
                                <strong>Veículo ID:</strong> ${pedido.automovelId}<br>
                                <strong>Data de Criação:</strong> ${dataCriacao}<br>
                                ${pedido.possuiContratoCredito ? `<strong>Contrato de Crédito:</strong> Sim<br>` : ''}
                                ${pedido.bancoContrato ? `<strong>Banco:</strong> ${pedido.bancoContrato}<br>` : ''}
                            </p>
                        </div>
                        <div class="col-md-4 text-end">
                            <div class="btn-group-vertical" role="group">
                                ${actionsHTML}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getStatusClass(status) {
        const statusMap = {
            'PENDENTE': 'pendente',
            'APROVADO': 'aprovado',
            'REJEITADO': 'rejeitado',
            'CONTRATADO': 'contratado',
            'CANCELADO': 'cancelado'
        };
        return statusMap[status] || 'pendente';
    }

    getStatusText(status) {
        const statusMap = {
            'PENDENTE': 'Pendente',
            'APROVADO': 'Aprovado',
            'REJEITADO': 'Rejeitado',
            'CONTRATADO': 'Contratado',
            'CANCELADO': 'Cancelado'
        };
        return statusMap[status] || 'Pendente';
    }

    renderAutomoveisSelect() {
        const select = document.getElementById('pedido-automovel');
        if (!select) return;

        select.innerHTML = '<option value="">Selecione um veículo</option>';
        this.automoveis.forEach(automovel => {
            const option = document.createElement('option');
            option.value = automovel.id;
            option.textContent = `${automovel.marca} ${automovel.modelo} - ${automovel.ano} (${automovel.placa})`;
            select.appendChild(option);
        });
    }

    renderAgentesSelect() {
        const select = document.getElementById('pedido-banco');
        if (!select) {
            console.warn('Elemento pedido-banco não encontrado');
            return;
        }

        select.innerHTML = '<option value="">Selecione um banco</option>';
        
        console.log('Renderizando agentes:', this.agentes);
        
        let bancosEncontrados = 0;
        this.agentes.forEach(agente => {
            console.log('Verificando agente:', agente.nome, 'tipo:', agente.tipoAgente);
            if (agente.tipoAgente === 'BANCO') {
                const option = document.createElement('option');
                option.value = agente.id;
                option.textContent = agente.nome;
                select.appendChild(option);
                bancosEncontrados++;
                console.log('Banco adicionado:', agente.nome);
            }
        });
        
        console.log(`Total de bancos encontrados: ${bancosEncontrados}`);
        
        if (bancosEncontrados === 0) {
            console.warn('Nenhum banco encontrado nos agentes');
        }
    }

    async criarPedido() {
        const automovelId = document.getElementById('pedido-automovel').value;
        const possuiContratoCredito = document.getElementById('pedido-contrato-credito').checked;
        const bancoContrato = document.getElementById('pedido-banco').value;

        if (!automovelId) {
            authService.showMessage('Por favor, selecione um veículo.', 'warning');
            return;
        }

        if (possuiContratoCredito && !bancoContrato) {
            authService.showMessage('Por favor, selecione um banco para o contrato de crédito.', 'warning');
            return;
        }

        try {
            // Obter o ID do cliente da tabela usuarios
            const user = authService.getCurrentUser();
            if (!user) {
                authService.showMessage('Usuário não autenticado. Faça login novamente.', 'danger');
                return;
            }

            const clienteData = await apiService.obterUsuarioLogado(user.email);
            if (!clienteData || !clienteData.id) {
                authService.showMessage('Erro ao obter dados do cliente. Tente novamente.', 'danger');
                return;
            }

            const pedidoData = {
                clienteId: clienteData.id, // Usar o ID correto da tabela usuarios
                automovelId: parseInt(automovelId),
                possuiContratoCredito: possuiContratoCredito,
                bancoContrato: bancoContrato || null,
                dataCriacao: new Date().toISOString()
            };

            await apiService.criarPedido(pedidoData);
            authService.showMessage('Pedido criado com sucesso!', 'success');
            
            // Fechar modal e recarregar lista
            const modal = bootstrap.Modal.getInstance(document.getElementById('novoPedidoModal'));
            modal.hide();
            
            // Limpar formulário
            document.getElementById('novo-pedido-form').reset();
            document.getElementById('banco-field').style.display = 'none';
            
            await this.carregarPedidos();
        } catch (error) {
            authService.showMessage('Erro ao criar pedido: ' + error.message, 'danger');
        }
    }

    async modificarPedido(id) {
        // Implementar modal de modificação
        authService.showMessage('Funcionalidade de modificação será implementada em breve.', 'info');
    }

    async cancelarPedido(id) {
        if (!confirm('Tem certeza que deseja cancelar este pedido?')) {
            return;
        }

        try {
            await apiService.cancelarPedido(id);
            authService.showMessage('Pedido cancelado com sucesso!', 'success');
            await this.carregarPedidos();
        } catch (error) {
            authService.showMessage('Erro ao cancelar pedido: ' + error.message, 'danger');
        }
    }

    async avaliarPedido(id, aprovado) {
        const agenteId = 1; // Em uma implementação real, isso viria do token
        const observacoes = prompt('Observações (opcional):') || '';

        try {
            await apiService.avaliarPedido(id, agenteId, aprovado, observacoes);
            const status = aprovado ? 'aprovado' : 'rejeitado';
            authService.showMessage(`Pedido ${status} com sucesso!`, 'success');
            await this.carregarPedidos();
        } catch (error) {
            authService.showMessage('Erro ao avaliar pedido: ' + error.message, 'danger');
        }
    }

    async executarContrato(id) {
        const valorMensal = prompt('Valor mensal do contrato:');
        const prazoMeses = prompt('Prazo em meses:');

        if (!valorMensal || !prazoMeses) {
            authService.showMessage('Por favor, preencha todos os campos.', 'warning');
            return;
        }

        try {
            const agenteId = 1; // Em uma implementação real, isso viria do token
            await apiService.executarContrato(id, agenteId, parseFloat(valorMensal), parseInt(prazoMeses));
            authService.showMessage('Contrato executado com sucesso!', 'success');
            await this.carregarPedidos();
        } catch (error) {
            authService.showMessage('Erro ao executar contrato: ' + error.message, 'danger');
        }
    }
}

// Instância global do serviço de pedidos
window.pedidosService = new PedidosService();

// Funções globais para uso nos formulários
function showNovoPedidoModal() {
    if (!authService.isAuthenticated()) {
        authService.showMessage('Por favor, faça login para criar um pedido.', 'warning');
        return;
    }

    const modal = new bootstrap.Modal(document.getElementById('novoPedidoModal'));
    modal.show();
    
    // Carregar dados necessários
    pedidosService.carregarAutomoveis();
    pedidosService.carregarAgentes();
}

function criarPedido() {
    pedidosService.criarPedido();
}

// Mostrar/ocultar campo de banco baseado no checkbox
document.addEventListener('DOMContentLoaded', function() {
    const contratoCreditoCheckbox = document.getElementById('pedido-contrato-credito');
    const bancoField = document.getElementById('banco-field');
    
    if (contratoCreditoCheckbox && bancoField) {
        contratoCreditoCheckbox.addEventListener('change', function() {
            bancoField.style.display = this.checked ? 'block' : 'none';
        });
    }
});
