let GetTime = document.getElementById("timerDisplay");
let timerInterval;

let startAudio = new Audio("./assets/sound/clock-start.wav");
startAudio.volume = 0.5;
let alarmAudio = new Audio("./assets/sound/alarm.wav");
alarmAudio.volume = 0.5;

function getSelectedTimInSeconds() {
    return document.getElementById("selectTime").value * 60;
}

function startTimer(duration) {
    let startTime = Date.now();
    let endTime = startTime + duration * 1000;
    startAudio.play();
    setTimeout(() => startAudio.pause(), 2000);
   
    function updateTimer() {
        let now = Date.now();
        let remainingTime = Math.round((endTime - now) / 1000);

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            GetTime.innerHTML = "00:00";
            document.title = "Acabou!";
            alert("O tempo acabou!");
            alarmAudio.play();
            setTimeout(() => alarmAudio.pause(), 5000);
        } else {
            let minutes = Math.floor(remainingTime / 60);
            let seconds = remainingTime % 60;
            GetTime.innerHTML = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            document.title = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }

    clearInterval(timerInterval);
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
    document.title = "Pomodoro Timer";
}

function stopTimer() {
    clearInterval(timerInterval);
    document.title = "Pomodoro";
}

function resetTimer(value) {
    clearInterval(timerInterval);
    
    // Se não receber valor, pega do select
    let timeInSeconds = value || getSelectedTimInSeconds();
    
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = timeInSeconds % 60;
    GetTime.innerHTML = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    document.title = "Pomodoro Timer";
}