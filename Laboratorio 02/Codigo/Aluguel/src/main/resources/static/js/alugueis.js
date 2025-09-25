const token = localStorage.getItem('token');

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

function listarVeiculosDisponiveis() {
    fetch('/automoveis/listar', {
        headers: getHeaders()
    })
    .then(response => response.json())
    .then(veiculos => {
        const veiculosDisponiveis = veiculos.filter(v => v.status === 'DISPONIVEL');
        const container = document.getElementById('veiculosDisponiveis');
        container.innerHTML = '';
        
        veiculosDisponiveis.forEach(veiculo => {
            const card = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${veiculo.marca} ${veiculo.modelo}</h5>
                            <p class="card-text">
                                Ano: ${veiculo.ano}<br>
                                Placa: ${veiculo.placa}
                            </p>
                            <button onclick="alugarVeiculo(${veiculo.id})" class="btn btn-primary">Alugar</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
    })
    .catch(error => console.error('Erro ao listar veículos:', error));
}

function alugarVeiculo(veiculoId) {
    const pedido = {
        automovelId: veiculoId,
        clienteId: localStorage.getItem('userId'),
        dataInicio: document.getElementById('dataInicio').value,
        dataFim: document.getElementById('dataFim').value,
        status: 'PENDENTE'
    };

    fetch('/pedidos/criar', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(pedido)
    })
    .then(response => response.json())
    .then(data => {
        alert('Pedido de aluguel realizado com sucesso!');
        listarMeusAlugueis();
    })
    .catch(error => console.error('Erro ao criar pedido:', error));
}

function listarMeusAlugueis() {
    const clienteId = localStorage.getItem('userId');
    fetch(`/pedidos/cliente/${clienteId}`, {
        headers: getHeaders()
    })
    .then(response => response.json())
    .then(pedidos => {
        const container = document.getElementById('meusAlugueis');
        container.innerHTML = '';
        
        pedidos.forEach(pedido => {
            const card = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Aluguel #${pedido.id}</h5>
                            <p class="card-text">
                                Status: ${pedido.status}<br>
                                Data Início: ${new Date(pedido.dataInicio).toLocaleDateString()}<br>
                                Data Fim: ${new Date(pedido.dataFim).toLocaleDateString()}
                            </p>
                            ${pedido.status === 'PENDENTE' ? 
                                `<button onclick="cancelarAluguel(${pedido.id})" class="btn btn-danger">Cancelar</button>` : ''}
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
    })
    .catch(error => console.error('Erro ao listar aluguéis:', error));
}

function cancelarAluguel(pedidoId) {
    if (confirm('Tem certeza que deseja cancelar este aluguel?')) {
        fetch(`/pedidos/${pedidoId}/cancelar`, {
            method: 'PUT',
            headers: getHeaders()
        })
        .then(() => {
            alert('Aluguel cancelado com sucesso!');
            listarMeusAlugueis();
        })
        .catch(error => console.error('Erro ao cancelar aluguel:', error));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    listarVeiculosDisponiveis();
    listarMeusAlugueis();
});
