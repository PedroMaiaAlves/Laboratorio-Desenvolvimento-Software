function verificarAutenticacao() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login.html';
}

function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha no login');
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);

        // Redirecionar conforme a role do usuário
        if (data.role === 'CLIENTE') {
            window.location.href = '/veiculos.html';
        } else if (data.role === 'AGENTE') {
            window.location.href = '/painel-agente.html';
        } else {
            window.location.href = '/index.html'; // fallback
        }
    })
    .catch(error => {
        document.getElementById('errorMessage').textContent = 'Email ou senha inválidos';
        document.getElementById('errorAlert').classList.remove('d-none');
    });
}

function register(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const tipo = document.getElementById('tipo').value; // "CLIENTE" ou "AGENTE"

    let endpoint = '';
    if (tipo === 'CLIENTE') {
        endpoint = '/cliente/cadastrar';
    } else if (tipo === 'AGENTE') {
        endpoint = '/agentes/cadastrar';
    }

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: nome,
            email: email,
            senha: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha no registro');
        }
        return response.json();
    })
    .then(() => {
        alert('Registro realizado com sucesso! Por favor, faça login.');
        window.location.href = '/login.html';
    })
    .catch(error => {
        document.getElementById('errorMessage').textContent = 'Erro ao realizar o registro';
        document.getElementById('errorAlert').classList.remove('d-none');
    });
}
