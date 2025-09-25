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
        window.location.href = '/veiculos.html';
    })
    .catch(error => {
        document.getElementById('errorMessage').textContent = 'Email ou senha inválidos';
        document.getElementById('errorAlert').classList.remove('d-none');
    });
}
