const btnIniciar = document.getElementById("btnIniciar");
const pantallaInicio = document.getElementById("pantallaInicio");
const juego = document.getElementById("juego");
const tablero = document.getElementById("tablero");
const mensajeFinal = document.getElementById("mensajeFinal");
const mensajePerdiste = document.getElementById("mensajePerdiste");
const reiniciarBtn = document.getElementById("reiniciar");
const recordDiv = document.getElementById("record");
const tiempoDiv = document.getElementById("tiempo");
const tiempoRestanteDiv = document.getElementById("tiempoRestante");
const nombreInput = document.getElementById("nombreJugador");

const modalReiniciar = document.getElementById('modalReiniciar');
const btnSi = document.getElementById('btnSi');
const btnNo = document.getElementById('btnNo');

// ¡Eliminado btnVolverAJugar!

let cartasVolteadas = [];
let cartasCompletadas = 0;
let simbolos = ['🍎', '🍌', '🍇', '🍒', '🍉', '🍍', '🥝', '🍓'];
simbolos = [...simbolos, ...simbolos]; // duplicar símbolos para pares
let tiempo = 0;
let intervalo = null;
let cuentaAtras = null;
let tiempoLimite = 60;
let mejorTiempo = localStorage.getItem('mejorTiempo');
let nombreJugador = "";

function mostrarRecord() {
    if (mejorTiempo) {
        recordDiv.textContent = `Récord: ${formatoTiempo(mejorTiempo)}`;
    } else {
        recordDiv.textContent = "Récord: --:--";
    }
}

function formatoTiempo(segundos) {
    const min = String(Math.floor(segundos / 60)).padStart(2, '0');
    const sec = String(segundos % 60).padStart(2, '0');
    return `${min}:${sec}`;
}

function iniciarTemporizador() {
    tiempo = 0;
    tiempoDiv.textContent = "Tiempo usado: 00:00";
    tiempoRestanteDiv.textContent = `Tiempo restante: ${tiempoLimite}s`;

    intervalo = setInterval(() => {
        tiempo++;
        tiempoDiv.textContent = `Tiempo usado: ${formatoTiempo(tiempo)}`;
    }, 1000);

    let restante = tiempoLimite;
    cuentaAtras = setInterval(() => {
        restante--;
        tiempoRestanteDiv.textContent = `Tiempo restante: ${restante}s`;

        if (restante <= 0) perder();
    }, 1000);
}

function detenerTemporizador() {
    clearInterval(intervalo);
    clearInterval(cuentaAtras);
}

function mostrarModal() {
    modalReiniciar.classList.remove('oculto');
}

function ocultarModal() {
    modalReiniciar.classList.add('oculto');
}

function ganar() {
    detenerTemporizador();
    mensajeFinal.classList.remove('oculto');
    mostrarModal();

    if (!mejorTiempo || tiempo < mejorTiempo) {
        mejorTiempo = tiempo;
        localStorage.setItem('mejorTiempo', mejorTiempo);
        alert("¡Nuevo récord!");
        mostrarRecord();
    }
}

function perder() {
    detenerTemporizador();
    tablero.innerHTML = "";
    mensajePerdiste.classList.remove("oculto");
    mostrarModal();
}

function crearTablero() {
    detenerTemporizador();

    tablero.innerHTML = "";
    cartasVolteadas = [];
    cartasCompletadas = 0;
    mensajeFinal.classList.add("oculto");
    mensajePerdiste.classList.add("oculto");

    let simbolosMezclados = [...simbolos].sort(() => 0.5 - Math.random());

    simbolosMezclados.forEach(simbolo => {
        const carta = document.createElement("div");
        carta.classList.add("carta");
        carta.dataset.simbolo = simbolo;
        carta.textContent = "";
        carta.addEventListener("click", voltearCarta);
        tablero.appendChild(carta);
    });

    const cartas = document.querySelectorAll(".carta");
    cartas.forEach(carta => {
        carta.textContent = carta.dataset.simbolo;
        carta.classList.add("volteada");
    });

    setTimeout(() => {
        cartas.forEach(carta => {
            carta.textContent = "";
            carta.classList.remove("volteada");
        });
        iniciarTemporizador();
    }, 2000);
}

function voltearCarta(e) {
    const carta = e.target;
    if (carta.classList.contains("volteada") || cartasVolteadas.length >= 2) return;

    carta.textContent = carta.dataset.simbolo;
    carta.classList.add("volteada");
    cartasVolteadas.push(carta);

    if (cartasVolteadas.length === 2) {
        setTimeout(verificarCoincidencia, 800);
    }
}

function verificarCoincidencia() {
    const [c1, c2] = cartasVolteadas;

    if (c1.dataset.simbolo === c2.dataset.simbolo) {
        cartasCompletadas += 2;
        if (cartasCompletadas === simbolos.length) {
            ganar();
        }
    } else {
        c1.textContent = "";
        c2.textContent = "";
        c1.classList.remove("volteada");
        c2.classList.remove("volteada");
    }

    cartasVolteadas = [];
}

btnIniciar.addEventListener("click", () => {
    nombreJugador = nombreInput.value.trim();
    if (nombreJugador === "") {
        alert("Por favor, ingresa tu nombre para empezar.");
        return;
    }
    pantallaInicio.style.display = "none";
    juego.style.display = "block";
    crearTablero();
    mostrarRecord();
});

reiniciarBtn.addEventListener("click", () => {
    ocultarModal();
    mensajeFinal.classList.add("oculto");
    mensajePerdiste.classList.add("oculto");
    crearTablero();
});

btnSi.addEventListener('click', () => {
    ocultarModal();
    mensajeFinal.classList.add('oculto');
    mensajePerdiste.classList.add('oculto');
    detenerTemporizador();
    crearTablero();
});

btnNo.addEventListener('click', () => {
    ocultarModal();
    mensajeFinal.classList.add('oculto');
    mensajePerdiste.classList.add('oculto');
    juego.style.display = "none";
    pantallaInicio.style.display = "block";
    nombreInput.value = "";
});
