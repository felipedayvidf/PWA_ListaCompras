let saldoInicial = 0;
let totalGasto = 0;

function definirSaldo() {
  saldoInicial = Number(document.getElementById("saldoInicial").value) || 0;
  totalGasto = 0;

  document.getElementById("listaCompras").innerHTML = "";
  atualizarTotal();
}

function adicionarItem() {
  const descricao = document.getElementById("descricao").value;
  const quantidade = Number(document.getElementById("quantidade").value);
  const valorUnitario = Number(document.getElementById("valorUnitario").value);

  if (!descricao || quantidade <= 0 || valorUnitario <= 0) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const totalItem = quantidade * valorUnitario;
  totalGasto += totalItem;

  const li = document.createElement("li");

  li.innerHTML = `
    <div>
      <strong>${descricao}</strong><br>
      ${quantidade} x R$ ${valorUnitario.toFixed(2)}<br>
      <strong>Total:</strong> R$ ${totalItem.toFixed(2)}
    </div>
    <div class="acoes">
      <button class="editar">✏️</button>
      <button class="remover">❌</button>
    </div>
  `;

  // REMOVER
  li.querySelector(".remover").addEventListener("click", () => {
    totalGasto -= totalItem;
    li.remove();
    atualizarTotal();
  });

  // EDITAR
  li.querySelector(".editar").addEventListener("click", () => {
    totalGasto -= totalItem;
    atualizarTotal();

    document.getElementById("descricao").value = descricao;
    document.getElementById("quantidade").value = quantidade;
    document.getElementById("valorUnitario").value = valorUnitario;

    li.remove();
  });

  document.getElementById("listaCompras").appendChild(li);
  atualizarTotal();

  limparCampos();
}

function atualizarTotal() {
  document.getElementById("totalGasto").innerText = totalGasto.toFixed(2);
  document.getElementById("saldoRestante").innerText =
    (saldoInicial - totalGasto).toFixed(2);
}

function limparCampos() {
  document.getElementById("descricao").value = "";
  document.getElementById("quantidade").value = "";
  document.getElementById("valorUnitario").value = "";
}

// Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

function limparTudo() {
  if (!confirm("Deseja limpar toda a lista e reiniciar?")) {
    return;
  }

  totalGasto = 0;
  document.getElementById("listaCompras").innerHTML = "";

  atualizarTotal();
  limparCampos();
}

function gerarNota() {
  if (document.getElementById("listaCompras").children.length === 0) {
    alert("A lista está vazia.");
    return;
  }

  let texto = "LISTA DE COMPRAS\n";
  texto += "-------------------------\n";

  const itens = document.querySelectorAll("#listaCompras li");

  itens.forEach(item => {
    const conteudoItem = item.querySelector("div").innerText;

    texto += conteudoItem + "\n";
    texto += "-------------------------\n";
  });

  texto += `TOTAL GASTO: R$ ${totalGasto.toFixed(2)}\n`;
  texto += `SALDO RESTANTE: R$ ${(saldoInicial - totalGasto).toFixed(2)}\n`;

  document.getElementById("conteudoNota").innerText = texto;
  abrirModal();
}

function copiarNota() {
  const texto = document.getElementById("conteudoNota").innerText;

  navigator.clipboard.writeText(texto)
  .then(() => alert("Nota copiada!"))
  .catch(() => alert("Erro ao copiar"));
}

function abrirModal() {
  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

function reiniciarTudo() {
  fecharModal();
  limparTudo();
}
