document.addEventListener('DOMContentLoaded', () => {
    const tabelaAlunos = document.getElementById('alunos-tbody');
    const tabelaEmpresas = document.getElementById('empresas-tbody');

    // Função para buscar todos os alunos
    async function buscarTodosAlunos() {
        try {
            const response = await fetch('http://localhost:8080/aluno/all',{
                method: 'GET'
            });
            if (!response.ok) throw new Error('Erro ao buscar lista de alunos');
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

    // Função para buscar todas as empresas
    async function buscarTodasEmpresas() {
        try {
            const response = await fetch('http://localhost:8080/empresa/all', { method: 'GET' });
            if (!response.ok) throw new Error('Erro ao buscar lista de empresas');
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Função para excluir empresa
    async function excluirEmpresa(id, row) {
        if (!confirm("Tem certeza que deseja excluir esta empresa?")) return;

        try {
            const response = await fetch(`http://localhost:8080/empresa/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error("Erro ao excluir empresa");

            row.remove();
            alert("Empresa excluída com sucesso!");
        } catch (error) {
            console.error(error);
            alert("Não foi possível excluir a empresa");
        }
    }

    // Carregar alunos na tabela a partir do endpoint /aluno/all
    async function carregarAlunos() {
        const alunos = await buscarTodosAlunos();
        if (!alunos) {
            // Erro já logado em buscarTodosAlunos
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="7" class="text-center text-danger">Erro ao carregar alunos.</td>`;
            tabelaAlunos.appendChild(tr);
            return;
        }

        if (!Array.isArray(alunos) || alunos.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="7" class="text-center">Nenhum aluno encontrado.</td>`;
            tabelaAlunos.appendChild(tr);
            return;
        }

        for (const aluno of alunos) {
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
                    <a href="atualizarUsuario.html?id=${aluno.id}" class="text-warning me-2" title="Editar">
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

    // Carregar empresas na tabela a partir do endpoint /empresa/all
    async function carregarEmpresas() {
        const empresas = await buscarTodasEmpresas();
        if (!empresas) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="7" class="text-center text-danger">Erro ao carregar empresas.</td>`;
            tabelaEmpresas.appendChild(tr);
            return;
        }

        if (!Array.isArray(empresas) || empresas.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="7" class="text-center">Nenhuma empresa encontrada.</td>`;
            tabelaEmpresas.appendChild(tr);
            return;
        }

        for (const empresa of empresas) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${empresa.id}</td>
                <td>${empresa.nome}</td>
                <td>${empresa.email}</td>
                <td>${empresa.endereco || ''}</td>
                <td>${empresa.cnpj || ''}</td>
                <td>${empresa.ie || ''}</td>
                <td class="text-center">
                    <a href="visualizar-empresa.html?id=${empresa.id}" class="text-primary me-2" title="Visualizar">
                        <span class="bi bi-eye-fill"></span>
                    </a>
                    <a href="atualizar-empresa.html?id=${empresa.id}" class="text-warning me-2" title="Editar">
                        <span class="bi bi-pencil-fill"></span>
                    </a>
                    <button class="btn btn-link text-danger p-0" title="Excluir">
                        <span class="bi bi-trash-fill"></span>
                    </button>
                </td>
            `;

            row.querySelector('button').addEventListener('click', () => excluirEmpresa(empresa.id, row));
            tabelaEmpresas.appendChild(row);
        }
    }

    // Só carregar empresas se a tabela estiver presente na página
    if (tabelaEmpresas) {
        carregarEmpresas();
    }
    carregarAlunos();
});
