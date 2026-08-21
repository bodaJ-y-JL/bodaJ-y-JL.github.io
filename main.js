// REPRODUCTOR DE AUDIO
const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = playPauseBtn ? playPauseBtn.querySelector('i') : null;
const progressBar = document.getElementById('progressBar');

if (playPauseBtn && audio) {
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
        } else {
            audio.pause();
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
        }
    });

    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        if (progressBar) progressBar.value = progress || 0;
    });

    if (progressBar) {
        progressBar.addEventListener('input', () => {
            const value = progressBar.value;
            audio.currentTime = (value / 100) * audio.duration;
        });
    }
}

// INICIALIZACIÓN AL CARGAR EL DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. CUENTA REGRESIVA
    const $days = document.getElementById('dias'),
          $horas = document.getElementById('horas'),
          $minutos = document.getElementById('minutos'),
          $segundos = document.getElementById('segundos'),
          $finalMessage = document.querySelector('.final-sms'),
          $counterContainer = document.querySelector('.container__counter');
    
    const countdownDate = new Date('2026-12-27T00:16:00').getTime();

    let interval = setInterval(function() {
        const now = new Date().getTime();
        let distance = countdownDate - now;

        if (distance <= 0) {
            clearInterval(interval);
            if ($counterContainer) $counterContainer.classList.add('hidden');
            if ($finalMessage) $finalMessage.classList.add('show');
            return;
        }

        let dias = Math.floor(distance / (1000 * 60 * 60 * 24));
        let horas = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutos = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let segundos = Math.floor((distance % (1000 * 60)) / 1000);

        if ($days) $days.innerHTML = dias;
        if ($horas) $horas.innerHTML = ('0' + horas).slice(-2);
        if ($minutos) $minutos.innerHTML = ('0' + minutos).slice(-2);
        if ($segundos) $segundos.innerHTML = ('0' + segundos).slice(-2);
    }, 1000);

    // 2. INTERSECTION OBSERVER
    let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.titulo, .savethedate, .fecha, p, h3, h4, .NuestrosPadres, .contenedorVestimenta, h2, #leaf-img, #mesaRegalos__boton, #mesaRegalosA__boton, #mapa, #btn-si, #btn-no, #submit, #hospedaje, #app__boton, #contador, .itinerario, .sparky, .ceremonia, .sliderCarrusel, .dots-memories').forEach(elemento => {
        observer.observe(elemento);
    });

    // 3. CONFIRMACIÓN DE ASISTENCIA
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyON-_wdwU1EhhvT2J_MD0ex774oQtU-La3LxImTD37JcFdVx3-DpiPGruOmGLdzqv6/exec';
    const form = document.forms['contact-form'];

    const botonSi = document.getElementById('btn-si');
    const botonNo = document.getElementById('btn-no');
    const asistenciaInput = document.getElementById('asistencia');

    function seleccionarBoton(boton, valor) {
        if (botonSi) botonSi.classList.remove('seleccionado');
        if (botonNo) botonNo.classList.remove('seleccionado');
        
        boton.classList.add('seleccionado');
        if (asistenciaInput) asistenciaInput.value = valor;
    }

    if (botonSi) {
        botonSi.addEventListener('click', (e) => {
            e.preventDefault();
            seleccionarBoton(botonSi, 'SÍ, asistiré');
        });
    }

    if (botonNo) {
        botonNo.addEventListener('click', (e) => {
            e.preventDefault();
            seleccionarBoton(botonNo, 'NO asistiré');
        });
    }

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            if (!asistenciaInput || !asistenciaInput.value) {
                alert('Por favor selecciona si asistirás o no.');
                return;
            }

            // Envío con el modo no-cors necesario para Google Apps Script
            fetch(scriptURL, { 
                method: 'POST', 
                body: new FormData(form),
                mode: 'no-cors'
            })
            .then(() => {
                alert("¡Gracias! Tu confirmación ha sido enviada");
                window.location.reload();
            })
            .catch(error => console.error('Error!', error.message));
        });
    }
});