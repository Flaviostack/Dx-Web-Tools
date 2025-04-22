function calcularInvestimento() {
    var valorInicial = parseFloat(document.getElementById("ValorInicial").value);
    var taxa = parseFloat(document.getElementById("Taxa").value);
    var tempo = parseInt(document.getElementById("Tempo").value);
    var aporteMensal = parseFloat(document.getElementById("AporteMensal").value);
    var diferenca = 0;

    if (isNaN(valorInicial) || isNaN(taxa) || isNaN(tempo) || valorInicial <= 0 || taxa <= 0 || tempo <= 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    // Chama a função CalcularCDB e passa todos os valores necessários
    var resultados = CalcularCDB(valorInicial, taxa, tempo, aporteMensal, diferenca);

    // Atualiza os elementos no HTML com os resultados formatados como moeda
    document.getElementById("ValorInicial").innerText = "ValorInicial: " + valorInicial.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});
    document.getElementById("Juros-Simples").innerText = "Juros Simples: " + resultados.jurosSimples.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById("Juros-Compostos").innerText = "Juros Compostos: " + resultados.jurosCompostos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById("Diferenca").innerText = 
        "|obs: os juros compostos rendem " + 
        resultados.diferenca.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + 
        " a mais no período selecionado!|";
}

function CalcularCDB(valorInicial, taxa, tempo, aporteMensal) {
    var montanteJurosSimples = 0;
    var montanteJurosCompostos = 0;

    // Cálculo com aportes mensais para juros compostos
    if (aporteMensal > 0) {
        montanteJurosCompostos = valorInicial * Math.pow((1 + (taxa / 100)), tempo) +
            (aporteMensal * ((Math.pow((1 + (taxa / 100)), tempo) - 1) / (taxa / 100)));

        // Cálculo com aportes mensais para juros simples
        montanteJurosSimples = valorInicial + (valorInicial * (taxa / 100) * tempo) +
            (aporteMensal * tempo) + (aporteMensal * (tempo - 1) * (taxa / 100) / 2);
        } else { 
            montanteJurosSimples = valorInicial * (1 + (taxa / 100) * tempo); // Cálculo sem aportes para juros simples
        
            montanteJurosCompostos = valorInicial * Math.pow((1 + (taxa / 100)), tempo); // Cálculo sem aportes para juros compostos
            
        }
    // Cálculo da diferença entre os montantes
        diferenca = montanteJurosCompostos - montanteJurosSimples;

    // Retorna ambos os valores como um objeto
    return {
        jurosSimples: montanteJurosSimples,
        jurosCompostos: montanteJurosCompostos,
        diferenca: diferenca
    };
}