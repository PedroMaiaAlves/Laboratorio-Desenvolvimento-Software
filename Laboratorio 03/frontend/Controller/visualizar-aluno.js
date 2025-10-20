document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const alunoId = urlParams.get('id');

    if (!alunoId) {
        alert("ID do aluno não informado!");
        window.location.href = 'index.html';
        return;
    }

    // Chamada ao backend para pegar os dados do aluno
    fetch(`http://localhost:8080/aluno/${alunoId}`)
        .then(response => {
            if (!response.ok) throw new Error("Erro ao buscar aluno");
            return response.json();
        })
        .then(aluno => {
            document.getElementById('nome').value = aluno.nome;
            document.getElementById('email').value = aluno.email;
            document.getElementById('senha').value = aluno.senha || '';
            document.getElementById('endereco').value = aluno.endereco || '';
            document.getElementById('rg').value = aluno.rg || '';
            document.getElementById('cpf').value = aluno.cpf || '';
        })
        .catch(error => {
            console.error(error);
            alert("Erro ao carregar os dados do aluno");
        });
});
