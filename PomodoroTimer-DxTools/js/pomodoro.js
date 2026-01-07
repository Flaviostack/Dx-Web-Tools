let GetTime = document.getElementById("timerDisplay"); // Elemento para exibir o tempo
let timerInterval; // Variável para armazenar o intervalo do timer

let startAudio = new Audio("./assets/sound/clock-start.wav"); startAudio.volume = 0.5;
let alarmAudio = new Audio("./assets/sound/alarm.wav"); alarmAudio.volume = 0.5;


function startTimer(duration) {
    
    let startTime = Date.now();
    let endTime = startTime + duration * 1000;
    startAudio.play(); // Toca o áudio de início
    setTimeout(() => startAudio.pause(), 2000); // Para o áudio após 2 segundos
   
    function updateTimer() {
        let now = Date.now();
        let remainingTime = Math.round((endTime - now) / 1000);

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            GetTime.innerHTML = "00:00";
            document.title = "Acabou!";
            alert("O tempo acabou!");
            alarmAudio.play(); // Toca o áudio de alarme
            setTimeout(() => alarmAudio.pause(), 5000); // Para o áudio após 5 segundos
        } else {
            let minutes = Math.floor(remainingTime / 60);
            let seconds = remainingTime % 60;
            GetTime.innerHTML = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            document.title = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }

    clearInterval(timerInterval); // Garante que nenhum outro timer esteja rodando
    updateTimer(); // Chamada inicial para exibir o tempo imediatamente
    timerInterval = setInterval(updateTimer, 1000); // Atualiza o timer a cada segundo
    document.title = "Pomodoro Timer"; // Reseta o título da aba
}

function stopTimer() {
    clearInterval(timerInterval); // Para o timer
    document.title = "Pomodoro"; // Reseta o título da aba
}

function resetTimer() {
    clearInterval(timerInterval); // Para o timer
    GetTime.innerHTML = "25:00"; // Reseta o display para 25 minutos
}