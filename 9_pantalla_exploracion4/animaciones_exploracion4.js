document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    musica: document.getElementById("musicaFondo"),
    switchMusica: document.getElementById("switchMusica"),
    switchSonido: document.getElementById("switchSonido"),
    panel: document.getElementById("panelAjustes"),
    iconoModo: document.getElementById("iconoModo"),
    btnCasa: document.getElementById("iconoCasa"),
    btnLibreta: document.getElementById("btn-libreta"),
    modalLibreta: document.getElementById("modal-libreta"),
    closeButtons: document.querySelectorAll(".close"),
    dialogueBox3: document.getElementById("dialogueBox3"),
    dialogueText3: document.getElementById("dialogueText3"),
    dialogueBox8: document.getElementById("dialogueBox8"),
    dialogueText8: document.getElementById("dialogueText8"),
    personaje8: document.getElementById("personaje-8"),
    libros: document.getElementById("libros"),
    flecha: document.getElementById("iconoFlecha"),
    confirmacionModal: document.getElementById("confirmacionModal"),
    confirmarBtn: document.getElementById("confirmarBtn"),
    cancelarBtn: document.getElementById("cancelarBtn"),
    dialogueBoxFlecha: document.getElementById("dialogueBoxFlecha"),
    dialogueTextFlecha: document.getElementById("dialogueTextFlecha"),
    iconosYLibreta: null,
  };

  elements.iconosYLibreta = [
    elements.panel,
    elements.iconoModo,
    elements.btnCasa,
    elements.btnLibreta,
    elements.modalLibreta,
    elements.flecha,
    elements.confirmacionModal,
  ].filter(Boolean);

  // Variables control diálogo y música
  let haReproducidoMusica = false;
  let musicaActiva = true;
  let sonidoActivo = true;
  let dialogVisible8 = false;
  let dialogVisible3 = false;
  let dialogVisibleFlecha = false;

  if (elements.musica && !haReproducidoMusica) {
    elements.musica.muted = false;
    elements.musica.currentTime = 0;
    elements.musica.volume = 0.1;
    elements.musica
      .play()
      .catch((e) => console.error("🎵 Error al reproducir música:", e));
    haReproducidoMusica = true;
  }

  // Función para mostrar diálogo personaje 3 (libros)
  function mostrarDialogo3Nuevo() {
    if (!elements.dialogueBox3 || !elements.dialogueText3) return;
    elements.dialogueText3.textContent =
      "Uno está marcado en la mitad. Alguien no terminó la historia. Pero no nos detengamos detective, el misterio nos espera.";
    elements.dialogueBox3.style.display = "block";
    dialogVisible3 = true;
  }

  // Función para ocultar diálogo personaje 3
  function ocultarDialogo3Click() {
    if (!elements.dialogueBox3) return;
    elements.dialogueBox3.style.display = "none";
    dialogVisible3 = false;
  }

  // Función para mostrar diálogo exclusivo flecha
  function mostrarDialogoFlecha() {
    if (!elements.dialogueBoxFlecha || !elements.dialogueTextFlecha) return;
    elements.dialogueTextFlecha.textContent =
      "Vaya… la puerta al siguiente vagón está cerrada con un sistema de botones. Parece que solo uno la abre…";
    elements.dialogueBoxFlecha.style.display = "block";
    dialogVisibleFlecha = true;
  }

  // Función para ocultar diálogo flecha
  function ocultarDialogoFlecha() {
    if (!elements.dialogueBoxFlecha) return;
    elements.dialogueBoxFlecha.style.display = "none";
    dialogVisibleFlecha = false;
  }

  // Evento click en libros (diálogo personaje 3)
  if (elements.libros) {
    elements.libros.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      // Ocultamos diálogo flecha si está visible
      if (dialogVisibleFlecha) ocultarDialogoFlecha();

      if (dialogVisible3) {
        ocultarDialogo3Click();
      } else {
        mostrarDialogo3Nuevo();
      }
    });
  }

  // Evento click en flecha (diálogo exclusivo + cambio pantalla)
  if (elements.flecha) {
    elements.flecha.addEventListener("click", () => {
      console.log("Click en la flecha detectado");

      if (dialogVisible3) ocultarDialogo3Click(); // Oculta el diálogo de los libros si está visible

      mostrarDialogoFlecha(); // Muestra el diálogo de la flecha

      // Esperamos 6 segundos antes de cambiar de pantalla (el diálogo se mantiene visible)
      setTimeout(() => {
        console.log("Redirigiendo a la nueva pantalla...");
        window.location.href = "../10_pantalla_minijuego2/pantalla_minijuego2.html";
      }, 6000);
    });
  }
  
  function toggleSwitch(idImg, estado) {
    const switchImg = document.getElementById(idImg);
    const nuevoEstado = !estado;
    if (switchImg) {
      switchImg.src = nuevoEstado ? "./media/on.png" : "./media/off.png";
    }
    return nuevoEstado;
  }

  function openModal(modal) {
    closeAllModals();
    if (modal) modal.style.display = "flex";
  }

  function closeAllModals() {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((m) => (m.style.display = "none"));
  }

  function cambiarModo(event) {
    if (!elements.panel || !elements.iconoModo) return;
    if (elements.panel.contains(event?.target)) return;
    elements.panel.classList.toggle("visible");
    elements.iconoModo.classList.toggle(
      "activo",
      elements.panel.classList.contains("visible")
    );
  }

  if (elements.btnLibreta) elements.btnLibreta.style.display = "block";

  function mostrarDialogo8() {
    if (!elements.dialogueBox8 || !elements.dialogueText8) return;
    elements.dialogueText8.textContent =
      "Una vez soñé que este tren volaba. Qué cosa más rara.";
    elements.dialogueBox8.style.display = "block";
    dialogVisible8 = true;
  }

  function ocultarDialogo8() {
    if (!elements.dialogueBox8) return;
    elements.dialogueBox8.style.display = "none";
    dialogVisible8 = false;
  }

  if (elements.switchMusica) {
    elements.switchMusica.addEventListener("click", (event) => {
      event.stopPropagation();
      musicaActiva = toggleSwitch("switchMusica", musicaActiva);
      if (elements.musica) elements.musica.muted = !musicaActiva;
    });
  }

  if (elements.switchSonido) {
    elements.switchSonido.addEventListener("click", (event) => {
      event.stopPropagation();
      sonidoActivo = toggleSwitch("switchSonido", sonidoActivo);
    });
  }

  document.addEventListener("click", (event) => {
    const clickEnZonasBloqueadas = elements.iconosYLibreta.some(
      (el) => el && el.contains(event.target)
    );

    if (clickEnZonasBloqueadas) return;

    if (
      dialogVisible8 &&
      elements.personaje8 &&
      !elements.personaje8.contains(event.target) &&
      !elements.dialogueBox8?.contains(event.target)
    ) {
      ocultarDialogo8();
    }

    if (
      dialogVisible3 &&
      elements.libros &&
      !elements.libros.contains(event.target) &&
      !elements.dialogueBox3?.contains(event.target)
    ) {
      ocultarDialogo3Click();
    }

    if (
      dialogVisibleFlecha &&
      elements.flecha &&
      !elements.flecha.contains(event.target) &&
      !elements.dialogueBoxFlecha?.contains(event.target)
    ) {
      ocultarDialogoFlecha();
    }

    if (
      elements.panel &&
      elements.panel.classList.contains("visible") &&
      !elements.panel.contains(event.target) &&
      elements.iconoModo &&
      !elements.iconoModo.contains(event.target)
    ) {
      elements.panel.classList.remove("visible");
      elements.iconoModo.classList.remove("activo");
    }
  });

  if (elements.personaje8) {
    elements.personaje8.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (event.target === event.currentTarget) {
        dialogVisible8 ? ocultarDialogo8() : mostrarDialogo8();
      }
    });
  }

  if (elements.btnLibreta && elements.modalLibreta) {
    elements.btnLibreta.addEventListener("click", (event) => {
      event.stopPropagation();
      openModal(elements.modalLibreta);
    });
  }

  if (elements.btnCasa) {
    elements.btnCasa.addEventListener("click", (event) => {
      event.stopPropagation();
      if (elements.confirmacionModal) elements.confirmacionModal.style.display = "flex";
    });
  }

  elements.closeButtons?.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      closeAllModals();
    });
  });

  window.addEventListener("click", function (event) {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });

  if (elements.iconoModo) {
    elements.iconoModo.addEventListener("click", (event) => {
      event.stopPropagation();
      cambiarModo(event);
    });
  }

  if (elements.confirmarBtn) {
    elements.confirmarBtn.addEventListener("click", () => {
      window.location.href = "../1_pantalla_inicio/pantalla_inicio.html";
    });
  }

  if (elements.cancelarBtn) {
    elements.cancelarBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      if (elements.confirmacionModal) elements.confirmacionModal.style.display = "none";
    });
  }
});
