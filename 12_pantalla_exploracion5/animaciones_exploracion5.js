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
    iconosYLibreta: null, // para detectar zonas bloqueadas
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

  // Variables para el diálogo ORIGINAL (click en personaje)
  let currentLine = -1;
  let dialogProcessing = false;
  let flechaVisible = false;
  let dialogStarted = false;

  // Variables para el diálogo AUTOMÁTICO (nuevo)
  let dialogoAutomaticoParte = 0;
  let dialogoAutomaticoVisible = false;
  let dialogoAutomaticoTerminado = false;

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

  // DIÁLOGO AUTOMÁTICO (nuevo - se ejecuta al inicio)
  const dialogoAutomaticoTexts = [
    {
      character: 3,
      text: "Busquemos a alguien a quien podamos preguntar.",
    },
  ];

  // DIÁLOGO ORIGINAL (existente - se ejecuta con click en personaje)
  const dialogueLines = [
    {
      character: 3,
      text: "Hola, ¿podemos hacerte una pregunta?",
    },
    {
      character: 9,
      text: "¿Eh? ¿A mí? Bueno… sí, supongo. ¿De qué se trata?",
    },
    {
      character: 3,
      text: "Estamos investigando la desaparición de Leotolda. ¿La has visto?",
    },
    {
      character: 9,
      text: "Leotolda? Umm… creo que sí, pero… ¿me ayudan con algo primero?",
    },
    {
      character: 3,
      text: "¿Ayudarte?",
    },
    {
      character: 9,
      text: "Sí… estaba intentando arreglar esto pero no he sido capaz. Si me ayudan, les cuento lo que sé.",
    },
    {
      character: 3,
      text: "Está bien, resolvamos esto",
    },
    {
      action:
        "¡Si le ayudamos, tal vez obtengamos una pista! <strong>Pulsa la flecha para seguir explorando.</strong>",
      type: "instruccion",
    },
  ];

  // Mostrar libreta desde el principio
  if (elements.btnLibreta) {
    elements.btnLibreta.style.display = "block";
  }

  // FUNCIONES PARA EL DIÁLOGO AUTOMÁTICO
  function mostrarDialogoAutomaticoParte(parte) {
    if (parte >= dialogoAutomaticoTexts.length) {
      ocultarDialogoAutomatico();
      dialogoAutomaticoTerminado = true;
      return;
    }

    const linea = dialogoAutomaticoTexts[parte];

    // Solo mostrar si no hay otros diálogos activos
    if (!dialogStarted) {
      if (elements.dialogueBox3 && elements.dialogueText3 && linea.character === 3) {
        elements.dialogueText3.innerHTML = linea.text;
        elements.dialogueBox3.style.display = "block";
        dialogoAutomaticoVisible = true;
        dialogoAutomaticoParte = parte + 1;
      }
    }
  }

  function ocultarDialogoAutomatico() {
    if (elements.dialogueBox3) elements.dialogueBox3.style.display = "none";
    dialogoAutomaticoVisible = false;
    dialogoAutomaticoParte = 0;
  }

  // FUNCIONES PARA EL DIÁLOGO ORIGINAL (mantenidas igual)
  function showNextDialogue() {
    console.log("showNextDialogue llamada, currentLine:", currentLine);

    if (dialogProcessing) {
      console.log("Dialog ya en proceso, saliendo");
      return;
    }
    dialogProcessing = true;

    // Manejar caso especial de instrucción final
    if (
      currentLine === dialogueLines.length - 1 &&
      elements.instruccionBox?.style.display === "block"
    ) {
      elements.instruccionBox.style.display = "none";
      if (!flechaVisible && elements.flecha) {
        elements.flecha.style.display = "block";
        flechaVisible = true;
      }
      dialogProcessing = false;
      return;
    }

    // Ocultar todos los diálogos anteriores
    if (elements.dialogueBox3) elements.dialogueBox3.style.display = "none";
    if (elements.dialogueBox9) elements.dialogueBox9.style.display = "none";
    if (elements.actionContainer) elements.actionContainer.style.display = "none";
    if (elements.instruccionBox) {
      elements.instruccionBox.innerHTML = "";
      elements.instruccionBox.classList.remove("instruccion");
      elements.instruccionBox.style.display = "none";
    }

    currentLine++;
    console.log("Avanzando a línea:", currentLine);

    if (currentLine >= dialogueLines.length) {
      console.log("Fin del diálogo");
      dialogProcessing = false;
      return;
    }

    const line = dialogueLines[currentLine];
    console.log("Procesando línea:", line);

    setTimeout(() => {
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

      // Mostrar elementos finales si es la última línea
      if (currentLine === dialogueLines.length - 1) {
        if (elements.btnLibreta) elements.btnLibreta.style.display = "block";
        if (elements.flecha) {
          elements.flecha.style.display = "block";
          flechaVisible = true;
        }
      }

      dialogProcessing = false;
    }, 100);
  }

  // Event listener para el personaje 9 (DIÁLOGO ORIGINAL)
  if (elements.personaje9) {
    console.log("Agregando event listener al personaje 9");
    elements.personaje9.style.cursor = "pointer";
    elements.personaje9.addEventListener("click", (e) => {
      console.log("¡Click en personaje 9 detectado!");
      e.stopPropagation();

      // Ocultar diálogo automático si está visible
      if (dialogoAutomaticoVisible) {
        ocultarDialogoAutomatico();
        dialogoAutomaticoTerminado = true;
      }

      if (!dialogStarted) {
        console.log("Iniciando diálogo original");
        dialogStarted = true;
        currentLine = -1;
        showNextDialogue();
      } else {
        console.log("Diálogo ya iniciado, avanzando");
        showNextDialogue();
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
    // No cerrar diálogo si el click es en diálogo o personaje9, para no cerrar por accidente
    const clickEnDialogoOElementosBloqueados =
      (elements.dialogueBox3 && elements.dialogueBox3.contains(e.target)) ||
      (elements.dialogueBox9 && elements.dialogueBox9.contains(e.target)) ||
      (elements.personaje9 && elements.personaje9.contains(e.target));

    // Verificar si click está dentro de elementos donde NO se debe avanzar el diálogo:
    const clickEnZonasBloqueadas = elements.iconosYLibreta.some(
      (el) => el && el.contains(e.target)
    );

    const hizoClickEnUI = e.target.closest(
      "#panelAjustes, #iconoModo, .modal, #btn-libreta, #iconoCasa, #personaje-9"
    );

    if (
      elements.panel &&
      elements.iconoModo &&
      !elements.panel.contains(e.target) &&
      !elements.iconoModo.contains(e.target)
    ) {
      elements.panel.classList.remove("visible");
      elements.iconoModo.classList.remove("activo");
    }

    // AVANZAR DIÁLOGO AUTOMÁTICO (si está activo y no terminado)
    if (
      dialogoAutomaticoVisible &&
      !dialogoAutomaticoTerminado &&
      !dialogStarted &&
      !hizoClickEnUI &&
      !clickEnZonasBloqueadas &&
      !clickEnDialogoOElementosBloqueados
    ) {
      console.log("Click global para avanzar diálogo automático");
      mostrarDialogoAutomaticoParte(dialogoAutomaticoParte);
    }

    // AVANZAR DIÁLOGO ORIGINAL (si ya se inició)
    if (
      dialogStarted &&
      !hizoClickEnUI &&
      !clickEnZonasBloqueadas &&
      !clickEnDialogoOElementosBloqueados
    ) {
      console.log("Click global para avanzar diálogo original");
      showNextDialogue();
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
      window.location.href = "../13_pantalla_minijuego3/pantalla_minijuego3.html";
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

  // ¡INICIAR EL DIÁLOGO AUTOMÁTICO AL CARGAR LA PÁGINA!
  mostrarDialogoAutomaticoParte(0);
});
