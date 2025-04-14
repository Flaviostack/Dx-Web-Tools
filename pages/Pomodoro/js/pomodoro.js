let GetTime = document.getElementById("timerDisplay"); // Elemento para exibir o tempo
let timerInterval; // Variável para armazenar o intervalo do timer

function startTimer(duration) {
    let startTime = Date.now();
    let endTime = startTime + duration * 1000;

    function updateTimer() {
        let now = Date.now();
        let remainingTime = Math.round((endTime - now) / 1000);

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            GetTime.innerHTML = "00:00"; // Atualiza o elemento correto
            document.title = "Acabou!"; // Atualiza o título da aba
            alert("O tempo acabou!"); // Mensagem ao final do timer
        } else {
            let minutes = Math.floor(remainingTime / 60);
            let seconds = remainingTime % 60;
            GetTime.innerHTML = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            document.title = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; // Atualiza o título da aba
        }
    }

    clearInterval(timerInterval); // Garante que nenhum outro timer esteja rodando
    updateTimer(); // Chamada inicial para exibir o tempo imediatamente
    timerInterval = setInterval(updateTimer, 1000); // Atualiza o timer a cada segundo
}

function stopTimer() {
    clearInterval(timerInterval); // Para o timer
}

function resetTimer() {
    clearInterval(timerInterval); // Para o timer
    GetTime.innerHTML = "25:00"; // Reseta o display para 25 minutos
}