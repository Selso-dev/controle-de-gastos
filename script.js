let gastos = [];
let saldoInicial = 0;
let totalGastos = 0;
let saldoDisponivel = 0;

// Carregar dados salvos do localStorage
if (localStorage.getItem("gastos")) {
    gastos = JSON.parse(localStorage.getItem("gastos"));
}

if (localStorage.getItem("saldoInicial")) {
    saldoInicial = parseFloat(localStorage.getItem("saldoInicial"));
    document.getElementById("saldo-inicial").value = saldoInicial;
}

// Função para salvar dados no localStorage
function salvarDados() {
    localStorage.setItem("gastos", JSON.stringify(gastos));
    localStorage.setItem("saldoInicial", saldoInicial);
}

// Atualizar tabela de gastos
function atualizarTabela() {
    let corpoTabela = document.getElementById("corpo-tabela");
    corpoTabela.innerHTML = "";

    gastos.forEach((gasto, indice) => {
        let linha = document.createElement("tr");

        // Adiciona uma classe se o gasto estiver marcado como pago
        if (gasto.pago) {
            linha.classList.add("pago");
        }

        linha.innerHTML = `
            <td>${gasto.data}</td>
            <td>${gasto.descricao}</td>
            <td>R$ ${gasto.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>
                <button class="marcar-pago" data-indice="${indice}">
                    ${gasto.pago ? "Desmarcar" : "Pago"}
                </button>
                <button class="editar-gasto" data-indice="${indice}">Editar</button>
                <button class="apagar-gasto" data-indice="${indice}">Apagar</button>
            </td>
        `;

        corpoTabela.appendChild(linha);
    });

    // Função para marcar/desmarcar como pago
    document.querySelectorAll(".marcar-pago").forEach((botao) => {
        botao.addEventListener("click", function () {
            let indice = botao.getAttribute("data-indice");
            gastos[indice].pago = !gastos[indice].pago; // Alternar entre pago e não pago
            salvarDados();
            atualizarTabela();
        });
    });

    // Função para apagar gasto
    document.querySelectorAll(".apagar-gasto").forEach((botao) => {
        botao.addEventListener("click", function () {
            let indice = botao.getAttribute("data-indice");
            gastos.splice(indice, 1);
            salvarDados();
            atualizarTabela();
            atualizarSaldo();
        });
    });

    // Função para editar gasto
    document.querySelectorAll(".editar-gasto").forEach((botao) => {
        botao.addEventListener("click", function () {
            let indice = botao.getAttribute("data-indice");
            let gasto = gastos[indice];

            document.getElementById("data").value = gasto.data;
            document.getElementById("descricao").value = gasto.descricao;
            document.getElementById("valor").value = gasto.valor.toFixed(2).replace(".", ",");

            gastos.splice(indice, 1); // Remove o gasto antigo
            salvarDados();
            atualizarTabela();
            atualizarSaldo();
        });
    });
}

// Atualizar saldo
function atualizarSaldo() {
    totalGastos = gastos.reduce((soma, gasto) => soma + gasto.valor, 0);

    saldoDisponivel = parseFloat((saldoInicial - totalGastos).toFixed(2));

    document.getElementById("total-gastos").innerText = `Total de Gastos: R$ ${totalGastos.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
    document.getElementById("saldo-disponivel").innerText = `Saldo Disponível: R$ ${saldoDisponivel.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

    document.getElementById("saldo-disponivel").style.color = saldoDisponivel < 0 ? "red" : "green";
}

// Lógica para adicionar novos gastos
document.getElementById("form-gastos").addEventListener("submit", function (event) {
    event.preventDefault();

    let data = document.getElementById("data").value;
    let descricao = document.getElementById("descricao").value;
    let valor = parseFloat(document.getElementById("valor").value.replace(",", "."));

    if (!isNaN(valor)) {
        gastos.push({ data, descricao, valor, pago: false }); // Adiciona propriedade "pago"
        salvarDados();
        atualizarTabela();
        atualizarSaldo();
    } else {
        alert("Por favor, insira um valor numérico válido.");
    }
});

// Definir saldo inicial
document.getElementById("definir-saldo").addEventListener("click", function () {
    let saldoInput = parseFloat(document.getElementById("saldo-inicial").value.replace(",", "."));
    if (!isNaN(saldoInput)) {
        saldoInicial = saldoInput;
        salvarDados();
        atualizarSaldo();
    } else {
        alert("Por favor, insira um saldo inicial válido.");
    }
});

// Inicializar
atualizarTabela();
atualizarSaldo();