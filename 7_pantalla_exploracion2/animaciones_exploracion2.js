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
    dialogueBox7: document.getElementById("dialogueBox7"),
    dialogueText7: document.getElementById("dialogueText7"),
    personaje7: document.getElementById("personaje-7"),
    mochila: document.getElementById("mochila"),
    flecha: document.getElementById("iconoFlecha"),
    confirmacionModal: document.getElementById("confirmacionModal"),
    confirmarBtn: document.getElementById("confirmarBtn"),
    cancelarBtn: document.getElementById("cancelarBtn"),
    iconosYLibreta: null, // para detectar zonas bloqueadas
  };

  // Aquí definimos los elementos donde NO se debe avanzar el diálogo al click:
  // Iconos y modal libreta (incluyendo interior)
  elements.iconosYLibreta = [
    elements.panel,
    elements.iconoModo,
    elements.btnCasa,
    elements.btnLibreta,
    elements.modalLibreta,
    elements.flecha,
    elements.confirmacionModal,
  ].filter(Boolean);

  let haReproducidoMusica = false;
  let musicaActiva = true;
  let sonidoActivo = true;
  let dialogVisible7 = false;
  let dialogVisible3 = false;
  let dialog3Parte = 0; // Para controlar qué parte del diálogo 3 se muestra (0 = no visible)

  // Música inicial
  if (elements.musica && !haReproducidoMusica) {
    elements.musica.muted = false;
    elements.musica.currentTime = 0;
    elements.musica.volume = 0.1;
    elements.musica
      .play()
      .catch((e) => console.error("🎵 Error al reproducir música:", e));
    haReproducidoMusica = true;
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

  // Mostrar icono libreta
  if (elements.btnLibreta) elements.btnLibreta.style.display = "block";

  // Diálogo personaje 7
  function mostrarDialogo7() {
    if (!elements.dialogueBox7 || !elements.dialogueText7) return;
    elements.dialogueText7.textContent =
      "Creo que esta es la tercera vez que pasamos por un campo igual... ¿O es el mismo?";
    elements.dialogueBox7.style.display = "block";
    dialogVisible7 = true;
  }
  function ocultarDialogo7() {
    if (!elements.dialogueBox7) return;
    elements.dialogueBox7.style.display = "none";
    dialogVisible7 = false;
  }

  // Diálogo mochila (click)
  function mostrarDialogo3Click() {
    if (!elements.dialogueBox3 || !elements.dialogueText3) return;

    elements.dialogueText3.textContent =
      "Pesa como si llevara piedras… O secretos. Pero no nos detengamos detective, el misterio nos espera.";
    elements.dialogueBox3.style.display = "block";

    dialogVisible3 = true;
  }
  function ocultarDialogo3Click() {
    if (!elements.dialogueBox3) return;
    elements.dialogueBox3.style.display = "none";
    dialogVisible3 = false;
  }

  // NUEVO diálogo automático dividido en dos partes
  const dialog3AutoTexts = [
    "Hmm… Debajo de la foto hay un nombre… Mariló ¿quién será? Necesito encontrarla y hablar con ella.",
    "Esto podría ser una pista clave para resolver el misterio. ¡Continuemos!",
  ];

  function mostrarDialogo3AutoParte(parte) {
    if (!elements.dialogueBox3 || !elements.dialogueText3) return;

    elements.dialogueText3.textContent = dialog3AutoTexts[parte];
    elements.dialogueBox3.style.display = "block";
    dialogVisible3 = true;
    dialog3Parte = parte + 1;
  }

  function ocultarDialogo3Auto() {
    if (!elements.dialogueBox3) return;
    elements.dialogueBox3.style.display = "none";
    dialogVisible3 = false;
    dialog3Parte = 0;
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
    // No cerrar diálogo si el click es en diálogo o mochilas o personaje7, para no cerrar por accidente
    const clickEnDialogoOElementosBloqueados =
      (elements.dialogueBox3 && elements.dialogueBox3.contains(event.target)) ||
      (elements.dialogueBox7 && elements.dialogueBox7.contains(event.target)) ||
      (elements.mochila && elements.mochila.contains(event.target)) ||
      (elements.personaje7 && elements.personaje7.contains(event.target));

    // Verificar si click está dentro de elementos donde NO se debe avanzar el diálogo:
    const clickEnZonasBloqueadas = elements.iconosYLibreta.some(
      (el) => el && el.contains(event.target)
    );

    // Manejamos diálogo personaje 7: click fuera oculta diálogo7
    if (
      dialogVisible7 &&
      elements.personaje7 &&
      !elements.personaje7.contains(event.target) &&
      !elements.dialogueBox7?.contains(event.target)
    ) {
      ocultarDialogo7();
    }

    // Diálogo mochila
    if (
      dialogVisible3 &&
      dialog3Parte === 0 &&
      !elements.mochila.contains(event.target) &&
      !elements.dialogueBox3?.contains(event.target)
    ) {
      ocultarDialogo3Click();
    }

    // Avanzar diálogo automático personaje 3 con click fuera de zonas bloqueadas
    if (
      dialog3Parte > 0 &&
      !clickEnDialogoOElementosBloqueados &&
      !clickEnZonasBloqueadas
    ) {
      if (dialog3Parte < dialog3AutoTexts.length) {
        mostrarDialogo3AutoParte(dialog3Parte); // Mostrar siguiente parte
      } else {
        ocultarDialogo3Auto(); // Ocultar diálogo al terminar
      }
    }

    // Cerrar panel de ajustes si click fuera y está abierto
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

  if (elements.personaje7) {
    elements.personaje7.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (event.target === event.currentTarget) {
        dialogVisible7 ? ocultarDialogo7() : mostrarDialogo7();
      }
    });
  } else {
    console.warn("⚠️ No se encontró el personaje 7");
  }

  if (elements.mochila) {
    elements.mochila.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (event.target === event.currentTarget) {
        dialogVisible3 && dialog3Parte === 0
          ? ocultarDialogo3Click()
          : mostrarDialogo3Click();
      }
    });
  } else {
    console.warn("⚠️ No se encontró la mochila");
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

  elements.flecha?.addEventListener("click", () => {
    window.location.href = "../8_pantalla_exploracion3/pantalla_exploracion3.html";
  });

  mostrarDialogo3AutoParte(0);
});
