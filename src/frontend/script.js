const API = "/convidados";

const formCriar = document.getElementById('form-criar');
const formAtualizar = document.getElementById('form-atualizar');
const btnListar = document.getElementById('btn-listar');
const listaConvidados = document.getElementById('lista-convidados');
const listaRemocao = document.getElementById('lista-remocao');
const mensagemCriar = document.getElementById('mensagem-criar');
const mensagemAtualizar = document.getElementById('mensagem-atualizar');
const mensagemRemover = document.getElementById('mensagem-remover');

function limparMensagens() {
  if (mensagemCriar) mensagemCriar.textContent = '';
  if (mensagemAtualizar) mensagemAtualizar.textContent = '';
  if (mensagemRemover) mensagemRemover.textContent = '';
}

function mostrarMensagem(elemento, texto, tipo = 'ok') {
  if (!elemento) return;
  elemento.textContent = texto;
  elemento.className = `mensagem ${tipo}`;
}

function preencherFormularioAtualizacao(convidado) {
  document.getElementById('atualizar-id').value = convidado.id;
  document.getElementById('atualizar-nome').value = convidado.nome;
  document.getElementById('atualizar-email').value = convidado.email;
  document.getElementById('atualizar-telefone').value = convidado.telefone;
  window.scrollTo({ top: document.body.scrollHeight / 3, behavior: 'smooth' });
}

function criarItemLista(convidado) {
  const convidadoTexto = JSON.stringify(convidado).replace(/"/g, '&quot;');

  return `
    <li class="item-convidado">
      <div>
        <strong>#${convidado.id}</strong> - ${convidado.nome}<br>
        <span>${convidado.email}</span><br>
        <span>${convidado.telefone}</span>
      </div>
      <div class="acoes-item">
        <button type="button" class="btn btn-secundario" onclick="editarConvidado(${convidadoTexto})">Editar</button>
        <button type="button" class="btn btn-perigo" onclick="deletarConvidado(${convidado.id})">Excluir</button>
      </div>
    </li>
  `;
}

async function listarConvidados() {
  limparMensagens();

  try {
    const res = await fetch(API);
    const dados = await res.json();

    if (!res.ok) {
      throw new Error(dados.message || dados.error || 'Erro ao listar convidados');
    }

    listaConvidados.innerHTML = '';
    listaRemocao.innerHTML = '';

    if (!Array.isArray(dados) || dados.length === 0) {
      listaConvidados.innerHTML = '<li class="vazio">Nenhum convidado cadastrado ainda.</li>';
      listaRemocao.innerHTML = '<p class="vazio">Nenhum convidado para remover.</p>';
      return;
    }

    dados.forEach((convidado) => {
      listaConvidados.innerHTML += criarItemLista(convidado);
      listaRemocao.innerHTML += `
        <p class="linha-remocao">
          <strong>#${convidado.id}</strong> - ${convidado.nome}
          <button type="button" class="btn btn-perigo" onclick="deletarConvidado(${convidado.id})">Excluir</button>
        </p>
      `;
    });
  } catch (error) {
    listaConvidados.innerHTML = '<li class="vazio">Não foi possível carregar os convidados.</li>';
    listaRemocao.innerHTML = '<p class="vazio">Não foi possível carregar os convidados.</p>';
    mostrarMensagem(mensagemRemover, error.message, 'erro');
    console.error(error);
  }
}

async function criarConvidado(event) {
  event.preventDefault();
  limparMensagens();

  const nome = document.getElementById('criar-nome').value.trim();
  const email = document.getElementById('criar-email').value.trim();
  const telefone = document.getElementById('criar-telefone').value.trim();

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, telefone })
    });

    const dados = await res.json();

    if (!res.ok) {
      throw new Error(dados.message || dados.error || 'Erro ao criar convidado');
    }

    mostrarMensagem(mensagemCriar, 'Convidado criado com sucesso!', 'ok');
    formCriar.reset();
    await listarConvidados();
  } catch (error) {
    mostrarMensagem(mensagemCriar, error.message, 'erro');
    console.error(error);
  }
}

function editarConvidado(convidado) {
  limparMensagens();
  preencherFormularioAtualizacao(convidado);
}

async function atualizarConvidado(event) {
  event.preventDefault();
  limparMensagens();

  const id = document.getElementById('atualizar-id').value.trim();
  const nome = document.getElementById('atualizar-nome').value.trim();
  const email = document.getElementById('atualizar-email').value.trim();
  const telefone = document.getElementById('atualizar-telefone').value.trim();

  if (!id) {
    mostrarMensagem(mensagemAtualizar, 'Escolha um convidado na lista antes de atualizar.', 'erro');
    return;
  }

  try {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, telefone })
    });

    const dados = await res.json();

    if (!res.ok) {
      throw new Error(dados.message || dados.error || 'Erro ao atualizar convidado');
    }

    mostrarMensagem(mensagemAtualizar, 'Dados atualizados com sucesso!', 'ok');
    await listarConvidados();
  } catch (error) {
    mostrarMensagem(mensagemAtualizar, error.message, 'erro');
    console.error(error);
  }
}

async function deletarConvidado(id) {
  limparMensagens();

  const confirmar = window.confirm('Tem certeza que deseja excluir este convidado?');
  if (!confirmar) return;

  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    const dados = await res.json();

    if (!res.ok) {
      throw new Error(dados.message || dados.error || 'Erro ao remover convidado');
    }

    mostrarMensagem(mensagemRemover, 'Convidado removido com sucesso!', 'ok');
    await listarConvidados();
  } catch (error) {
    mostrarMensagem(mensagemRemover, error.message, 'erro');
    console.error(error);
  }
}

formCriar.addEventListener('submit', criarConvidado);
formAtualizar.addEventListener('submit', atualizarConvidado);
btnListar.addEventListener('click', listarConvidados);
window.editarConvidado = editarConvidado;
window.deletarConvidado = deletarConvidado;

listarConvidados();
