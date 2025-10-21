document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formCadastroEmpresa');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const empresa = {
      cnpj: document.getElementById('cnpj').value,
      ie: document.getElementById('ie').value,
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      endereco: document.getElementById('endereco').value
    };

    try {
      const response = await fetch('http://localhost:8080/empresa/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empresa)
      });

      if (response.ok) {
        alert('Empresa cadastrada com sucesso!');
        form.reset();
        window.location.href = 'index.html';
      } else {
        const errorData = await response.json();
        console.error('Erro no cadastro:', errorData);
        alert('Erro ao cadastrar empresa. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Não foi possível conectar ao servidor.');
    }
  });
});