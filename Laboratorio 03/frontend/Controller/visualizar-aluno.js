document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const alunoId = urlParams.get('id');

    if (!alunoId) {
        alert("ID do aluno não informado!");
        window.location.href = 'index.html';
        return;
    }

    // Chamada ao backend para pegar os dados do aluno
    fetch(`http://localhost:8080/aluno/view/${alunoId}`, {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao buscar aluno");
            return response.json();
        })
        .then(aluno => {
            // Campos de exibição
            document.getElementById('displayNome').textContent = aluno.nome || '-';
            document.getElementById('displayEmail').textContent = aluno.email || '-';
            document.getElementById('displayEndereco').textContent = aluno.endereco || '-';
            document.getElementById('displayRg').textContent = aluno.rg || '-';
            document.getElementById('displayCpf').textContent = aluno.cpf || '-';

            // Avatar: usa foto do aluno ou imagem padrão embutida (SVG base64) para evitar dependências
            const avatar = document.getElementById('avatar');
            if (aluno.foto) {
                avatar.src = aluno.foto;
            } else {
                // SVG simples como placeholder (grey silhouette)
                const svg = `data:image/svg+xml;utf8,` + encodeURIComponent(`
                    <svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='1'>
                        <rect width='100%' height='100%' rx='70' fill='%23f5f5f5'/>
                        <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z' fill='%23888'/>
                        <path d='M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4' stroke='%23888' fill='none'/>
                    </svg>
                `);
                avatar.src = svg;
            }

            // Ajustar link do botão editar
            const btnEditar = document.getElementById('btnEditar');
            if (btnEditar) btnEditar.href = `atualizarUsuario.html?id=${alunoId}`;
        })
        .catch(error => {
            console.error(error);
            alert("Erro ao carregar os dados do aluno");
        });
});
