const API = "/convidados";

const formCriar = document.getElementById("form-criar-convidado");
const formAtualizar = document.getElementById("form-atualizar-convidado");
const botaoListar = document.getElementById("btn-listar-convidados");
const lista = document.getElementById("lista-convidados");
const listaRemover = document.getElementById("lista-convidados-remover");
const mensagem = document.getElementById("mensagem-status");

function mostrarMensagem(texto, isErro = false) {
  if (!mensagem) return;
  mensagem.textContent = texto;
  mensagem.style.color = isErro ? "#b00020" : "#0a7d32";
}

function limparMensagem() {
  if (!mensagem) return;
  mensagem.textContent = "";
}

function escaparHtml(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function tratarResposta(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || data.error || "Erro na requisição");
  }
  return data;
}

async function listarConvidados() {
  limparMensagem();
  try {
    const res = await fetch(API);
    const convidados = await tratarResposta(res);

    if (!Array.isArray(convidados) || convidados.length === 0) {
      lista.innerHTML = "<p>Nenhum convidado cadastrado.</p>";
      listaRemover.innerHTML = "<p>Nenhum convidado para remover.</p>";
      return;
    }

    lista.innerHTML = convidados.map(c => `
      <div class="item-convidado">
        <strong>ID ${c.id}</strong><br>
        ${escaparHtml(c.nome)}<br>
        ${escaparHtml(c.email)}<br>
        ${escaparHtml(c.telefone)}<br>
        <button type="button" onclick="prepararEdicao(${c.id}, '${escaparHtml(c.nome)}', '${escaparHtml(c.email)}', '${escaparHtml(c.telefone)}')">Editar</button>
      </div>
    `).join("");

    listaRemover.innerHTML = convidados.map(c => `
      <div class="item-convidado">
        <strong>ID ${c.id}</strong> - ${escaparHtml(c.nome)}
        <button type="button" onclick="deletarConvidado(${c.id})">Excluir</button>
      </div>
    `).join("");
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function criarConvidado(event) {
  event.preventDefault();
  limparMensagem();

  const nome = document.getElementById("criar-nome").value.trim();
  const email = document.getElementById("criar-email").value.trim();
  const telefone = document.getElementById("criar-telefone").value.trim();

  if (!nome || !email || !telefone) {
    mostrarMensagem("Preencha nome, e-mail e telefone.", true);
    return;
  }

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, telefone })
    });

    const data = await tratarResposta(res);
    mostrarMensagem(data.message || "Convidado criado com sucesso.");
    formCriar.reset();
    await listarConvidados();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

function prepararEdicao(id, nome, email, telefone) {
  document.getElementById("atualizar-id").value = id;
  document.getElementById("atualizar-nome").value = nome;
  document.getElementById("atualizar-email").value = email;
  document.getElementById("atualizar-telefone").value = telefone;
  mostrarMensagem(`Convidado ${id} carregado para edição.`);
}

async function atualizarConvidado(event) {
  event.preventDefault();
  limparMensagem();

  const id = document.getElementById("atualizar-id").value.trim();
  const nome = document.getElementById("atualizar-nome").value.trim();
  const email = document.getElementById("atualizar-email").value.trim();
  const telefone = document.getElementById("atualizar-telefone").value.trim();

  if (!id || !nome || !email || !telefone) {
    mostrarMensagem("Preencha ID, nome, e-mail e telefone para atualizar.", true);
    return;
  }

  try {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, telefone })
    });

    const data = await tratarResposta(res);
    mostrarMensagem(data.message || "Convidado atualizado com sucesso.");
    await listarConvidados();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function deletarConvidado(id) {
  limparMensagem();
  try {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    const data = await tratarResposta(res);
    mostrarMensagem(data.message || "Convidado removido com sucesso.");
    await listarConvidados();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

formCriar?.addEventListener("submit", criarConvidado);
formAtualizar?.addEventListener("submit", atualizarConvidado);
botaoListar?.addEventListener("click", listarConvidados);
window.prepararEdicao = prepararEdicao;
window.deletarConvidado = deletarConvidado;
window.addEventListener("DOMContentLoaded", listarConvidados);
