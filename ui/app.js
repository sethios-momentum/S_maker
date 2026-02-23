let orders = [];

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if(user && pass) {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
  } else {
    alert("Veuillez remplir le nom et mot de passe");
  }
}

function addOrder() {
  const client = document.getElementById("client").value;
  const articlesSelect = document.getElementById("articles");
  const articles = Array.from(articlesSelect.selectedOptions).map(o => o.value);
  const prix = document.getElementById("prix").value;
  const statut = document.getElementById("statut").value;

  if(!client || articles.length === 0 || !prix) {
    alert("Remplissez tous les champs !");
    return;
  }

  const order = { client, articles, prix, statut };
  orders.push(order);
  renderOrders();

  document.getElementById("client").value = "";
  articlesSelect.selectedIndex = -1;
  document.getElementById("prix").value = "";
  document.getElementById("statut").value = "en cours";
}

function renderOrders() {
  const tbody = document.querySelector("#ordersTable tbody");
  tbody.innerHTML = "";
  orders.forEach(o => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${o.client}</td>
      <td>${o.articles.join(", ")}</td>
      <td>${o.prix}</td>
      <td>${o.statut}</td>
    `;
    tbody.appendChild(row);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector("#login button").addEventListener('click', login);
  document.querySelector(".order-form button").addEventListener('click', addOrder);
});