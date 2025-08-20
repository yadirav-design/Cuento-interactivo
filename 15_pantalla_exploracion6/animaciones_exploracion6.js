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
    instruccionBox: document.getElementById("instruccionBox"),
    dialogueBox3: document.getElementById("dialogueBox3"),
    dialogueBox9: document.getElementById("dialogueBox9"),
    dialogueText3: document.getElementById("dialogueText3"),
    dialogueText9: document.getElementById("dialogueText9"),
    actionContainer: document.getElementById("actionContainer"),
    actionText: document.getElementById("actionText"),
    flecha: document.getElementById("iconoFlecha"),
    confirmacionModal: document.getElementById("confirmacionModal"),
    confirmarBtn: document.getElementById("confirmarBtn"),
    cancelarBtn: document.getElementById("cancelarBtn"),
    personaje9: document.getElementById("personaje-9"),
    iconosYLibreta: null,
  };

  // Definimos los elementos donde NO se debe avanzar el diálogo al click
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

  // Variables para el diálogo automático
  let autoDialogCurrentLine = -1;
  let autoDialogProcessing = false;
  let autoDialogCompleted = false;

  // Variables para el diálogo manual (click en personaje)
  let manualDialogCurrentLine = -1;
  let manualDialogProcessing = false;
  let flechaVisible = false;
  let manualDialogStarted = false;

  // Verificar que los elementos críticos existen
  console.log("Personaje 9 encontrado:", elements.personaje9);
  console.log("DialogueBox9 encontrado:", elements.dialogueBox9);
  console.log("DialogueText9 encontrado:", elements.dialogueText9);

  if (elements.musica && !haReproducidoMusica) {
    elements.musica.muted = false;
    elements.musica.currentTime = 0;
    elements.musica.volume = 0.1;
    elements.musica
      .play()
      .catch((e) => console.error("🎵 Error al reproducir música:", e));
    haReproducidoMusica = true;
  }

  // DIÁLOGO AUTOMÁTICO (aparece al cargar la pantalla)
  const autoDialogueLines = [
    {
      character: 9,
      text: "¡Wow, gracias!",
    },
    {
      character: 3,
      text: "Entonces, sobre Leotolda…",
    },
    {
      character: 9,
      text: "¡Ah, sí! ¡La vi! Tenía un <strong>vestido colorido y su pelo… ¡estaba súper rizado!</strong>",
    },
    {
      character: 9,
      text: "Después, creo que se fue al siguiente vagón. ¡Eso es todo lo que sé!",
    },
    {
      character: 3,
      text: "¡Muchas gracias por la ayuda! Vamos al siguiente vagón. ¡Resolvamos el misterio!",
    },
    {
      action:
        "¡Leotolda se fue al siguiente vagón! <strong>Pulsa la flecha para seguir explorando.</strong>",
      type: "instruccion",
    },
  ];

  // FUNCIONES PARA EL DIÁLOGO AUTOMÁTICO
  function showNextAutoDialogue() {
    console.log("showNextAutoDialogue llamada, currentLine:", autoDialogCurrentLine);

    if (autoDialogProcessing) {
      console.log("Auto dialog ya en proceso, saliendo");
      return;
    }
    autoDialogProcessing = true;

    // Manejar caso especial de instrucción final
    if (
      autoDialogCurrentLine === autoDialogueLines.length - 1 &&
      elements.instruccionBox?.style.display === "block"
    ) {
      elements.instruccionBox.style.display = "none";
      if (!flechaVisible && elements.flecha) {
        elements.flecha.style.display = "block";
        flechaVisible = true;
      }
      autoDialogCompleted = true;
      autoDialogProcessing = false;
      return;
    }

    // Ocultar todos los diálogos anteriores
    hideAllDialogues();

    autoDialogCurrentLine++;
    console.log("Auto dialog - Avanzando a línea:", autoDialogCurrentLine);

    if (autoDialogCurrentLine >= autoDialogueLines.length) {
      console.log("Fin del diálogo automático - marcando como completado");
      autoDialogCompleted = true;
      // Mostrar libreta y flecha al completar el diálogo automático
      if (elements.btnLibreta) {
        elements.btnLibreta.style.display = "block";
      }
      if (elements.flecha) {
        elements.flecha.style.display = "block";
        flechaVisible = true;
      }
      autoDialogProcessing = false;
      return;
    }

    const line = autoDialogueLines[autoDialogCurrentLine];
    console.log("Auto dialog - Procesando línea:", line);

    setTimeout(() => {
      showDialogueLine(line);

      // Si es la última línea y es una instrucción, también mostrar la flecha
      if (autoDialogCurrentLine === autoDialogueLines.length - 1) {
        if (elements.btnLibreta) elements.btnLibreta.style.display = "block";
        if (line.type === "instruccion" && elements.flecha) {
          elements.flecha.style.display = "block";
          flechaVisible = true;
        }
      }

      autoDialogProcessing = false;
    }, 100);
  }

  // FUNCIONES PARA EL DIÁLOGO MANUAL
  function showNextManualDialogue() {
    console.log("showNextManualDialogue llamada, currentLine:", manualDialogCurrentLine);

    if (manualDialogProcessing) {
      console.log("Manual dialog ya en proceso, saliendo");
      return;
    }
    manualDialogProcessing = true;

    // Manejar caso especial de instrucción final
    if (
      manualDialogCurrentLine === manualDialogueLines.length - 1 &&
      elements.instruccionBox?.style.display === "block"
    ) {
      elements.instruccionBox.style.display = "none";
      if (!flechaVisible && elements.flecha) {
        elements.flecha.style.display = "block";
        flechaVisible = true;
      }
      manualDialogProcessing = false;
      return;
    }

    // Ocultar todos los diálogos anteriores
    hideAllDialogues();

    manualDialogCurrentLine++;
    console.log("Manual dialog - Avanzando a línea:", manualDialogCurrentLine);

    if (manualDialogCurrentLine >= manualDialogueLines.length) {
      console.log("Fin del diálogo manual");
      manualDialogProcessing = false;
      return;
    }

    const line = manualDialogueLines[manualDialogCurrentLine];
    console.log("Manual dialog - Procesando línea:", line);

    setTimeout(() => {
      showDialogueLine(line);

      // Mostrar elementos finales si es la última línea del diálogo manual
      if (manualDialogCurrentLine === manualDialogueLines.length - 1) {
        if (elements.btnLibreta) elements.btnLibreta.style.display = "block";
        if (elements.flecha) {
          elements.flecha.style.display = "block";
          flechaVisible = true;
        }
      }

      manualDialogProcessing = false;
    }, 100);
  }

  // Función helper para ocultar todos los diálogos
  function hideAllDialogues() {
    if (elements.dialogueBox3) elements.dialogueBox3.style.display = "none";
    if (elements.dialogueBox9) elements.dialogueBox9.style.display = "none";
    if (elements.actionContainer) elements.actionContainer.style.display = "none";
    if (elements.instruccionBox) {
      elements.instruccionBox.innerHTML = "";
      elements.instruccionBox.classList.remove("instruccion");
      elements.instruccionBox.style.display = "none";
    }
  }

  // Función helper para mostrar una línea de diálogo
  function showDialogueLine(line) {
    if (line.type === "instruccion") {
      if (elements.instruccionBox) {
        elements.instruccionBox.innerHTML = line.action;
        elements.instruccionBox.classList.add("instruccion");
        elements.instruccionBox.style.display = "block";
      }
    } else if (line.character === 3) {
      if (elements.dialogueText3 && elements.dialogueBox3) {
        elements.dialogueText3.innerHTML = line.text;
        elements.dialogueBox3.style.display = "block";
        console.log("Mostrando diálogo del personaje 3");
      }
    } else if (line.character === 9) {
      if (elements.dialogueText9 && elements.dialogueBox9) {
        elements.dialogueText9.innerHTML = line.text;
        elements.dialogueBox9.style.display = "block";
        console.log("Mostrando diálogo del personaje 9");
      } else {
        console.error("Error: elementos de diálogo del personaje 9 no encontrados");
      }
    } else if (line.action) {
      if (elements.actionText && elements.actionContainer) {
        elements.actionText.innerHTML = line.action;
        elements.actionContainer.style.display = "block";
      }
    }
  }

  // INICIAR DIÁLOGO AUTOMÁTICO al cargar la página
  setTimeout(() => {
    console.log("Iniciando diálogo automático");
    showNextAutoDialogue();
  }, 1000); // Esperar 1 segundo después de cargar

  // Event listener para el personaje 9 (ya no necesario, pero lo dejamos por compatibilidad)
  if (elements.personaje9) {
    console.log("Agregando event listener al personaje 9");
    elements.personaje9.style.cursor = "pointer";
    elements.personaje9.addEventListener("click", (e) => {
      console.log("¡Click en personaje 9 detectado!");
      e.stopPropagation();

      // Si el diálogo automático no está completado, avanzarlo
      if (!autoDialogCompleted) {
        showNextAutoDialogue();
      }
    });
  } else {
    console.error("¡ERROR: Elemento personaje-9 no encontrado!");
  }

  // Event listeners para switches
  if (elements.switchMusica) {
    elements.switchMusica.addEventListener("click", (e) => {
      e.stopPropagation();
      musicaActiva = toggleSwitch("switchMusica", musicaActiva);
      if (elements.musica) elements.musica.muted = !musicaActiva;
    });
  }

  if (elements.switchSonido) {
    elements.switchSonido.addEventListener("click", (e) => {
      e.stopPropagation();
      sonidoActivo = toggleSwitch("switchSonido", sonidoActivo);
    });
  }

  // Event listener global para avanzar diálogos
  document.addEventListener("click", (e) => {
    console.log("Click global detectado");
    console.log("autoDialogCompleted:", autoDialogCompleted);

    // Verificar si click está dentro de elementos donde NO se debe avanzar el diálogo
    const clickEnZonasBloqueadas = elements.iconosYLibreta.some(
      (el) => el && el.contains(e.target)
    );

    const hizoClickEnUI = e.target.closest(
      "#panelAjustes, #iconoModo, .modal, #btn-libreta, #iconoCasa, #confirmacionModal"
    );

    // Cerrar panel de ajustes si click fuera de él
    if (
      elements.panel &&
      elements.iconoModo &&
      !elements.panel.contains(e.target) &&
      !elements.iconoModo.contains(e.target)
    ) {
      elements.panel.classList.remove("visible");
      elements.iconoModo.classList.remove("activo");
    }

    // Si el click es en zona bloqueada o UI, no hacer nada
    if (hizoClickEnUI || clickEnZonasBloqueadas) {
      console.log("Click en zona bloqueada o UI, ignorando");
      return;
    }

    // AVANZAR DIÁLOGO AUTOMÁTICO (si no está completado)
    if (!autoDialogCompleted) {
      console.log("Click global para avanzar diálogo automático");
      showNextAutoDialogue();
    }
  });

  if (elements.iconoModo) {
    elements.iconoModo.addEventListener("click", (e) => {
      e.stopPropagation();
      cambiarModo(e);
    });
  }

  if (elements.btnLibreta && elements.modalLibreta) {
    elements.btnLibreta.addEventListener("click", (e) => {
      e.stopPropagation();
      openModal(elements.modalLibreta);
    });
  }

  if (elements.btnCasa) {
    elements.btnCasa.addEventListener("click", (e) => {
      e.stopPropagation();
      if (elements.confirmacionModal) elements.confirmacionModal.style.display = "flex";
    });
  }

  elements.closeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllModals();
    });
  });

  window.addEventListener("click", (event) => {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });

  if (elements.confirmarBtn) {
    elements.confirmarBtn.addEventListener("click", () => {
      window.location.href = "../1_pantalla_inicio/pantalla_inicio.html";
    });
  }

  if (elements.cancelarBtn) {
    elements.cancelarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (elements.confirmacionModal) elements.confirmacionModal.style.display = "none";
    });
  }

  if (elements.flecha) {
    elements.flecha.addEventListener("click", () => {
      window.location.href = "../16_pantalla_exploracion7/pantalla_exploracion7.html";
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
});
