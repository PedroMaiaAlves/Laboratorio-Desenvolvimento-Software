document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURAÇÕES ---
    const API_BASE_URL = 'http://localhost:8080';

    // --- SELETORES ---
    const vantagemForm = document.getElementById('vantagem-form');
    const vantagensList = document.getElementById('vantagens-list');
    const toastContainer = document.getElementById('toast-container');
    const resgateModal = document.getElementById('resgate-confirm-modal');
    const resgateVantagemNome = document.getElementById('resgate-vantagem-nome');
    const resgateVantagemCusto = document.getElementById('resgate-vantagem-custo');
    const alunoSelect = document.getElementById('resgate-aluno-select');
    const confirmResgateBtn = document.getElementById('confirm-resgate-btn');
    const empresaSelect = document.getElementById('vantagem-empresa-select');

    let vantagemParaResgatarId = null;

    // --- FUNÇÕES DE UTILIDADE ---
    const openModal = (modal) => modal.setAttribute('aria-hidden', 'false');
    const closeModal = (modal) => modal.setAttribute('aria-hidden', 'true');

    const showToast = (message, type = 'success') => {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            toast.addEventListener('animationend', () => toast.remove());
        }, 3000);
    };

    // --- FUNÇÕES DE API ---
    const apiCall = async (url, method, body = null) => {
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' },
            };
            if (body) options.body = JSON.stringify(body);

            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Erro na operação` }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return response.status !== 204 ? await response.json() : true;
        } catch (error) {
            showToast(error.message, 'error');
            console.error(error);
            return null;
        }
    };

    // --- RENDERIZAÇÃO E DADOS ---
    const renderVantagemCard = (vantagem) => {
        const card = document.createElement('div');
        card.className = 'vantagem-card';
        card.dataset.id = vantagem.id;

        card.innerHTML = `
            <img src="${vantagem.fotoUrl}" alt="${vantagem.nome}" class="vantagem-card-imagem">
            <div class="vantagem-card-conteudo">
                <h3 class="vantagem-card-titulo">${vantagem.nome}</h3>
                <p class="vantagem-card-descricao">${vantagem.descricao}</p>
                <p class="vantagem-card-empresa">Oferecido por: <strong>${vantagem.empresa.razaoSocial}</strong></p>
                <div class="vantagem-card-footer">
                    <span class="vantagem-card-custo">${vantagem.custoMoedas.toFixed(2)} moedas</span>
                    <button class="btn-resgatar" data-vantagem-id="${vantagem.id}" data-vantagem-nome="${vantagem.nome}" data-vantagem-custo="${vantagem.custoMoedas.toFixed(2)}">Resgatar</button>
                </div>
            </div>
        `;
        return card;
    };

    const carregarVantagens = async () => {
        const vantagens = await apiCall(`${API_BASE_URL}/vantagem/disponiveis`, 'GET');
        if (vantagens && vantagensList) {
            vantagensList.innerHTML = '';
            if (vantagens.length === 0) {
                vantagensList.innerHTML = '<p>Nenhuma vantagem disponível no momento.</p>';
                return;
            }
            vantagens.forEach(vantagem => {
                vantagensList.appendChild(renderVantagemCard(vantagem));
            });
        }
    };

    const carregarAlunosParaSelecao = async () => {
        alunoSelect.innerHTML = '<option value="">Carregando alunos...</option>';
        const alunos = await apiCall(`${API_BASE_URL}/alunos/all`, 'GET');
        if (alunos) {
            alunoSelect.innerHTML = '<option value="">Selecione um aluno</option>';
            alunos.forEach(aluno => {
                const option = document.createElement('option');
                option.value = aluno.id;
                option.textContent = `${aluno.nome} (ID: ${aluno.id})`;
                alunoSelect.appendChild(option);
            });
        } else {
            alunoSelect.innerHTML = '<option value="">Não foi possível carregar os alunos</option>';
        }
    };

    const carregarEmpresas = async () => {
        if (!empresaSelect) return;
        empresaSelect.innerHTML = '<option value="">Carregando empresas...</option>';
        const empresas = await apiCall(`${API_BASE_URL}/empresas/all`, 'GET');
        if (empresas) {
            empresaSelect.innerHTML = '<option value="">Selecione uma empresa</option>';
            empresas.forEach(empresa => {
                const option = document.createElement('option');
                option.value = empresa.id;
                option.textContent = `${empresa.razaoSocial} (ID: ${empresa.id})`;
                empresaSelect.appendChild(option);
            });
        } else {
            empresaSelect.innerHTML = '<option value="">Não foi possível carregar as empresas</option>';
        }
    };

    // --- LÓGICA DE NEGÓCIO ---

    const handleCadastroVantagem = async (e) => {
        e.preventDefault();
        const formData = new FormData(vantagemForm);
        const data = Object.fromEntries(formData.entries());
        
        data.custoMoedas = parseFloat(data.custoMoedas);
        const idEmpresa = data.empresaId;

        if (!idEmpresa) {
            showToast('Por favor, selecione uma empresa.', 'error');
            return;
        }

        const payload = {
            nome: data.nome,
            descricao: data.descricao,
            fotoUrl: data.fotoUrl,
            custoMoedas: data.custoMoedas
        };

        const result = await apiCall(`${API_BASE_URL}/vantagem/${idEmpresa}`, 'POST', payload);

        if (result) {
            showToast('Vantagem cadastrada com sucesso!', 'success');
            vantagemForm.reset();
            carregarVantagens();
            // Recarrega as empresas para limpar a seleção
            carregarEmpresas();
        }
    };

    const abrirModalResgate = async (target) => {
        vantagemParaResgatarId = target.dataset.vantagemId;
        const nome = target.dataset.vantagemNome;
        const custo = target.dataset.vantagemCusto;

        if (resgateVantagemNome) resgateVantagemNome.textContent = nome;
        if (resgateVantagemCusto) resgateVantagemCusto.textContent = custo;
        
        await carregarAlunosParaSelecao();
        openModal(resgateModal);
    };

    const handleResgateVantagem = async () => {
        if (!vantagemParaResgatarId) return;

        const alunoId = alunoSelect.value;
        if (!alunoId) {
            showToast('Por favor, selecione um aluno.', 'error');
            return;
        }

        const url = `${API_BASE_URL}/vantagem/resgatar/${vantagemParaResgatarId}/aluno/${alunoId}`;
        const result = await apiCall(url, 'POST');

        if (result) {
            showToast('Vantagem resgatada com sucesso!', 'success');
            closeModal(resgateModal);
            carregarVantagens();
        }
        vantagemParaResgatarId = null;
    };


    // --- INICIALIZAÇÃO E EVENT LISTENERS ---
    const init = () => {
        carregarVantagens();

        if (vantagemForm) {
            carregarEmpresas();
            vantagemForm.addEventListener('submit', handleCadastroVantagem);
        }

        if (resgateModal) {
            vantagensList.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-resgatar')) {
                    abrirModalResgate(e.target);
                }
            });

            confirmResgateBtn.addEventListener('click', handleResgateVantagem);

            resgateModal.querySelectorAll('[data-close]').forEach(el => {
                el.addEventListener('click', () => closeModal(resgateModal));
            });
        }
    };

    init();
});

