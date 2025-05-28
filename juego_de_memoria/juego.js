const tablero = document.getElementById("tablero");
const mensajeFinal = document.getElementById("mensajeFinal");
const reiniciarBtn = document.getElementById("reiniciar");
const intentosDisplay = document.getElementById("intentos");

let intentos = 0;
let cartasVolteadas = [];
let cartasCompletadas = 0;
let simbolos = ['🍎', '🍌', '🍇', '🍒', '🍉', '🍍', '🥝', '🍓'];
simbolos = [...simbolos, ...simbolos]; // duplicar para pares

function crearTablero() {
    tablero.innerHTML = "";
    mensajeFinal.classList.add("oculto");
    cartasVolteadas = [];
    cartasCompletadas = 0;
    intentos = 0;
    intentosDisplay.textContent = intentos;

    let simbolosMezclados = simbolos.sort(() => 0.5 - Math.random());

    simbolosMezclados.forEach((simbolo, index) => {
        const carta = document.createElement("div");
        carta.classList.add("carta");
        carta.dataset.simbolo = simbolo;
        carta.dataset.index = index;
        carta.addEventListener("click", voltearCarta);
        tablero.appendChild(carta);
    });
}

function voltearCarta(e) {
    const carta = e.target;

    if (carta.classList.contains("volteada") || cartasVolteadas.length >= 2) return;

    carta.textContent = carta.dataset.simbolo;
    carta.classList.add("volteada");
    cartasVolteadas.push(carta);

    if (cartasVolteadas.length === 2) {
        intentos++;
        intentosDisplay.textContent = intentos;
        setTimeout(verificarCoincidencia, 700);
    }
}

function verificarCoincidencia() {
    const [c1, c2] = cartasVolteadas;

    if (c1.dataset.simbolo === c2.dataset.simbolo) {
        cartasCompletadas += 2;
        if (cartasCompletadas === simbolos.length) {
            mensajeFinal.classList.remove("oculto");
        }
    } else {
        c1.textContent = "";
        c2.textContent = "";
        c1.classList.remove("volteada");
        c2.classList.remove("volteada");
    }

    cartasVolteadas = [];
}

reiniciarBtn.addEventListener("click", crearTablero);

// Iniciar el juego al cargar la página
crearTablero();
