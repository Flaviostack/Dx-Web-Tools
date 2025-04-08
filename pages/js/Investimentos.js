function calcularInvestimento() {
    var valorInicial = parseFloat(document.getElementById("ValorInicial").value);
    var taxa = parseFloat(document.getElementById("Taxa").value);
    var tempo = parseInt(document.getElementById("Tempo").value);

    if (isNaN(valorInicial) || isNaN(taxa) || isNaN(tempo)) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    var montante = CalcularCDB(valorInicial, taxa, tempo);
    document.getElementById("Valor-final").innerText = "R$ " + montante.toFixed(2);
}

function CalcularCDB(valorInicial, taxa, tempo) {
    // Cálculo do rendimento de um CDB
    // Fórmula: Montante = Valor Aplicado * (1 + Taxa de Juros) ^ Prazo
    var montante = valorInicial * Math.pow((1 + (taxa / 100)), tempo);
    //alert("O montante após " + tempo + " meses é: R$" + montante.toFixed(2));
    return montante;
}