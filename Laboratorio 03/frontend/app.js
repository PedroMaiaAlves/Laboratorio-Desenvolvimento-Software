document.addEventListener('DOMContentLoaded', () => {
    const apiUrls = {
        alunos: 'http://localhost:8080/alunos',
        empresas: 'http://localhost:8080/empresas',
        professores: 'http://localhost:8080/professores', // Endpoint de exemplo
    };

    const state = {
        alunos: [],
        empresas: [],
        professores: [],
        currentView: 'alunos',
        currentItemId: null,
    };

    // --- SELETORES GERAIS ---
    const mainTitle = document.getElementById('main-title');
    const addBtn = document.getElementById('add-btn');
    const addBtnText = document.getElementById('add-btn-text');
    const toastContainer = document.getElementById('toast-container');
    const tabs = document.querySelectorAll('.tab-btn');
    const mainContents = {
        alunos: document.getElementById('main-content-alunos'),
        empresas: document.getElementById('main-content-empresas'),
        professores: document.getElementById('main-content-professores'),
        acoes: document.getElementById('main-content-acoes'),
    };

    // --- SELETORES DE LISTAS ---
    const lists = {
        alunos: document.getElementById('alunos-list'),
        empresas: document.getElementById('empresas-list'),
        professores: document.getElementById('professores-list'),
    };

    // --- SELETORES DE MODAIS ---
    const modals = {
        formAluno: document.getElementById('form-aluno-modal'),
        deleteAluno: document.getElementById('delete-aluno-confirm-modal'),
        formEmpresa: document.getElementById('form-empresa-modal'),
        deleteEmpresa: document.getElementById('delete-empresa-confirm-modal'),
        formProfessor: document.getElementById('form-professor-modal'),
        deleteProfessor: document.getElementById('delete-professor-confirm-modal'),
    };

    // --- SELETORES DE FORMULÁRIOS ---
    const forms = {
        aluno: document.getElementById('aluno-form'),
        empresa: document.getElementById('empresa-form'),
        professor: document.getElementById('professor-form'),
        distributeCoins: document.getElementById('distribute-coins-form'),
    };

    // --- SELETORES DE AÇÕES ---
    const selectAlunoAcao = document.getElementById('select-aluno-acao');
    const selectProfessorAcao = document.getElementById('select-professor-acao');
    const alunoActionsView = document.getElementById('aluno-actions-view');
    const professorActionsView = document.getElementById('professor-actions-view');
    const alunoSaldo = document.getElementById('aluno-saldo');
    const alunoExtratoList = document.getElementById('aluno-extrato-list');
    const professorExtratoList = document.getElementById('professor-extrato-list');

    // --- FUNÇÕES DE API GENÉRICAS ---
    const fetchData = async (entity) => {
        try {
            const url = entity === 'professores' ? apiUrls[entity] : `${apiUrls[entity]}/all`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Erro ao buscar ${entity}.`);
            state[entity] = await response.json();
        } catch (error) {
            showToast(error.message, 'error');
            state[entity] = [];
        }
    };

    const apiCall = async (url, method, body = null) => {
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' },
            };
            if (body) options.body = JSON.stringify(body);

            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Erro na operação de ${method}` }));
                throw new Error(errorData.message);
            }
            return response.status !== 204 ? await response.json() : true;
        } catch (error) {
            showToast(error.message, 'error');
            return null;
        }
    };

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    const renderCard = (item, type) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = item.id;
        let content = '';
        if (type === 'alunos') {
            content = `<h3>${item.nome}</h3><p>${item.email}</p>`;
        } else if (type === 'empresas') {
            content = `<h3>${item.razaoSocial}</h3><p>CNPJ: ${item.cnpj}</p>`;
        } else if (type === 'professores') {
            content = `<h3>${item.nome}</h3><p>${item.departamento}</p>`;
        }

        card.innerHTML = `
            <div class="card-content">${content}</div>
            <div class="card-actions">
                <button class="btn-icon edit-btn" title="Editar"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg></button>
                <button class="btn-icon delete-btn" title="Excluir"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg></button>
            </div>
        `;
        return card;
    };

    const render = () => {
        const view = state.currentView;
        if (!lists[view]) return;

        const list = lists[view];
        const data = state[view];
        list.innerHTML = '';
        if (data.length === 0) {
            list.innerHTML = `<p>Nenhum item cadastrado.</p>`;
            return;
        }
        data.forEach(item => list.appendChild(renderCard(item, view)));
    };

    // --- NAVEGAÇÃO E VISIBILIDADE ---
    const switchView = async (view) => {
        state.currentView = view;
        tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === view));

        Object.values(mainContents).forEach(content => content.classList.add('hidden'));
        mainContents[view].classList.remove('hidden');

        addBtn.classList.toggle('hidden', view === 'acoes');

        const titles = { alunos: 'Alunos', empresas: 'Empresas', professores: 'Professores', acoes: 'Ações' };
        mainTitle.textContent = titles[view];
        if (view !== 'acoes') addBtnText.textContent = `Novo ${titles[view].slice(0, -1)}`;

        if (view !== 'acoes') {
            await fetchData(view);
            render();
        } else {
            await populateActionSelects();
        }
    };

    // --- LÓGICA DE CRUD ---
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const entity = form.id.split('-')[0]; // 'aluno', 'empresa', 'professor'
        const id = form.querySelector(`#${entity}-id`).value;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        let url, result;
        if (entity === 'aluno') {
            url = id ? `${apiUrls.alunos}/update/${id}` : `${apiUrls.alunos}/cadastrar`;
            const payload = { nome: data.nome, email: data.email, cpf: data.cpf, rg: data.rg, endereco: data.endereco };
            if (!id) payload.senha = data.senha;
            result = await apiCall(url, id ? 'PUT' : 'POST', payload);
        } else if (entity === 'empresa') {
            url = id ? `${apiUrls.empresas}/update/${id}` : `${apiUrls.empresas}/create`;
            const payload = { razaoSocial: data.razaoSocial, cnpj: data.cnpj, email: data.email, telefone: data.telefone };
            if (!id) payload.senha = data.senha;
            result = await apiCall(url, id ? 'PUT' : 'POST', payload);
        } else if (entity === 'professor') {
            url = id ? `${apiUrls.professores}/${id}` : apiUrls.professores;
            const payload = { nome: data.nome, email: data.email, cpf: data.cpf, departamento: data.departamento, instituicao: data.instituicao };
            if (!id) payload.senha = data.senha;
            result = await apiCall(url, id ? 'PUT' : 'POST', payload);
        }

        if (result) {
            closeModal(modals[`form${capitalize(entity)}`]);
            showToast(`${capitalize(entity)} ${id ? 'atualizado' : 'criado'} com sucesso!`, 'success');
            await fetchData(entity);
            render();
        }
    };

    const openEditModal = (entity, item) => {
        const form = forms[entity];
        form.reset();
        document.getElementById(`${entity}-id`).value = item.id;
        document.getElementById(`form-${entity}-title`).textContent = `Editar ${capitalize(entity)}`;
        document.getElementById(`${entity}-senha-group`).classList.add('hidden');

        for (const key in item) {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) input.value = item[key];
        }
        // Edge case for razaoSocial
        if (entity === 'empresa' && item.razaoSocial) {
            form.querySelector('[name="razaoSocial"]').value = item.razaoSocial;
        }

        openModal(modals[`form${capitalize(entity)}`]);
    };

    const openDeleteModal = (entity, item) => {
        state.currentItemId = item.id;
        const name = entity === 'empresa' ? item.razaoSocial : item.nome;
        document.getElementById(`delete-${entity}-name`).textContent = name;
        openModal(modals[`delete${capitalize(entity)}`]);
    };

    const confirmDelete = async () => {
        const entity = state.currentView;
        const id = state.currentItemId;
        const url = `${apiUrls[entity]}/${id}`;
        const success = await apiCall(url, 'DELETE');

        if (success) {
            closeModal(modals[`delete${capitalize(entity)}`]);
            showToast(`${capitalize(entity)} excluído com sucesso!`, 'success');
            state.currentItemId = null;
            await fetchData(entity);
            render();
        }
    };

    // --- LÓGICA DE AÇÕES ---
    const populateActionSelects = async () => {
        await fetchData('alunos');
        await fetchData('professores');
        
        populateSelect(selectAlunoAcao, state.alunos, 'Selecione um aluno');
        populateSelect(selectProfessorAcao, state.professores, 'Selecione um professor');
    };

    const populateSelect = (select, items, placeholder) => {
        select.innerHTML = `<option value="">${placeholder}</option>`;
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.nome || item.razaoSocial;
            select.appendChild(option);
        });
    };

    const handleAlunoActionSelect = async (e) => {
        const alunoId = e.target.value;
        if (!alunoId) {
            alunoActionsView.classList.add('hidden');
            return;
        }
        alunoActionsView.classList.remove('hidden');
        
        // Buscar Saldo
        const saldoData = await apiCall(`${apiUrls.alunos}/${alunoId}/saldo`, 'GET');
        if (saldoData && saldoData.saldo !== undefined) {
            alunoSaldo.textContent = `R$ ${saldoData.saldo.toFixed(2)}`;
        } else {
            alunoSaldo.textContent = 'Erro ao buscar saldo.';
        }

        // Buscar Extrato
        const extratoData = await apiCall(`${apiUrls.alunos}/${alunoId}/extrato-transacoes`, 'GET');
        alunoExtratoList.innerHTML = '';
        if (extratoData && extratoData.length > 0) {
            const table = createStatementTable(extratoData);
            alunoExtratoList.appendChild(table);
        } else {
            alunoExtratoList.innerHTML = '<p>Nenhuma transação encontrada.</p>';
        }
    };

    const handleProfessorActionSelect = async (e) => {
        const professorId = e.target.value;
        if (!professorId) {
            professorActionsView.classList.add('hidden');
            return;
        }
        professorActionsView.classList.remove('hidden');
        forms.distributeCoins.querySelector('#distribute-professor-id').value = professorId;

        // Buscar Extrato do Professor
        const extratoData = await apiCall(`${apiUrls.professores}/${professorId}/extrato`, 'GET');
        professorExtratoList.innerHTML = '';
        if (extratoData && extratoData.length > 0) {
            const table = createStatementTable(extratoData, true);
            professorExtratoList.appendChild(table);
        } else {
            professorExtratoList.innerHTML = '<p>Nenhum envio encontrado.</p>';
        }
    };

    const handleDistributeCoins = async (e) => {
        e.preventDefault();
        const professorId = forms.distributeCoins.querySelector('#distribute-professor-id').value;
        const formData = new FormData(forms.distributeCoins);
        const data = Object.fromEntries(formData.entries());
        data.alunoId = parseInt(data.alunoId, 10);
        data.quantidadeMoedas = parseFloat(data.quantidadeMoedas);

        const url = `${apiUrls.professores}/${professorId}/distruibuir-moedas`;
        const result = await apiCall(url, 'POST', data);

        if (result) {
            showToast('Moedas distribuídas com sucesso!', 'success');
            forms.distributeCoins.reset();
            // Recarregar extrato do professor
            handleProfessorActionSelect({ target: { value: professorId } });
        }
    };

    const createStatementTable = (transactions, isProfessor = false) => {
        const table = document.createElement('table');
        table.className = 'data-table';
        const headers = isProfessor ? ['Aluno', 'Moedas', 'Motivo', 'Data'] : ['Professor', 'Moedas', 'Motivo', 'Data'];
        table.innerHTML = `<thead><tr><th>${headers.join('</th><th>')}</th></tr></thead>`;
        const tbody = document.createElement('tbody');
        transactions.forEach(tx => {
            const row = document.createElement('tr');
            const target = isProfessor ? (tx.aluno ? tx.aluno.nome : 'N/A') : (tx.professor ? tx.professor.nome : 'N/A');
            row.innerHTML = `
                <td>${target}</td>
                <td>${tx.quantidadeMoedas.toFixed(2)}</td>
                <td>${tx.motivo}</td>
                <td>${new Date(tx.dataHora).toLocaleString()}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        return table;
    };

    // --- GERENCIAMENTO DE MODAIS E UTILITÁRIOS ---
    const openModal = (modal) => modal.setAttribute('aria-hidden', 'false');
    const closeModal = (modal) => modal.setAttribute('aria-hidden', 'true');
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    const init = async () => {
        // Event Listeners Gerais
        tabs.forEach(tab => tab.addEventListener('click', () => switchView(tab.dataset.tab)));
        document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', () => closeModal(el.closest('.modal'))));

        // Listeners de Formulário
        Object.values(forms).forEach(form => form.addEventListener('submit', handleFormSubmit));
        forms.distributeCoins.addEventListener('submit', handleDistributeCoins);

        // Listeners de Ações
        selectAlunoAcao.addEventListener('change', handleAlunoActionSelect);
        selectProfessorAcao.addEventListener('change', handleProfessorActionSelect);

        // Listeners de Botões de Exclusão
        document.getElementById('confirm-delete-aluno-btn').addEventListener('click', confirmDelete);
        document.getElementById('confirm-delete-empresa-btn').addEventListener('click', confirmDelete);
        document.getElementById('confirm-delete-professor-btn').addEventListener('click', confirmDelete);

        // Listener para Abrir Modal de Adição
        addBtn.addEventListener('click', () => {
            const entity = state.currentView.slice(0, -1); // aluno, empresa, professore
            const form = forms[entity];
            form.reset();
            document.getElementById(`${entity}-id`).value = '';
            document.getElementById(`form-${entity}-title`).textContent = `Cadastrar Novo ${capitalize(entity)}`;
            document.getElementById(`${entity}-senha-group`).classList.remove('hidden');
            openModal(modals[`form${capitalize(entity)}`]);
        });

        // Listeners para Listas (Edição/Exclusão)
        Object.keys(lists).forEach(entityType => {
            lists[entityType].addEventListener('click', (e) => {
                const card = e.target.closest('.card');
                if (!card) return;
                const id = card.dataset.id;
                const item = state[entityType].find(i => i.id == id);
                if (!item) return;

                if (e.target.closest('.edit-btn')) {
                    openEditModal(entityType.slice(0, -1), item);
                } else if (e.target.closest('.delete-btn')) {
                    openDeleteModal(entityType.slice(0, -1), item);
                }
            });
        });

        // Carga inicial
        await switchView('alunos');
    };

    // --- TOAST ---
    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            toast.addEventListener('animationend', () => toast.remove());
        }, 3000);
    };

    init();
});
