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
  const iconoFlecha = document.getElementById("iconoFlecha");

  // Botones del minijuego
  const botonRojo = document.getElementById("boton_rojo");
  const botonAzul = document.getElementById("boton_azul");
  const botonAmarillo = document.getElementById("boton_amarillo");

  // URLs de destino (ajusta estas rutas según tu estructura de carpetas)
  const PANTALLA_EXITO = "../11_pantalla_exito/pantalla_exito.html";
  const PANTALLA_ERROR = "../11_pantalla_error/pantalla_error.html"; // Ajusta esta ruta

  // ========== CONFIGURACIÓN INICIAL ==========

  // Configurar música de fondo
  if (musica) {
    musica.muted = false;
    musica.currentTime = 0;
    musica.volume = 0.1;
    musica.play().catch(() => {
      console.log("La música no se pudo reproducir automáticamente");
    });
  }

  // Mostrar instrucción inicial
  mostrarMensaje(
    "La puerta está bloqueada. Hay tres botones: azul, amarillo y rojo. Sobre la puerta, <strong>un cartel muestra un círculo verde</strong>."
  );

  // ========== FUNCIONES AUXILIARES ==========

  function mostrarMensaje(mensaje) {
    if (instruccionBox) {
      instruccionBox.innerHTML = mensaje;
      instruccionBox.style.display = "block";
    }
  }

  function reproducirSonido(tipo) {
    if (!sonidoActivo) return;
    console.log(`🔊 Reproduciendo sonido: ${tipo}`);

    // Si tienes archivos de sonido, descomenta y ajusta:
    // const audio = new Audio(`./media/sonido_${tipo}.mp3`);
    // audio.volume = 0.3;
    // audio.play().catch(() => {});
  }

  function toggleSwitch(switchImg, estado) {
    if (switchImg) {
      switchImg.src = estado ? "./media/off.png" : "./media/on.png";
    }
    return !estado;
  }

  // ========== LÓGICA PRINCIPAL DEL MINIJUEGO ==========

  function manejarRespuestaCorrecta() {
    juegoCompletado = true;
    reproducirSonido("exito");

    // Redirigir a pantalla de éxito después de 2 segundos
    setTimeout(() => {
      window.location.href = PANTALLA_EXITO;
    }, 2000);
  }

  function manejarRespuestaIncorrecta() {
    reproducirSonido("error");

    // Redirigir a pantalla de error después de 2 segundos
    setTimeout(() => {
      window.location.href = PANTALLA_ERROR;
    }, 2000);
  }

  // ========== EVENT LISTENERS DE LOS BOTONES ==========

  // Botón AMARILLO (CORRECTO)
  if (botonAmarillo) {
    botonAmarillo.addEventListener("click", () => {
      if (juegoCompletado) return;

      console.log("Botón amarillo pulsado - CORRECTO");
      manejarRespuestaCorrecta();
    });
  }

  // Botón AZUL (INCORRECTO)
  if (botonAzul) {
    botonAzul.addEventListener("click", () => {
      if (juegoCompletado) return;

      console.log("Botón azul pulsado - INCORRECTO");
      manejarRespuestaIncorrecta();
    });
  }

  // Botón ROJO (INCORRECTO)
  if (botonRojo) {
    botonRojo.addEventListener("click", () => {
      if (juegoCompletado) return;

      console.log("Botón rojo pulsado - INCORRECTO");
      manejarRespuestaIncorrecta();
    });
  }

  // ========== NAVEGACIÓN Y UI ==========

  // ========== CONFIGURACIÓN DE AUDIO ==========

  // Switch de música
  if (switchMusica) {
    switchMusica.addEventListener("click", (e) => {
      e.stopPropagation();
      musicaActiva = toggleSwitch(switchMusica, musicaActiva);
      if (musica) {
        musica.muted = !musicaActiva;
      }
    });
  }

  // Switch de sonido
  if (switchSonido) {
    switchSonido.addEventListener("click", (e) => {
      e.stopPropagation();
      sonidoActivo = toggleSwitch(switchSonido, sonidoActivo);
    });
  }

  // ========== PANEL DE AJUSTES ==========

  // Mostrar/ocultar panel de ajustes
  if (iconoModo) {
    iconoModo.addEventListener("click", (e) => {
      e.stopPropagation();
      if (panelAjustes) {
        panelAjustes.classList.toggle("visible");
      }
    });
  }

  // Cerrar panel de ajustes al hacer clic fuera
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

  // ========== MODAL DE CONFIRMACIÓN PARA SALIR ==========

  // Mostrar modal de confirmación
  if (btnCasa) {
    btnCasa.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirmacionModal) {
        confirmacionModal.style.display = "flex";
      }
    });
  }

  // Confirmar salida
  if (confirmarBtn) {
    confirmarBtn.addEventListener("click", () => {
      window.location.href = "../1_pantalla_inicio/pantalla_inicio.html";
    });
  }

  // Cancelar salida
  if (cancelarBtn) {
    cancelarBtn.addEventListener("click", () => {
      if (confirmacionModal) {
        confirmacionModal.style.display = "none";
      }
    });
  }

  // ========== MODAL DE LIBRETA ==========

  // Abrir libreta
  if (btnLibreta && modalLibreta) {
    btnLibreta.addEventListener("click", (e) => {
      e.stopPropagation();
      modalLibreta.style.display = "flex";
    });
  }

  // Cerrar modales con botón X
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const modal = btn.closest(".modal");
      if (modal) {
        modal.style.display = "none";
      }
    });
  });

  // Cerrar modales haciendo clic fuera
  window.addEventListener("click", (e) => {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });

  // ========== DEBUGGING ==========

  console.log("🎮 Minijuego cargado correctamente");
  console.log("✅ Botón correcto: AMARILLO");
  console.log("❌ Botones incorrectos: AZUL, ROJO");
});
