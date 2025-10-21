document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formCadastroAluno');

  const inputCPF = document.getElementById('cpf');
  const inputRG = document.getElementById('rg');

  // Função simples para aplicar máscara de CPF: 000.000.000-00
  function mascaraCPF(value) {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  // Função simples para aplicar máscara de RG: 00.000.000-0 (até 9 dígitos sem pontos)
  function mascaraRG(value) {
    return value
      .replace(/\D/g, '')
      .slice(0, 9)
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1})$/, '$1-$2');
  }

  if (inputCPF) {
    inputCPF.addEventListener('input', (e) => {
      const pos = e.target.selectionStart;
      e.target.value = mascaraCPF(e.target.value);
      e.target.setSelectionRange(pos, pos);
    });
  }

  if (inputRG) {
    inputRG.addEventListener('input', (e) => {
      const pos = e.target.selectionStart;
      e.target.value = mascaraRG(e.target.value);
      e.target.setSelectionRange(pos, pos);
    });
  }

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
