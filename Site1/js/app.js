// 🍪 COOKIES
function salvarIngredientes(lista) {
  document.cookie = "ingredientes=" + encodeURIComponent(JSON.stringify(lista)) + "; path=/";
}

function obterIngredientes() {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find(row => row.startsWith("ingredientes="));

  if (!cookie) return [];

  return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
}

// 🧭 NAVBAR
function destacarNavbar() {
  const pagina = window.location.pathname;

  if (pagina.endsWith("/") || pagina.includes("index.html")) {
    document.getElementById("btn-ingredientes")?.classList.add("btn-dark");
  }

  if (pagina.includes("ingredientes.html")) {
    document.getElementById("btn-receitas")?.classList.add("btn-dark");
  }

  if (pagina.includes("receita.html")) {
    document.getElementById("btn-receitas")?.classList.add("btn-dark");
    document.getElementById("btn-ingredientes")?.classList.add("btn-dark");
  }
}

// 🧺 INGREDIENTES
function gerarCheckboxes() {
  const container = document.getElementById("lista-ingredientes");
  if (!container) return;

  const selecionados = obterIngredientes();

  ingredientes.forEach(ing => {
    const div = document.createElement("div");
    div.className = "form-check";

    div.innerHTML = `
      <input class="form-check-input" type="checkbox" value="${ing}" ${selecionados.includes(ing) ? "checked" : ""}>
      <label class="form-check-label">${ing}</label>
    `;

    container.appendChild(div);
  });
}

function salvarSelecaoEVoltar() {
  const selecionados = [];

  document.querySelectorAll("input:checked").forEach(el => {
    selecionados.push(el.value);
  });

  salvarIngredientes(selecionados);
  window.location.href = "index.html";
}

function limparIngredientes() {
  document.cookie = "ingredientes=; path=/; max-age=0";
  location.reload();
}

// 🏠 RECEITAS
function receitaValida(receita, ingredientesUsuario) {
  return receita.obrigatorios.every(ing =>
    ingredientesUsuario.includes(ing)
  );
}

function renderizarReceitas() {
  const container = document.getElementById("lista-receitas");
  if (!container) return;

  const ingredientesUsuario = obterIngredientes();
  container.innerHTML = "";

  receitas.forEach(receita => {
    if (
      ingredientesUsuario.length === 0 ||
      receitaValida(receita, ingredientesUsuario)
    ) {
      const div = document.createElement("div");
      div.className = "col-md-4";

      div.innerHTML = `
    <div class="card mb-4 p-2">
        <div class="d-flex align-items-center">

                 <img src="${receita.foto}" class="img-receita me-3">

        <div class="card-body p-0">
        <h5 class="text-white">${receita.nome}</h5>
        <a href="receita.html?id=${receita.id}" class="btn btn-primary">
          Ver receita
        </a>
      </div>

    </div>
  </div>
`;

      container.appendChild(div);
    }
  });
}

// 📖 RECEITA
function carregarReceita() {
  const container = document.getElementById("detalhes-receita");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  const receita = receitas.find(r => r.id === id);
  if (!receita) return;

  const ingredientesUsuario = obterIngredientes();

  const lista = receita.obrigatorios.concat(receita.opcionais)
    .map(ing => {
      const tem = ingredientesUsuario.includes(ing);
      return `<li class="${tem ? "text-success" : "text-danger"}">${ing}</li>`;
    })
    .join("");

  container.innerHTML = `
    <h2>${receita.nome}</h2>
    <img src="${receita.foto}" class="img-receita me-3">
    <h4>Ingredientes:</h4>
    <ul>${lista}</ul>
    <h4>Modo de preparo:</h4>
    <p>${receita.modoPreparo}</p>
  `;
}

// 🚀 INIT
document.addEventListener("DOMContentLoaded", () => {
  destacarNavbar();
  gerarCheckboxes();
  renderizarReceitas();
  carregarReceita();
});
