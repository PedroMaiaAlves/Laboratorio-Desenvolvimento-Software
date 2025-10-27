document.addEventListener('DOMContentLoaded', () => {
    const apiUrls = {
        alunos: 'http://localhost:8080/alunos',
        empresas: 'http://localhost:8080/empresas',
    };

    let currentView = 'alunos'; // 'alunos' ou 'empresas'

    // --- SELETORES GERAIS ---
    const mainTitle = document.getElementById('main-title');
    const addBtn = document.getElementById('add-btn');
    const addBtnText = document.getElementById('add-btn-text');
    const toastContainer = document.getElementById('toast-container');
    const tabs = document.querySelectorAll('.tab-btn');

    // --- SELETORES DE ALUNOS ---
    const mainContentAlunos = document.getElementById('main-content-alunos');
    const alunosList = document.getElementById('alunos-list');
    const formAlunoModal = document.getElementById('form-aluno-modal');
    const deleteAlunoConfirmModal = document.getElementById('delete-aluno-confirm-modal');
    const alunoForm = document.getElementById('aluno-form');
    const alunoIdInput = document.getElementById('aluno-id');
    const formAlunoTitle = document.getElementById('form-aluno-title');
    const senhaGroup = document.getElementById('senha-group');
    const deleteAlunoName = document.getElementById('delete-aluno-name');
    const confirmDeleteAlunoBtn = document.getElementById('confirm-delete-aluno-btn');
    const alunoDetailView = document.getElementById('aluno-detail-view');
    const backToListBtn = document.getElementById('back-to-list-btn');
    const detailAlunoNome = document.getElementById('detail-aluno-nome');
    const detailAlunoEmail = document.getElementById('detail-aluno-email');
    const detailAlunoCpf = document.getElementById('detail-aluno-cpf');
    const detailAlunoRg = document.getElementById('detail-aluno-rg');
    const detailAlunoEndereco = document.getElementById('detail-aluno-endereco');

    // --- SELETORES DE EMPRESAS ---
    const mainContentEmpresas = document.getElementById('main-content-empresas');
    const empresasList = document.getElementById('empresas-list');
    const formEmpresaModal = document.getElementById('form-empresa-modal');
    const deleteEmpresaConfirmModal = document.getElementById('delete-empresa-confirm-modal');
    const empresaForm = document.getElementById('empresa-form');
    const empresaIdInput = document.getElementById('empresa-id');
    const formEmpresaTitle = document.getElementById('form-empresa-title');
    const empresaSenhaGroup = document.getElementById('empresa-senha-group');
    const deleteEmpresaName = document.getElementById('delete-empresa-name');
    const confirmDeleteEmpresaBtn = document.getElementById('confirm-delete-empresa-btn');

    let currentAlunoId = null;
    let currentEmpresaId = null;

    // --- FUNÇÕES DE API GENÉRICAS ---
    const fetchData = async (entity) => {
        try {
            const response = await fetch(`${apiUrls[entity]}/all`);
            if (!response.ok) throw new Error(`Erro ao buscar ${entity}.`);
            return await response.json();
        } catch (error) {
            showToast(error.message, 'error');
            return [];
        }
    };

    const fetchSingle = async (entity, id) => {
        try {
            const url = entity === 'alunos' ? `${apiUrls.alunos}/view/${id}` : `${apiUrls.empresas}/view/${id}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`${entity.slice(0, -1)} não encontrado.`);
            return await response.json();
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    // --- FUNÇÕES DA API (ALUNOS) ---
    const createAluno = async (aluno) => {
        try {
            const response = await fetch(`${apiUrls.alunos}/cadastrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aluno),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Erro ao criar aluno.' }));
                throw new Error(errorData.message || 'Erro ao criar aluno.');
            }
            return await response.json();
        } catch (error) {
            showToast(error.message, 'error');
            return null;
        }
    };

    const updateAluno = async (id, aluno) => {
        try {
            const response = await fetch(`${apiUrls.alunos}/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aluno),
            });
            if (!response.ok) {
                 const errorData = await response.json().catch(() => ({ message: 'Erro ao atualizar aluno.' }));
                throw new Error(errorData.message || 'Erro ao atualizar aluno.');
            }
            return await response.json();
        } catch (error) {
            showToast(error.message, 'error');
            return null;
        }
    };

    const deleteAluno = async (id) => {
        try {
            const response = await fetch(`${apiUrls.alunos}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Erro ao deletar aluno.');
            return true;
        } catch (error) {
            showToast(error.message, 'error');
            return false;
        }
    };

    // --- FUNÇÕES DA API (EMPRESAS) ---
    const createEmpresa = async (empresa) => {
        try {
            const response = await fetch(`${apiUrls.empresas}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(empresa),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Erro ao criar empresa.' }));
                throw new Error(errorData.message || 'Erro ao criar empresa.');
            }
            return await response.json();
        } catch (error) {
            showToast(error.message, 'error');
            return null;
        }
    };

    const updateEmpresa = async (id, empresa) => {
        try {
            const response = await fetch(`${apiUrls.empresas}/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(empresa),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Erro ao atualizar empresa.' }));
                throw new Error(errorData.message || 'Erro ao atualizar empresa.');
            }
            return await response.json();
        } catch (error) {
            showToast(error.message, 'error');
            return null;
        }
    };

    const deleteEmpresa = async (id) => {
        try {
            const response = await fetch(`${apiUrls.empresas}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Erro ao deletar empresa.');
            return true;
        } catch (error) {
            showToast(error.message, 'error');
            return false;
        }
    };

    // --- RENDERIZAÇÃO ---
    const renderAlunos = (alunos) => {
        alunosList.innerHTML = '';
        if (alunos.length === 0) {
            alunosList.innerHTML = '<p>Nenhum aluno cadastrado.</p>';
            return;
        }
        alunos.forEach(aluno => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.id = aluno.id;
            card.innerHTML = `
                <div class="card-content">
                    <h3>${aluno.nome}</h3>
                    <p>${aluno.email}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-icon edit-btn" data-id="${aluno.id}" aria-label="Editar" title="Editar"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg></button>
                    <button class="btn-icon delete-btn" data-id="${aluno.id}" aria-label="Excluir" title="Excluir"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg></button>
                </div>
            `;
            alunosList.appendChild(card);
        });
    };

    const renderEmpresas = (empresas) => {
        empresasList.innerHTML = '';
        if (empresas.length === 0) {
            empresasList.innerHTML = '<p>Nenhuma empresa cadastrada.</p>';
            return;
        }
        empresas.forEach(empresa => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.id = empresa.id;
            card.innerHTML = `
                <div class="card-content">
                    <h3>${empresa.razaoSocial}</h3>
                    <p>CNPJ: ${empresa.cnpj} | Tel: ${empresa.telefone}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-icon edit-btn" data-id="${empresa.id}" aria-label="Editar" title="Editar"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg></button>
                    <button class="btn-icon delete-btn" data-id="${empresa.id}" aria-label="Excluir" title="Excluir"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg></button>
                </div>
            `;
            empresasList.appendChild(card);
        });
    };

    const loadData = async () => {
        showListView();
        if (currentView === 'alunos') {
            const alunos = await fetchData('alunos');
            renderAlunos(alunos);
        } else {
            const empresas = await fetchData('empresas');
            renderEmpresas(empresas);
        }
    };

    // --- NAVEGAÇÃO E VISIBILIDADE ---
    const showListView = () => {
        alunoDetailView.classList.add('hidden');
        document.querySelector('header').classList.remove('hidden');
        if (currentView === 'alunos') {
            mainContentAlunos.classList.remove('hidden');
            mainContentEmpresas.classList.add('hidden');
        } else {
            mainContentAlunos.classList.add('hidden');
            mainContentEmpresas.classList.remove('hidden');
        }
    };

    const showDetailView = () => {
        mainContentAlunos.classList.add('hidden');
        mainContentEmpresas.classList.add('hidden');
        document.querySelector('header').classList.add('hidden');
        alunoDetailView.classList.remove('hidden');
    };

    const switchView = (view) => {
        currentView = view;
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === view);
        });

        if (view === 'alunos') {
            mainTitle.textContent = 'Alunos';
            addBtnText.textContent = 'Novo Aluno';
        } else {
            mainTitle.textContent = 'Empresas';
            addBtnText.textContent = 'Nova Empresa';
        }
        loadData();
    };

    // --- GERENCIAMENTO DE MODAIS ---
    const openModal = (modal) => modal.setAttribute('aria-hidden', 'false');
    const closeModal = (modal) => modal.setAttribute('aria-hidden', 'true');

    document.querySelectorAll('[data-close]').forEach(el => {
        el.addEventListener('click', () => closeModal(el.closest('.modal')));
    });

    // --- LÓGICA DE EVENTOS ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchView(tab.dataset.tab));
    });

    addBtn.addEventListener('click', () => {
        if (currentView === 'alunos') {
            formAlunoTitle.textContent = 'Cadastrar Novo Aluno';
            alunoForm.reset();
            alunoIdInput.value = '';
            senhaGroup.style.display = 'block';
            document.getElementById('senha').required = true;
            openModal(formAlunoModal);
        } else {
            formEmpresaTitle.textContent = 'Cadastrar Nova Empresa';
            empresaForm.reset();
            empresaIdInput.value = '';
            empresaSenhaGroup.style.display = 'block';
            document.getElementById('empresa-senha').required = true;
            openModal(formEmpresaModal);
        }
    });

    backToListBtn.addEventListener('click', loadData);

    // Eventos da lista de Alunos
    alunosList.addEventListener('click', async (e) => {
        const card = e.target.closest('.card');
        if (!card) return;

        const id = card.dataset.id;
        const isEditButton = e.target.closest('.edit-btn');
        const isDeleteButton = e.target.closest('.delete-btn');

        if (isEditButton) {
            const aluno = await fetchSingle('alunos', id);
            if (aluno) {
                formAlunoTitle.textContent = 'Editar Aluno';
                alunoIdInput.value = aluno.id;
                document.getElementById('nome').value = aluno.nome;
                document.getElementById('email').value = aluno.email;
                document.getElementById('cpf').value = aluno.cpf;
                document.getElementById('rg').value = aluno.rg;
                document.getElementById('endereco').value = aluno.endereco;
                senhaGroup.style.display = 'none';
                document.getElementById('senha').required = false;
                openModal(formAlunoModal);
            }
        } else if (isDeleteButton) {
            const aluno = await fetchSingle('alunos', id);
            if (aluno) {
                currentAlunoId = aluno.id;
                deleteAlunoName.textContent = aluno.nome;
                openModal(deleteAlunoConfirmModal);
            }
        } else {
            const aluno = await fetchSingle('alunos', id);
            if (aluno) {
                detailAlunoNome.textContent = aluno.nome;
                detailAlunoEmail.textContent = aluno.email;
                detailAlunoCpf.textContent = aluno.cpf;
                detailAlunoRg.textContent = aluno.rg;
                detailAlunoEndereco.textContent = aluno.endereco;
                showDetailView();
            }
        }
    });

    // Eventos da lista de Empresas
    empresasList.addEventListener('click', async (e) => {
        const card = e.target.closest('.card');
        if (!card) return;

        const id = card.dataset.id;
        const isEditButton = e.target.closest('.edit-btn');
        const isDeleteButton = e.target.closest('.delete-btn');

        if (isEditButton) {
            const empresa = await fetchSingle('empresas', id);
            if (empresa) {
                formEmpresaTitle.textContent = 'Editar Empresa';
                empresaIdInput.value = empresa.id;
                document.getElementById('razaoSocial').value = empresa.razaoSocial;
                document.getElementById('cnpj').value = empresa.cnpj;
                document.getElementById('empresa-email').value = empresa.email;
                document.getElementById('telefone').value = empresa.telefone;
                empresaSenhaGroup.style.display = 'none';
                document.getElementById('empresa-senha').required = false;
                openModal(formEmpresaModal);
            }
        } else if (isDeleteButton) {
            const empresa = await fetchSingle('empresas', id);
            if (empresa) {
                currentEmpresaId = empresa.id;
                deleteEmpresaName.textContent = empresa.razaoSocial;
                openModal(deleteEmpresaConfirmModal);
            }
        } 
        // Não há tela de detalhe para empresa, então não há 'else'
    });

    // Submissão de formulários
    alunoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('[type="submit"]');
        btn.disabled = true;

        const id = alunoIdInput.value;
        const formData = new FormData(alunoForm);
        const data = Object.fromEntries(formData.entries());

        let result;
        if (id) {
            const payload = { nome: data.nome, email: data.email, cpf: data.cpf, rg: data.rg, endereco: data.endereco };
            result = await updateAluno(id, payload);
        } else {
            result = await createAluno(data);
        }

        if (result) {
            closeModal(formAlunoModal);
            showToast(`Aluno ${id ? 'atualizado' : 'criado'} com sucesso!`, 'success');
            loadData();
        }
        btn.disabled = false;
    });

    empresaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('[type="submit"]');
        btn.disabled = true;

        const id = empresaIdInput.value;
        const formData = new FormData(empresaForm);
        const data = Object.fromEntries(formData.entries());

        let result;
        if (id) {
            const payload = { razaoSocial: data.razaoSocial, cnpj: data.cnpj, telefone: data.telefone };
            result = await updateEmpresa(id, payload);
        } else {
            result = await createEmpresa(data);
        }

        if (result) {
            closeModal(formEmpresaModal);
            showToast(`Empresa ${id ? 'atualizada' : 'criada'} com sucesso!`, 'success');
            loadData();
        }
        btn.disabled = false;
    });

    // Confirmação de exclusão
    confirmDeleteAlunoBtn.addEventListener('click', async () => {
        if (currentAlunoId) {
            const success = await deleteAluno(currentAlunoId);
            if (success) {
                closeModal(deleteAlunoConfirmModal);
                showToast('Aluno excluído com sucesso!', 'success');
                loadData();
            }
            currentAlunoId = null;
        }
    });

    confirmDeleteEmpresaBtn.addEventListener('click', async () => {
        if (currentEmpresaId) {
            const success = await deleteEmpresa(currentEmpresaId);
            if (success) {
                closeModal(deleteEmpresaConfirmModal);
                showToast('Empresa excluída com sucesso!', 'success');
                loadData();
            }
            currentEmpresaId = null;
        }
    });

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

    // --- INICIALIZAÇÃO ---
    loadData();
});