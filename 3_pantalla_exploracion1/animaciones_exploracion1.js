document.addEventListener("DOMContentLoaded", () => {
  // Cache DOM elements
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
    dialogueBox4: document.getElementById("dialogueBox4"),
    dialogueText3: document.getElementById("dialogueText3"),
    dialogueText4: document.getElementById("dialogueText4"),
    dialogueBox5: document.getElementById("dialogueBox5"),
    dialogueText5: document.getElementById("dialogueText5"),
    personaje5: document.getElementById("personaje-5"),
    maleta: document.getElementById("maleta"),
    actionContainer: document.getElementById("actionContainer"),
    actionText: document.getElementById("actionText"),
    flecha: document.getElementById("iconoFlecha"),
    confirmacionModal: document.getElementById("confirmacionModal"),
    confirmarBtn: document.getElementById("confirmarBtn"),
    cancelarBtn: document.getElementById("cancelarBtn"),
  };

  let haReproducidoMusica = false;
  let musicaActiva = true;
  let sonidoActivo = true;
  let dialogVisible5 = false;
  let dialogVisible3 = false;

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

  function mostrarDialogo5() {
    if (!elements.dialogueBox5 || !elements.dialogueText5) return;
    elements.dialogueText5.textContent = "¿Habré apagado la estufa antes de salir...";
    elements.dialogueBox5.style.display = "block";
    dialogVisible5 = true;
  }

  function ocultarDialogo5() {
    if (!elements.dialogueBox5) return;
    elements.dialogueBox5.style.display = "none";
    dialogVisible5 = false;
  }

  function mostrarDialogo3() {
    if (!elements.dialogueBox3 || !elements.dialogueText3 || !elements.flecha) return;

    elements.dialogueText3.textContent =
      "Vaya… una maleta. Tiene una etiqueta… “L.P” ¿Podría ser de Leotolda? Veamos qué hay dentro...";
    elements.dialogueBox3.style.display = "block";

    // Mostrar la flecha
    elements.flecha.style.display = "block";

    // Mostrar acción tipo instrucción
    const instruccion = {
      action:
        "¡Parece que has descubierto algo interesante! <strong>Pulsa la flecha para seguir explorando.</strong>",
      type: "instruccion",
    };

    if (elements.actionContainer && elements.actionText) {
      elements.actionText.innerHTML = instruccion.action;
      elements.actionContainer.style.display = "block";
    }

    dialogVisible3 = true;
  }

  function ocultarDialogo3() {
    if (!elements.dialogueBox3) return;
    elements.dialogueBox3.style.display = "none";
    // ¡NO ocultamos el actionContainer aquí!
    dialogVisible3 = false;
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
    if (
      elements.panel &&
      elements.iconoModo &&
      !elements.panel.contains(event.target) &&
      !elements.iconoModo.contains(event.target)
    ) {
      elements.panel.classList.remove("visible");
    }

    if (
      dialogVisible5 &&
      !elements.personaje5.contains(event.target) &&
      !elements.dialogueBox5?.contains(event.target)
    ) {
      ocultarDialogo5();
    }

    if (
      dialogVisible3 &&
      !elements.maleta.contains(event.target) &&
      !elements.dialogueBox3?.contains(event.target)
    ) {
      ocultarDialogo3();
    }
  });

  if (elements.personaje5) {
    elements.personaje5.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (event.target === event.currentTarget) {
        dialogVisible5 ? ocultarDialogo5() : mostrarDialogo5();
      }
    });
  } else {
    console.warn("⚠️ No se encontró el personaje 5");
  }

  if (elements.maleta) {
    elements.maleta.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (event.target === event.currentTarget) {
        dialogVisible3 ? ocultarDialogo3() : mostrarDialogo3();
      }
    });
  } else {
    console.warn("⚠️ No se encontró la maleta");
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

  // Al pulsar la flecha, ocultamos la instrucción y cambiamos de pantalla
  elements.flecha?.addEventListener("click", () => {
    if (elements.actionContainer) {
      elements.actionContainer.style.display = "none";
    }
    window.location.href = "../4_pantalla_minijuego1/pantalla_minijuego1.html";
  });
});
