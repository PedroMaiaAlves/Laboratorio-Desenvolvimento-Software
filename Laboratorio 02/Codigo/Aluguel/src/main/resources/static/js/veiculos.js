function getHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

function listarVeiculos() {
    fetch('/automoveis/listar', {
        headers: getHeaders()
    })
    .then(response => response.json())
    .then(veiculos => {
        const tableBody = document.getElementById('veiculosTableBody');
        tableBody.innerHTML = '';
        
        veiculos.forEach(veiculo => {
            const row = `
                <tr>
                    <td>${veiculo.modelo}</td>
                    <td>${veiculo.marca}</td>
                    <td>${veiculo.ano}</td>
                    <td>${veiculo.placa}</td>
                    <td>${veiculo.status}</td>
                    <td>
                        <button onclick="editarVeiculo(${veiculo.id})" class="btn btn-warning btn-sm">Editar</button>
                        <button onclick="deletarVeiculo(${veiculo.id})" class="btn btn-danger btn-sm">Excluir</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => {
        console.error('Erro ao listar veículos:', error);
        alert('Erro ao carregar a lista de veículos. Por favor, recarregue a página.');
    });
}

function salvarVeiculo(event) {
    event.preventDefault();
    
    const veiculo = {
        modelo: document.getElementById('modelo').value,
        marca: document.getElementById('marca').value,
        ano: document.getElementById('ano').value,
        placa: document.getElementById('placa').value,
        status: document.getElementById('status').value
    };

    const method = document.getElementById('veiculoId').value ? 'PUT' : 'POST';
    const url = method === 'PUT' 
        ? `/automoveis/${document.getElementById('veiculoId').value}/atualizar`
        : '/automoveis/cadastrar';

    fetch(url, {
        method: method,
        headers: getHeaders(),
        body: JSON.stringify(veiculo)
    })
    .then(response => response.json())
    .then(() => {
        $('#veiculoModal').modal('hide');
        listarVeiculos();
        document.getElementById('veiculoForm').reset();
    })
    .catch(error => {
        console.error('Erro ao salvar veículo:', error);
        alert('Erro ao salvar o veículo. Por favor, tente novamente.');
    });
}

function editarVeiculo(id) {
    fetch(`/automoveis/${id}`, {
        headers: getHeaders()
    })
    .then(response => response.json())
    .then(veiculo => {
        document.getElementById('veiculoId').value = veiculo.id;
        document.getElementById('modelo').value = veiculo.modelo;
        document.getElementById('marca').value = veiculo.marca;
        document.getElementById('ano').value = veiculo.ano;
        document.getElementById('placa').value = veiculo.placa;
        document.getElementById('status').value = veiculo.status;
        $('#veiculoModal').modal('show');
    })
    .catch(error => console.error('Erro ao carregar veículo:', error));
}

function deletarVeiculo(id) {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
        fetch(`/automoveis/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        })
        .then(() => listarVeiculos())
        .catch(error => console.error('Erro ao deletar veículo:', error));
    }
}

function novoVeiculo() {
    document.getElementById('veiculoForm').reset();
    document.getElementById('veiculoId').value = '';
    $('#veiculoModal').modal('show');
}

// Inicialização é feita pelo jQuery no HTML
