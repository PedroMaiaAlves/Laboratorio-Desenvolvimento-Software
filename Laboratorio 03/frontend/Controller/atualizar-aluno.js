const urlParams = new URLSearchParams(window.location.search);
const alunoId = urlParams.get('id');

const form = document.getElementById('formAtualizacaoAluno');
const campos = ['nome', 'email', 'senha', 'endereco', 'rg', 'cpf'];

// Função para preencher os campos com os dados do aluno
async function carregarAluno() {
    try {
        const res = await fetch(`http://localhost:8080/aluno/${alunoId}`);
        if (!res.ok) throw new Error('Erro ao buscar dados do aluno');
        const aluno = await res.json();

        campos.forEach(campo => {
            if (aluno[campo] !== undefined) {
                document.getElementById(campo).value = aluno[campo];
            }
        });
    } catch (error) {
        alert(error.message);
    }
}

// Submissão do formulário (PUT)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {};
    campos.forEach(campo => {
        dados[campo] = document.getElementById(campo).value;
    });

    try {
        const res = await fetch(`http://localhost:8080/aluno/update/${alunoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!res.ok) throw new Error('Falha ao atualizar o aluno');

        alert('Aluno atualizado com sucesso!');
        window.location.href = 'index.html';
    } catch (error) {
        alert(error.message);
    }
});

// Carrega os dados ao abrir a página
carregarAluno();
