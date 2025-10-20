document.addEventListener('DOMContentLoaded', () => {
    const tabelaAlunos = document.querySelector('tbody');

    // Array de IDs de alunos (precisa ser preenchido manualmente aqui)
    const idsAlunos = [1, 2, 3, 4, 5]; // Substitua pelos IDs reais que você tem no sistema

    // Função para buscar um aluno pelo ID
    async function buscarAluno(id) {
        try {
            const response = await fetch(`http://localhost:8080/aluno/view/${id}`);
            if (!response.ok) throw new Error(`Erro ao buscar aluno ${id}`);
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Função para excluir aluno
    async function excluirAluno(id, row) {
        if (!confirm("Tem certeza que deseja excluir este aluno?")) return;

        try {
            const response = await fetch(`http://localhost:8080/aluno/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error("Erro ao excluir aluno");

            row.remove();
            alert("Aluno excluído com sucesso!");
        } catch (error) {
            console.error(error);
            alert("Não foi possível excluir o aluno");
        }
    }

    // Carregar alunos na tabela
    async function carregarAlunos() {
        for (const id of idsAlunos) {
            const aluno = await buscarAluno(id);
            if (!aluno) continue;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.endereco || ''}</td>
                <td>${aluno.rg || ''}</td>
                <td>${aluno.cpf || ''}</td>
                <td class="text-center">
                    <a href="visualizar-aluno.html?id=${aluno.id}" class="text-primary me-2" title="Visualizar">
                        <span class="bi bi-eye-fill"></span>
                    </a>
                    <a href="atualizar-aluno.html?id=${aluno.id}" class="text-warning me-2" title="Editar">
                        <span class="bi bi-pencil-fill"></span>
                    </a>
                    <button class="btn btn-link text-danger p-0" title="Excluir">
                        <span class="bi bi-trash-fill"></span>
                    </button>
                </td>
            `;

            row.querySelector('button').addEventListener('click', () => excluirAluno(aluno.id, row));
            tabelaAlunos.appendChild(row);
        }
    }

    carregarAlunos();
});
