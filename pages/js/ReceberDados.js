alert("Bem vindo ao sistema de recebimento de dados!");

let valorInicial = document.getElementById("valor-inicial");

function testar() {
    alert("Testando a função de receber dados!");
    var valorInicial = parseFloat(document.getElementById("ValorInicial").value);
    var taxa = parseFloat(document.getElementById("Taxa").value);
    var tempo = parseInt(document.getElementById("Tempo").value);
    alert("Valor inicial: R$" + valorInicial);
    alert("Taxa: " + taxa +"%");
    alert("Tempo: " + tempo + " meses");
    return [valorInicial, taxa, tempo];
}

