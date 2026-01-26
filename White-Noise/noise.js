class WhiteNoiseGenerator {
    constructor() {
        this.audioContext = null;
        this.noiseNode = null;
        this.gainNode = null;
        this.filterNode = null;
        this.isPlaying = false;
        this.analyser = null;
        this.animationId = null;
        
        this.initializeElements();
        this.setupEventListeners();
    }
    
    initializeElements() {
        this.toggleBtn = document.getElementById('toggle-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.volumeSlider = document.getElementById('volume');
        this.filterSlider = document.getElementById('filter');
        this.volumeValue = document.getElementById('volume-value');
        this.filterValue = document.getElementById('filter-value');
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d');
        
        // Definir tamanho do canvas
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    setupEventListeners() {
        this.toggleBtn.addEventListener('click', () => this.toggleNoise());
        this.stopBtn.addEventListener('click', () => this.stopNoise());
        
        this.volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.volumeValue.textContent = `${e.target.value}%`;
            if (this.gainNode) {
                this.gainNode.gain.value = volume;
            }
        });
        
        this.filterSlider.addEventListener('input', (e) => {
            const frequency = parseInt(e.target.value);
            this.filterValue.textContent = frequency;
            if (this.filterNode) {
                this.filterNode.frequency.value = frequency;
            }
        });
        
        // Botões de efeitos
        document.getElementById('rain-btn').addEventListener('click', () => {
            this.setPreset(30, 100);
        });
        
        document.getElementById('fan-btn').addEventListener('click', () => {
            this.setPreset(40, 2000);
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.setPreset(50, 1000);
        });
        
        // Predefinições (atualizado para .preset-btn)
        document.querySelectorAll('.preset-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const volume = e.target.dataset.volume;
                const filter = e.target.dataset.filter;
                this.setPreset(volume, filter);
            });
        });
        
        // Redimensionar canvas quando a janela mudar de tamanho
        window.addEventListener('resize', () => {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        });
    }
    
    setPreset(volume, filter) {
        this.volumeSlider.value = volume;
        this.filterSlider.value = filter;
        this.volumeValue.textContent = `${volume}%`;
        this.filterValue.textContent = filter;
        
        if (this.gainNode) {
            this.gainNode.gain.value = volume / 100;
        }
        if (this.filterNode) {
            this.filterNode.frequency.value = filter;
        }
    }
    
    createNoise() {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1; // Ruído branco (-1 a 1)
        }
        
        const noiseSource = this.audioContext.createBufferSource();
        noiseSource.buffer = buffer;
        noiseSource.loop = true;
        
        return noiseSource;
    }
    
    toggleNoise() {
        if (!this.isPlaying) {
            this.startNoise();
        } else {
            this.stopNoise();
        }
    }
    
    startNoise() {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            this.noiseNode = this.createNoise();
            this.gainNode = this.audioContext.createGain();
            this.filterNode = this.audioContext.createBiquadFilter();
            this.analyser = this.audioContext.createAnalyser();
            
            // Configurações
            this.gainNode.gain.value = this.volumeSlider.value / 100;
            this.filterNode.type = 'bandpass';
            this.filterNode.frequency.value = this.filterSlider.value;
            this.filterNode.Q.value = 1;
            
            // Conexão dos nós
            this.noiseNode.connect(this.filterNode);
            this.filterNode.connect(this.gainNode);
            this.gainNode.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            this.analyser.fftSize = 2048;
            
            this.noiseNode.start();
            this.isPlaying = true;
            
            this.toggleBtn.textContent = '⏸️ Pausar';
            this.toggleBtn.classList.remove('btn-primary');
            this.toggleBtn.classList.add('btn-secondary');
            
            this.startVisualizer();
            
        } catch (error) {
            console.error('Erro ao iniciar o ruído:', error);
            alert('Não foi possível iniciar o áudio. Certifique-se de que o navegador tem permissão para reproduzir áudio.');
        }
    }
    
    stopNoise() {
        if (this.noiseNode) {
            this.noiseNode.stop();
            this.noiseNode.disconnect();
            this.noiseNode = null;
        }
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        this.isPlaying = false;
        this.toggleBtn.textContent = '▶️ Iniciar';
        this.toggleBtn.classList.remove('btn-secondary');
        this.toggleBtn.classList.add('btn-primary');
        
        // Limpar visualizador
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    startVisualizer() {
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const draw = () => {
            this.animationId = requestAnimationFrame(draw);
            
            this.analyser.getByteFrequencyData(dataArray);
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            const barWidth = (this.canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            
            // Desenhar barras do espectro
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                
                const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
                gradient.addColorStop(0, '#8FABD4'); // usando sua variável --component-primary
                gradient.addColorStop(1, '#032d6b'); // usando sua variável --component-tertiary
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }
            
            // Desenhar linha de onda
            this.analyser.getByteTimeDomainData(dataArray);
            
            this.ctx.beginPath();
            this.ctx.strokeStyle = '#E7B256'; // usando sua variável --component-contrast
            this.ctx.lineWidth = 2;
            
            const sliceWidth = this.canvas.width * 1.0 / bufferLength;
            x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * this.canvas.height / 2;
                
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
                
                x += sliceWidth;
            }
            
            this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
            this.ctx.stroke();
        };
        
        draw();
    }
}

// Inicializar quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
    new WhiteNoiseGenerator();
});


// Controle do texto descritivo colapsável
document.addEventListener('DOMContentLoaded', function() {
    const descricaoElement = document.getElementById('descricao');
    const headerElement = descricaoElement.querySelector('header');
    
    // Adicionar classe inicial
    descricaoElement.classList.add('collapsed');
    
    // Adicionar evento de clique no header
    headerElement.addEventListener('click', function() {
        descricaoElement.classList.toggle('collapsed');
    });
    
    // Opcional: fechar automaticamente se clicar fora
    document.addEventListener('click', function(event) {
        if (!descricaoElement.contains(event.target) && 
            !descricaoElement.classList.contains('collapsed')) {
            descricaoElement.classList.add('collapsed');
        }
    });
});