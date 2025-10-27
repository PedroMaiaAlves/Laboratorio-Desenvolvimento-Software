document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:8080/alunos';

    // --- SELETORES DO DOM ---
    const mainContent = document.getElementById('main-content');
    const alunosList = document.getElementById('alunos-list');
    const addAlunoBtn = document.getElementById('add-aluno-btn');

    // Views
    const alunoDetailView = document.getElementById('aluno-detail-view');
    const backToListBtn = document.getElementById('back-to-list-btn');

    // Modais
    const formAlunoModal = document.getElementById('form-aluno-modal');
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');

    // Formulário
    const alunoForm = document.getElementById('aluno-form');
    const alunoIdInput = document.getElementById('aluno-id');
    const formTitle = document.getElementById('form-aluno-title');
    const senhaGroup = document.getElementById('senha-group');
    const formSubmitBtn = document.getElementById('form-submit-btn');

    // Detalhes e confirmação
    const deleteAlunoName = document.getElementById('delete-aluno-name');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const toastContainer = document.getElementById('toast-container');

    // Campos da tela de detalhes
    const detailAlunoNome = document.getElementById('detail-aluno-nome');
    const detailAlunoEmail = document.getElementById('detail-aluno-email');
    const detailAlunoCpf = document.getElementById('detail-aluno-cpf');
    const detailAlunoRg = document.getElementById('detail-aluno-rg');
    const detailAlunoEndereco = document.getElementById('detail-aluno-endereco');

    let currentAlunoId = null;

    // --- FUNÇÕES DA API (sem alterações) ---
    const fetchAlunos = async () => {
        try {
            const response = await fetch(`${apiUrl}/all`);
            if (!response.ok) throw new Error('Erro ao buscar alunos.');
            return await response.json();
        } catch (error) {
            showToast(error.message, 'error');
            return [];
        }
    };

    const fetchAluno = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/view/${id}`);
            if (!response.ok) throw new Error('Aluno não encontrado.');
            return await response.json();
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const createAluno = async (aluno) => {
        try {
            const response = await fetch(`${apiUrl}/cadastrar`, {
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
            const response = await fetch(`${apiUrl}/update/${id}`, {
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
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Erro ao deletar aluno.');
            return true;
        } catch (error) {
            showToast(error.message, 'error');
            return false;
        }
    };

    // --- RENDERIZAÇÃO E NAVEGAÇÃO ---
    const renderAlunos = (alunos) => {
        alunosList.innerHTML = '';
        if (alunos.length === 0) {
            alunosList.innerHTML = '<p>Nenhum aluno cadastrado.</p>';
            return;
        }
        alunos.forEach(aluno => {
            const card = document.createElement('div');
            card.className = 'aluno-card';
            card.dataset.id = aluno.id;
            card.innerHTML = `
                <div class="aluno-card-content">
                    <h3>${aluno.nome}</h3>
                    <p>${aluno.email}</p>
                </div>
                <div class="aluno-card-actions">
                    <button class="btn-icon edit-btn" data-id="${aluno.id}" aria-label="Editar" title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg>
                    </button>
                    <button class="btn-icon delete-btn" data-id="${aluno.id}" aria-label="Excluir" title="Excluir">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                    </button>
                </div>
            `;
            alunosList.appendChild(card);
        });
    };

    const loadAlunos = async () => {
        showListView();
        const alunos = await fetchAlunos();
        renderAlunos(alunos);
    };

    const showListView = () => {
        alunoDetailView.classList.add('hidden');
        mainContent.classList.remove('hidden');
        document.querySelector('header').classList.remove('hidden');
    };

    const showDetailView = () => {
        mainContent.classList.add('hidden');
        document.querySelector('header').classList.add('hidden');
        alunoDetailView.classList.remove('hidden');
    };

    // --- GERENCIAMENTO DE MODAIS ---
    const openModal = (modal) => modal.setAttribute('aria-hidden', 'false');
    const closeModal = (modal) => modal.setAttribute('aria-hidden', 'true');

    document.querySelectorAll('[data-close]').forEach(el => {
        el.addEventListener('click', () => closeModal(el.closest('.modal')));
    });

    // --- LÓGICA DE EVENTOS ---
    addAlunoBtn.addEventListener('click', () => {
        formTitle.textContent = 'Cadastrar Novo Aluno';
        alunoForm.reset();
        alunoIdInput.value = '';
        senhaGroup.style.display = 'block';
        document.getElementById('senha').required = true;
        openModal(formAlunoModal);
    });

    backToListBtn.addEventListener('click', loadAlunos);

    alunosList.addEventListener('click', async (e) => {
        const card = e.target.closest('.aluno-card');
        if (!card) return;

        const id = card.dataset.id;
        const isEditButton = e.target.closest('.edit-btn');
        const isDeleteButton = e.target.closest('.delete-btn');

        if (isEditButton) {
            const aluno = await fetchAluno(id);
            if (aluno) {
                formTitle.textContent = 'Editar Aluno';
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
            const aluno = await fetchAluno(id);
            if (aluno) {
                currentAlunoId = aluno.id;
                deleteAlunoName.textContent = aluno.nome;
                openModal(deleteConfirmModal);
            }
        } else {
            // Se não for botão de ação, é o card
            const aluno = await fetchAluno(id);
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

    alunoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formSubmitBtn.disabled = true;

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
            loadAlunos();
        }

        formSubmitBtn.disabled = false;
    });

    confirmDeleteBtn.addEventListener('click', async () => {
        if (currentAlunoId) {
            const success = await deleteAluno(currentAlunoId);
            if (success) {
                closeModal(deleteConfirmModal);
                showToast('Aluno excluído com sucesso!', 'success');
                loadAlunos();
            }
            currentAlunoId = null;
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
    loadAlunos();
});
