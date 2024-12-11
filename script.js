let gastos = [];
let saldoInicial = 0;
let totalGastos = 0;
let saldoDisponivel = 0;

// Carregar dados salvos
if (localStorage.getItem("gastos")) {
    gastos = JSON.parse(localStorage.getItem("gastos"));
}

if (localStorage.getItem("saldoInicial")) {
    saldoInicial = parseFloat(localStorage.getItem("saldoInicial"));
    document.getElementById("saldo-inicial").value = saldoInicial;
}

// Salvar dados após cada alteração
function salvarDados() {
    localStorage.setItem("gastos", JSON.stringify(gastos));
    localStorage.setItem("saldoInicial", saldoInicial);
}

document.getElementById("form-gastos").addEventListener("submit", function(event) {
    event.preventDefault();

    let data = document.getElementById("data").value;
    let descricao = document.getElementById("descricao").value;
    let valor = parseFloat(document.getElementById("valor").value);

    gastos.push({ data, descricao, valor });

    atualizarTabela();
    atualizarSaldo();
    salvarDados();
});

document.getElementById("definir-saldo").addEventListener("click", function() {
    saldoInicial = parseFloat(document.getElementById("saldo-inicial").value);
    totalGastos = 0;
    atualizarSaldo();
    salvarDados();
});

function atualizarTabela() {
    let corpoTabela = document.getElementById("corpo-tabela");
    corpoTabela.innerHTML = "";

    gastos.forEach(function(gasto, indice) {
        let linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${gasto.data}</td>
            <td>${gasto.descricao}</td>
            <td>R$ ${gasto.valor.toFixed(2)}</td>
            <td><button class="apagar-gasto" data-indice="${indice}">Apagar</button></td>
        `;
        corpoTabela.appendChild(linha);
    });

    let botoesApagar = document.querySelectorAll(".apagar-gasto");

    botoesApagar.forEach(function(botao) {
        botao.addEventListener("click", function() {
            let indice = botao.getAttribute("data-indice");
            gastos.splice(indice, 1);
            atualizarTabela();
            atualizarSaldo();
            salvarDados();
        });
    });
}

function atualizarSaldo() {
    totalGastos = gastos.reduce(function(soma, gasto) {
        return soma + gasto.valor;
    }, 0);

    saldoDisponivel = saldoInicial - totalGastos;

    document.getElementById("total-gastos").innerText = `Total de Gastos: R$ ${totalGastos.toFixed(2)}`;
    document.getElementById("saldo-disponivel").innerText = `Saldo Disponível: R$ ${saldoDisponivel.toFixed(2)}`;

    if (saldoDisponivel < 0) {
        document.getElementById("saldo-disponivel").style.color = "red";
    } else {
        document.getElementById("saldo-disponivel").style.color = "green";
    }
}

atualizarTabela();
atualizarSaldo();