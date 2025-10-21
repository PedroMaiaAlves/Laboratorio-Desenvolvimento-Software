document.addEventListener('DOMContentLoaded', () => {
  const tabelaEmpresas = document.getElementById('empresas-tbody');

  async function buscarTodasEmpresas() {
    try {
      const response = await fetch('http://localhost:8080/empresa/all');
      if (!response.ok) throw new Error('Erro ao buscar lista de empresas');
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function excluirEmpresa(id, row) {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) return;

    try {
      const response = await fetch(`http://localhost:8080/empresa/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao excluir empresa');
      row.remove();
      alert('Empresa excluída com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Não foi possível excluir a empresa');
    }
  }

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

  carregarEmpresas();
});