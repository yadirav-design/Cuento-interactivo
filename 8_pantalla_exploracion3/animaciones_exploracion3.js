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
    dialogueBox6: document.getElementById("dialogueBox6"),
    dialogueText3: document.getElementById("dialogueText3"),
    dialogueText6: document.getElementById("dialogueText6"),
    reloj: document.getElementById("reloj"),
    actionContainer: document.getElementById("actionContainer"),
    actionText: document.getElementById("actionText"),
    flecha: document.getElementById("iconoFlecha"),
    confirmacionModal: document.getElementById("confirmacionModal"),
    confirmarBtn: document.getElementById("confirmarBtn"),
    cancelarBtn: document.getElementById("cancelarBtn"),
    personaje6: document.getElementById("personaje-6"),
    iconosYLibreta: null, // para detectar zonas bloqueadas
  };

  // Definimos los elementos donde NO se debe avanzar el diálogo al click:
  // Iconos, modal libreta y reloj (incluyendo interior)
  elements.iconosYLibreta = [
    elements.panel,
    elements.iconoModo,
    elements.btnCasa,
    elements.btnLibreta,
    elements.modalLibreta,
    elements.flecha,
    elements.confirmacionModal,
    elements.reloj,
  ].filter(Boolean);

  let haReproducidoMusica = false;
  let musicaActiva = true;
  let sonidoActivo = true;
  let currentLine = -1;
  let dialogProcessing = false;
  let flechaVisible = false;
  let dialogStarted = false;

  // Variables para el diálogo del reloj
  let dialogVisibleReloj = false;

  // Verificar que los elementos críticos existen
  console.log("Personaje 6 encontrado:", elements.personaje6);
  console.log("DialogueBox6 encontrado:", elements.dialogueBox6);
  console.log("DialogueText6 encontrado:", elements.dialogueText6);
  console.log("Reloj encontrado:", elements.reloj);

  if (elements.musica && !haReproducidoMusica) {
    elements.musica.muted = false;
    elements.musica.currentTime = 0;
    elements.musica.volume = 0.1;
    elements.musica
      .play()
      .catch((e) => console.error("🎵 Error al reproducir música:", e));
    haReproducidoMusica = true;
  }

  const dialogueLines = [
    {
      character: 3,
      text: "Disculpa, tú debes de ser Mariló.",
    },
    {
      character: 6,
      text: "¿Eh? Sí, soy yo. ¿Qué está pasando?",
    },
    {
      character: 3,
      text: "Estoy investigando la desaparición de Leotolda. Encontré esta fotografía y quería saber más. ¿Qué relación tenías con ella?",
    },
    {
      character: 6,
      text: "Nos conocimos ayer en el vagón, nos hicimos amigas y me preguntó si podía tomarme una foto.",
    },
    {
      character: 6,
      text: "<strong>Leotolda es muy alegre</strong>, siempre sonriendo.",
    },
    {
      character: 6,
      text: "Después de eso se fue al siguiente vagón, dijo que quería descansar un rato.",
    },
    {
      character: 3,
      text: "Gracias, Mariló. Creo que voy a echar un vistazo a ese vagón, tal vez allí encontremos más pistas.",
    },
    {
      action:
        "¡Leotolda se fue al siguiente vagón! <strong>Pulsa la flecha para seguir explorando.</strong>",
      type: "instruccion",
    },
  ];

  // Mostrar libreta desde el principio
  if (elements.btnLibreta) {
    elements.btnLibreta.style.display = "block";
  }

  // Funciones para el diálogo del reloj
  function mostrarDialogoReloj() {
    // Primero intentamos usar un dialogueBox específico para el reloj
    const dialogueBoxReloj = document.getElementById("dialogueBoxReloj");
    const dialogueTextReloj = document.getElementById("dialogueTextReloj");

    if (dialogueBoxReloj && dialogueTextReloj) {
      // Si existe un diálogo específico para el reloj, lo usamos
      dialogueTextReloj.textContent =
        "Es un reloj muy elegante pero va con retraso... Igual que el tren";
      dialogueBoxReloj.style.display = "block";
    } else if (elements.dialogueBox3 && elements.dialogueText3) {
      // Si no, usamos el dialogueBox6 (que no debería estar activo durante la interacción con el reloj)
      elements.dialogueText3.textContent =
        "Es un reloj muy elegante pero va con retraso... Igual que el tren.";
      elements.dialogueBox3.style.display = "block";
    } else {
      // Como último recurso, creamos un diálogo temporal
      console.log("Creando diálogo temporal para el reloj");
      const tempDialog = document.createElement("div");
      tempDialog.id = "tempDialogReloj";
      tempDialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 1000;
        max-width: 300px;
        text-align: center;
      `;
      tempDialog.textContent =
        "Es un reloj muy elegante pero va con retraso... Igual que el tren.";
      document.body.appendChild(tempDialog);
    }
    dialogVisibleReloj = true;
    console.log("Diálogo del reloj mostrado");
  }

  function ocultarDialogoReloj() {
    // Ocultar diálogo específico del reloj
    const dialogueBoxReloj = document.getElementById("dialogueBoxReloj");
    if (dialogueBoxReloj) {
      dialogueBoxReloj.style.display = "none";
    }

    // Ocultar diálogo temporal si existe
    const tempDialog = document.getElementById("tempDialogReloj");
    if (tempDialog) {
      tempDialog.remove();
    }

    // Si estamos usando dialogueBox6, lo ocultamos
    if (elements.dialogueBox6) {
      elements.dialogueBox6.style.display = "none";
    }

    dialogVisibleReloj = false;
    console.log("Diálogo del reloj ocultado");
  }

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
    if (elements.dialogueBox6) elements.dialogueBox6.style.display = "none";
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
      } else if (line.character === 6) {
        if (elements.dialogueText6 && elements.dialogueBox6) {
          elements.dialogueText6.innerHTML = line.text;
          elements.dialogueBox6.style.display = "block";
          console.log("Mostrando diálogo del personaje 6");
        } else {
          console.error("Error: elementos de diálogo del personaje 6 no encontrados");
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
    }, 100); // Incrementé el delay para mejor visualización
  }

  // Event listener para el reloj
  if (elements.reloj) {
    elements.reloj.style.cursor = "pointer"; // Añadir cursor pointer para indicar que es clickeable
    elements.reloj.addEventListener("click", (event) => {
      console.log("¡Click en reloj detectado!");
      event.stopPropagation();
      event.preventDefault();

      if (dialogVisibleReloj) {
        console.log("Ocultando diálogo del reloj");
        ocultarDialogoReloj();
      } else {
        console.log("Mostrando diálogo del reloj");
        mostrarDialogoReloj();
      }
    });
    console.log("Event listener del reloj añadido correctamente");
  } else {
    console.warn("⚠️ No se encontró el reloj");
  }

  // Event listener para el personaje 6
  if (elements.personaje6) {
    console.log("Agregando event listener al personaje 6");
    elements.personaje6.style.cursor = "pointer";
    elements.personaje6.addEventListener("click", (e) => {
      console.log("¡Click en personaje 6 detectado!");
      e.stopPropagation();
      if (!dialogStarted) {
        console.log("Iniciando diálogo");
        dialogStarted = true;
        currentLine = -1;
        showNextDialogue();
      } else {
        console.log("Diálogo ya iniciado, avanzando");
        showNextDialogue();
      }
    });
  } else {
    console.error("¡ERROR: Elemento personaje-6 no encontrado!");
  }

  // Resto de event listeners...
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
    // No cerrar diálogo si el click es en diálogo o reloj o personaje6, para no cerrar por accidente
    const clickEnDialogoOElementosBloqueados =
      (elements.dialogueBox3 && elements.dialogueBox3.contains(e.target)) ||
      (elements.dialogueBox6 && elements.dialogueBox6.contains(e.target)) ||
      (elements.reloj && elements.reloj.contains(e.target)) ||
      (elements.personaje6 && elements.personaje6.contains(e.target));

    // Verificar si click está dentro de elementos donde NO se debe avanzar el diálogo:
    const clickEnZonasBloqueadas = elements.iconosYLibreta.some(
      (el) => el && el.contains(e.target)
    );

    const hizoClickEnUI = e.target.closest(
      "#panelAjustes, #iconoModo, .modal, #btn-libreta, #iconoCasa, #personaje-6"
    );

    // Manejar diálogo del reloj: click fuera oculta diálogo del reloj
    if (
      dialogVisibleReloj &&
      elements.reloj &&
      !elements.reloj.contains(e.target) &&
      !document.getElementById("dialogueBoxReloj")?.contains(e.target) &&
      !document.getElementById("tempDialogReloj")?.contains(e.target) &&
      !elements.dialogueBox6?.contains(e.target)
    ) {
      console.log("Click fuera del reloj, ocultando diálogo");
      ocultarDialogoReloj();
    }

    if (
      elements.panel &&
      elements.iconoModo &&
      !elements.panel.contains(e.target) &&
      !elements.iconoModo.contains(e.target)
    ) {
      elements.panel.classList.remove("visible");
      elements.iconoModo.classList.remove("activo");
    }

    // Solo avanzar diálogo si ya se inició y no se hizo click en UI o zonas bloqueadas
    if (
      dialogStarted &&
      !hizoClickEnUI &&
      !clickEnZonasBloqueadas &&
      !clickEnDialogoOElementosBloqueados
    ) {
      console.log("Click global para avanzar diálogo");
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
      window.location.href = "../9_pantalla_exploracion4/pantalla_exploracion4.html";
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
