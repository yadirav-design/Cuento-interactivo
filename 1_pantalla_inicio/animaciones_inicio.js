document.addEventListener("DOMContentLoaded", () => {
  let fondo = document.getElementById("fondo");
  let boton = document.getElementById("boton");
  let titulo = document.getElementById("titulo");
  let musica = document.getElementById("musicaFondo");

  let haReproducidoMusica = false;

  const pantallaBienvenida = document.getElementById("pantallaBienvenida");

  // Evento para el clic en cualquier parte de la pantalla
  document.addEventListener("click", () => {
    // Ocultar la pantalla de bienvenida
    if (pantallaBienvenida) {
      pantallaBienvenida.style.display = "none";
    }

    // Reproducir la música
    if (!haReproducidoMusica) {
      musica.muted = false;
      musica.currentTime = 0;
      musica.volume = 1.0;
      musica.play().catch((e) => console.error("🎵 Error al reproducir música:", e));
      haReproducidoMusica = true;
    }

    // Mostrar el botón y título
    if (boton) {
      boton.classList.add("visible");
    }
    if (titulo) {
      titulo.classList.add("visible");
    }
  });
});

// Acceder al elemento de audio
let musica = document.getElementById("musicaFondo");

// Estado inicial de los switches
let musicaActiva = true;
let sonidoActivo = true;

// Función para alternar el estado del switch
function toggleSwitch(idImg, estado) {
  const switchImg = document.getElementById(idImg);
  const nuevoEstado = !estado;
  switchImg.src = nuevoEstado ? "./media/on.png" : "./media/off.png";
  return nuevoEstado;
}

// Evento para el botón de música
document.getElementById("switchMusica").addEventListener("click", () => {
  musicaActiva = toggleSwitch("switchMusica", musicaActiva);
  console.log(musicaActiva ? "🎵 Música activada" : "🎵 Música desactivada");

  const musica = document.getElementById("musicaFondo");
  if (musica) musica.muted = !musicaActiva;
});

// Evento para el botón de sonido
document.getElementById("switchSonido").addEventListener("click", () => {
  sonidoActivo = toggleSwitch("switchSonido", sonidoActivo);
  console.log(sonidoActivo ? "🔊 Sonido activado" : "🔇 Sonido desactivado");
});

// Mostrar/ocultar el panel de ajustes
function cambiarModo(event) {
  const panel = document.getElementById("panelAjustes");
  const iconoModo = document.getElementById("iconoModo");

  // Evitar que el clic en el panel de ajustes cierre el panel
  if (panel.contains(event.target)) return;

  panel.classList.toggle("visible"); // Alternar la clase 'visible' para mostrar/ocultar

  // Si el panel se muestra, asegurarse de que no se cierre al hacer clic dentro
  iconoModo.classList.toggle("activo", panel.classList.contains("visible"));
}

// Evento para el icono de ajustes
document.getElementById("iconoModo").addEventListener("click", (event) => {
  cambiarModo(event); // Alternar visibilidad del panel al hacer clic en el icono
});

// Cerrar el panel si se hace clic fuera de él
document.addEventListener("click", (event) => {
  const panel = document.getElementById("panelAjustes");
  const iconoModo = document.getElementById("iconoModo");

  // Si el clic es fuera del panel de ajustes y fuera del icono de ajustes, se oculta el panel
  if (!panel.contains(event.target) && !iconoModo.contains(event.target)) {
    panel.classList.remove("visible");
  }
});
