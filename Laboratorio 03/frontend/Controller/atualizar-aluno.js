const urlParams = new URLSearchParams(window.location.search);
const alunoId = urlParams.get('id');

const form = document.getElementById('formAtualizacaoAluno');

// Retorna inputs/fields do formulário que têm id
function getFormFields() {
    if (!form) return [];
    return Array.from(form.querySelectorAll('input, textarea, select')).filter(el => el.id);
}

// Máscaras reutilizáveis (mesma lógica aplicada em cadastrar-aluno.js)
function mascaraCPF(value) {
    return value
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function mascaraRG(value) {
    return value
        .replace(/\D/g, '')
        .slice(0, 9)
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1})$/, '$1-$2');
}

// Aplica máscara e mantém cursor
function applyMaskToInput(input, maskFn) {
    input.addEventListener('input', (e) => {
        const pos = e.target.selectionStart;
        e.target.value = maskFn(e.target.value);
        try { e.target.setSelectionRange(pos, pos); } catch (err) { /* ignore */ }
    });
}

// Função para preencher os campos com os dados do aluno (só preenche elementos existentes)
async function carregarAluno() {
    if (!alunoId) {
        console.warn('ID do aluno não fornecido na URL.');
        return;
    }

    try {
        const res = await fetch(`http://localhost:8080/aluno/view/${alunoId}`, { method: 'GET' });
        if (!res.ok) throw new Error('Erro ao buscar dados do aluno');
        const aluno = await res.json();

        const fields = getFormFields();
        fields.forEach(field => {
            if (Object.prototype.hasOwnProperty.call(aluno, field.id) && aluno[field.id] !== undefined && aluno[field.id] !== null) {
                try {
                    field.value = aluno[field.id];
                } catch (err) {
                    // Em caso de campos especiais que não aceitam value, ignorar
                    console.warn(`Não foi possível preencher o campo ${field.id}:`, err);
                }
            }
        });

        // Após preencher, garantir máscara em cpf/rg se existirem
        const inputCPF = document.getElementById('cpf');
        const inputRG = document.getElementById('rg');
        if (inputCPF) {
            inputCPF.value = mascaraCPF(inputCPF.value || '');
            applyMaskToInput(inputCPF, mascaraCPF);
        }
        if (inputRG) {
            inputRG.value = mascaraRG(inputRG.value || '');
            applyMaskToInput(inputRG, mascaraRG);
        }
    } catch (error) {
        alert(error.message);
    }
}

// Submissão do formulário (PUT) — só se o formulário existir
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dados = {};
        getFormFields().forEach(field => {
            dados[field.id] = field.value;
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
} else {
    console.warn('Formulário de atualização não encontrado na página.');
}

// Carrega os dados ao abrir a página
carregarAluno();
