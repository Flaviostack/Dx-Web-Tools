function calcularInvestimento() {
    var valorInicial = parseFloat(document.getElementById("ValorInicial").value);
    var taxa = parseFloat(document.getElementById("Taxa").value);
    var tempo = parseInt(document.getElementById("Tempo").value);
    var aporteMensal = parseFloat(document.getElementById("AporteMensal").value);

    if (isNaN(valorInicial) || isNaN(taxa) || isNaN(tempo) || valorInicial <= 0 || taxa <= 0 || tempo <= 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    // Chama a função CalcularCDB e passa todos os valores necessários
    var resultados = CalcularCDB(valorInicial, taxa, tempo, aporteMensal);

    // Atualiza os elementos no HTML com os resultados
    document.getElementById("Juros-Simples").innerText = "Juros Simples: R$ " + resultados.jurosSimples.toFixed(2);
    document.getElementById("Juros-Compostos").innerText = "Juros Compostos: R$ " + resultados.jurosCompostos.toFixed(2);
}

function CalcularCDB(valorInicial, taxa, tempo, aporteMensal) {
    // Cálculo do rendimento de um CDB
    if (aporteMensal > 0) {
        // Se houver aporte mensal, calcula o montante total
        var montanteTotal = valorInicial * Math.pow((1 + (taxa / 100)), tempo) + (aporteMensal * ((Math.pow((1 + (taxa / 100)), tempo) - 1) / (taxa / 100)));
        return {
            jurosSimples: montanteTotal,
            jurosCompostos: montanteTotal
        };
    }

    if (aporteMensal == 0 || isNaN(aporteMensal)) {
        var montanteJurosSimples = valorInicial * (1 + (taxa / 100) * tempo);
        var montanteJurosCompostos = valorInicial * Math.pow((1 + (taxa / 100)), tempo);
    }

    // Retorna ambos os valores como um objeto
    return {
        jurosSimples: montanteJurosSimples,
        jurosCompostos: montanteJurosCompostos
    };
}