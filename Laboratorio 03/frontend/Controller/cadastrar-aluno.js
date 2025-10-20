document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formCadastroAluno');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Monta o JSON no formato exato esperado
    const aluno = {
      cpf: document.getElementById('cpf').value,
      rg: document.getElementById('rg').value,
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      senha: document.getElementById('senha').value,
      endereco: document.getElementById('endereco').value
    };

    try {
      const response = await fetch('http://localhost:8080/aluno/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(aluno)
      });

      if (response.ok) {
        alert('Aluno cadastrado com sucesso!');
        form.reset();
        window.location.href = 'index.html'; // redireciona após cadastro
      } else {
        const errorData = await response.json();
        console.error('Erro no cadastro:', errorData);
        alert('Erro ao cadastrar aluno. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Não foi possível conectar ao servidor.');
    }
  });
});
