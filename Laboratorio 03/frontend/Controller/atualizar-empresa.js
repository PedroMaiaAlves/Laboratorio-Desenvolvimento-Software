const urlParams = new URLSearchParams(window.location.search);
const empresaId = urlParams.get('id');

const form = document.getElementById('formAtualizacaoEmpresa');

function getFormFields() {
    if (!form) return [];
    return Array.from(form.querySelectorAll('input, textarea, select')).filter(el => el.id);
}

async function carregarEmpresa() {
    if (!empresaId) {
        console.warn('ID da empresa não fornecido na URL.');
        return;
    }

    try {
        const res = await fetch(`http://localhost:8080/empresa/view/${empresaId}`, { method: 'GET' });
        if (!res.ok) throw new Error('Erro ao buscar dados da empresa');
        const empresa = await res.json();

        const fields = getFormFields();
        fields.forEach(field => {
            if (Object.prototype.hasOwnProperty.call(empresa, field.id) && empresa[field.id] !== undefined && empresa[field.id] !== null) {
                try {
                    field.value = empresa[field.id];
                } catch (err) {
                    console.warn(`Não foi possível preencher o campo ${field.id}:`, err);
                }
            }
        });
    } catch (error) {
        alert(error.message);
    }
}

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dados = {};
        getFormFields().forEach(field => {
            dados[field.id] = field.value;
        });

        try {
            const res = await fetch(`http://localhost:8080/empresa/update/${empresaId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if (!res.ok) throw new Error('Falha ao atualizar a empresa');

            alert('Empresa atualizada com sucesso!');
            window.location.href = 'index.html';
        } catch (error) {
            alert(error.message);
        }
    });
} else {
    console.warn('Formulário de atualização não encontrado na página.');
}

carregarEmpresa();