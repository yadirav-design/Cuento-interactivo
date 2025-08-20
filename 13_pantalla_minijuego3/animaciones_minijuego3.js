document.addEventListener("DOMContentLoaded", () => {
  // Estado del juego
  let musicaActiva = true;
  let sonidoActivo = true;
  let juegoCompletado = false;

  // Elementos del DOM
  const musica = document.getElementById("musicaFondo");
  const switchMusica = document.getElementById("switchMusica");
  const switchSonido = document.getElementById("switchSonido");
  const panelAjustes = document.getElementById("panelAjustes");
  const iconoModo = document.getElementById("iconoModo");
  const btnCasa = document.getElementById("iconoCasa");
  const confirmacionModal = document.getElementById("confirmacionModal");
  const confirmarBtn = document.getElementById("confirmarBtn");
  const cancelarBtn = document.getElementById("cancelarBtn");
  const btnLibreta = document.getElementById("btn-libreta");
  const modalLibreta = document.getElementById("modal-libreta");
  const closeButtons = document.querySelectorAll(".close");
  const instruccionBox = document.getElementById("instruccionBox");
  const contador = document.getElementById("contador");

  // Minijuego: detección de líneas clicadas
  const lineas = document.querySelectorAll(".linea");
  const totalLinesToClick = 6;
  const clickedLines = [];

  // IDs de las líneas correctas según el HTML
  const lineasCorrectas = [
    "linea18",
    "linea11",
    "linea25",
    "linea30",
    "linea34",
    "linea39",
  ];

  // URLs de destino
  const PANTALLA_EXITO = "../14_pantalla_exito/pantalla_exito.html";
  const PANTALLA_ERROR = "../14_pantalla_error/pantalla_error.html";

  // Música de fondo
  if (musica) {
    musica.muted = false;
    musica.currentTime = 0;
    musica.volume = 0.1;
    musica.play().catch(() => {
      console.log("La música no se pudo reproducir automáticamente");
    });
  }

  // Mostrar instrucción
  mostrarMensaje(
    "Alguien hizo un agujero en la hoja solo para fastidiar… <strong>Usa el ratón para cortar por las líneas de puntos y conseguir dos trozos que tengan la misma forma, sin el agujero</strong>."
  );

  // Actualizar contador inicial
  actualizarContador();

  // Función auxiliar para mostrar instrucciones
  function mostrarMensaje(mensaje) {
    if (instruccionBox) {
      instruccionBox.innerHTML = mensaje;
      instruccionBox.style.display = "block";
    }
  }

  // Función para actualizar el contador
  function actualizarContador() {
    if (contador) {
      contador.textContent = `Líneas: ${clickedLines.length}/${totalLinesToClick}`;
    }
  }

  function toggleSwitch(switchImg, estado) {
    if (switchImg) {
      switchImg.src = estado ? "./media/off.png" : "./media/on.png";
    }
    return !estado;
  }

  // Switch de música
  if (switchMusica) {
    switchMusica.addEventListener("click", (e) => {
      e.stopPropagation();
      musicaActiva = toggleSwitch(switchMusica, musicaActiva);
      if (musica) musica.muted = !musicaActiva;
    });
  }

  // Switch de sonido
  if (switchSonido) {
    switchSonido.addEventListener("click", (e) => {
      e.stopPropagation();
      sonidoActivo = toggleSwitch(switchSonido, sonidoActivo);
    });
  }

  // Mostrar ajustes
  if (iconoModo) {
    iconoModo.addEventListener("click", (e) => {
      e.stopPropagation();
      panelAjustes?.classList.toggle("visible");
    });
  }

  // Cerrar ajustes si se clickea fuera
  document.addEventListener("click", (e) => {
    if (
      panelAjustes &&
      iconoModo &&
      !panelAjustes.contains(e.target) &&
      !iconoModo.contains(e.target)
    ) {
      panelAjustes.classList.remove("visible");
    }
  });

  // Modal de confirmación para salir
  btnCasa?.addEventListener("click", (e) => {
    e.stopPropagation();
    confirmacionModal.style.display = "flex";
  });

  confirmarBtn?.addEventListener("click", () => {
    window.location.href = "../1_pantalla_inicio/pantalla_inicio.html";
  });

  cancelarBtn?.addEventListener("click", () => {
    confirmacionModal.style.display = "none";
  });

  // Modal de libreta
  btnLibreta?.addEventListener("click", (e) => {
    e.stopPropagation();
    modalLibreta.style.display = "flex";
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const modal = btn.closest(".modal");
      if (modal) modal.style.display = "none";
    });
  });

  window.addEventListener("click", (e) => {
    document.querySelectorAll(".modal").forEach((modal) => {
      if (e.target === modal) modal.style.display = "none";
    });
  });

  // Minijuego: lógica de clic en líneas
  lineas.forEach((linea) => {
    linea.addEventListener("click", () => {
      // Prevenir múltiples clics en la misma línea
      if (clickedLines.includes(linea.id) || juegoCompletado) return;

      // Agregar línea a las seleccionadas
      clickedLines.push(linea.id);

      // Cambiar a color rojo
      linea.classList.add("activa");

      // Actualizar contador
      actualizarContador();

      // Verificar si se completó el juego
      if (clickedLines.length === totalLinesToClick) {
        juegoCompletado = true;

        setTimeout(() => {
          // Verificar si todas las líneas clicadas son correctas
          const acierto =
            clickedLines.every((id) => lineasCorrectas.includes(id)) &&
            lineasCorrectas.every((id) => clickedLines.includes(id));

          // Redirigir según el resultado
          window.location.href = acierto ? PANTALLA_EXITO : PANTALLA_ERROR;
        }, 1500);
      }
    });
  });

  // Función para reproducir sonido (si hay efectos de sonido)
  function reproducirSonido(tipo) {
    if (!sonidoActivo) return;

    // Aquí puedes agregar efectos de sonido específicos
    // Por ejemplo: click, error, éxito, etc.
    console.log(`Reproduciendo sonido: ${tipo}`);
  }
});
