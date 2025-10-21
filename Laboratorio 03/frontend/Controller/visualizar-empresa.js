document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const empresaId = urlParams.get('id');

    if (!empresaId) {
        alert("ID da empresa não informado!");
        window.location.href = 'index.html';
        return;
    }

    fetch(`http://localhost:8080/empresa/view/${empresaId}`, { method: 'GET' })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao buscar empresa");
            return response.json();
        })
        .then(empresa => {
            document.getElementById('displayNome').textContent = empresa.nome || '-';
            document.getElementById('displayEmail').textContent = empresa.email || '-';
            document.getElementById('displayEndereco').textContent = empresa.endereco || '-';
            document.getElementById('displayIe').textContent = empresa.ie || '-';
            document.getElementById('displayCnpj').textContent = empresa.cnpj || '-';

            const avatar = document.getElementById('avatar');
            if (empresa.logo) {
                avatar.src = empresa.logo;
            } else {
                const svg = `data:image/svg+xml;utf8,` + encodeURIComponent(`
                    <svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='1'>
                        <rect width='100%' height='100%' rx='70' fill='%23f5f5f5'/>
                        <path d='M4 7h16v10H4z' fill='%23888'/>
                    </svg>
                `);
                avatar.src = svg;
            }

            const btnEditar = document.getElementById('btnEditar');
            if (btnEditar) btnEditar.href = `atualizar-empresa.html?id=${empresaId}`;
        })
        .catch(error => {
            console.error(error);
            alert("Erro ao carregar os dados da empresa");
        });
});