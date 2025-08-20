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
    instruccionBox: document.getElementById("instruccionBox"),
    dialogueBox3: document.getElementById("dialogueBox3"),
    dialogueBox4: document.getElementById("dialogueBox4"),
    dialogueText3: document.getElementById("dialogueText3"),
    dialogueText4: document.getElementById("dialogueText4"),
    actionContainer: document.getElementById("actionContainer"),
    actionText: document.getElementById("actionText"),
    flecha: document.getElementById("iconoFlecha"),
    confirmacionModal: document.getElementById("confirmacionModal"),
    confirmarBtn: document.getElementById("confirmarBtn"),
    cancelarBtn: document.getElementById("cancelarBtn"),
  };

  // State variables
  let haReproducidoMusica = false;
  let musicaActiva = true;
  let sonidoActivo = true;
  let currentLine = -1;
  let dialogProcessing = false;
  let flechaVisible = false;

  // Reproducir música si está disponible
  if (elements.musica && !haReproducidoMusica) {
    elements.musica.muted = false;
    elements.musica.currentTime = 0;
    elements.musica.volume = 0.1;
    elements.musica
      .play()
      .catch((e) => console.error("🎵 Error al reproducir música:", e));
    haReproducidoMusica = true;
  }

  // Diálogos
  const dialogueLines = [
    {
      character: 4,
      text: "¡Detective, por aquí! Gracias por venir tan rápido. Tenemos un problema… ¡Leotolda ha desaparecido!",
    },
    {
      character: 3,
      text: "¿Leotolda? ¿Quién es ella?",
    },
    {
      character: 4,
      text: "Una <strong>pasajera muy importante</strong>. Subió al tren anoche, pero esta mañana ya no estaba. Nadie la ha visto.",
    },
    {
      character: 3,
      text: "Hmm… Necesito hablar con el resto de pasajeros. ¡No se preocupe, encontraré a Leotolda!",
    },
    {
      action: "El jefe de la estación saca una libreta y se la entrega al detective.",
    },
    {
      character: 3,
      text: "Gracias, me será muy útil.",
    },
    {
      action:
        "¡Hora de investigar! <strong>Haz clic en la fecha para continuar</strong> la búsqueda <strong>y en los distintos objetos o personajes para descubrir pistas</strong>. ¡Recuerda que puedes consultar la libreta siempre que quieras!",
      type: "instruccion",
    },
  ];

  // Mostrar el primer diálogo automáticamente al cargar
  currentLine = 0;
  const firstLine = dialogueLines[0];
  if (firstLine.character === 4) {
    elements.dialogueText4.innerHTML = firstLine.text;
    elements.dialogueBox4.style.display = "block";
  }

  // Función para mostrar el siguiente diálogo
  function showNextDialogue() {
    if (dialogProcessing) return;
    dialogProcessing = true;

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

    if (!flechaVisible && elements.flecha) {
      elements.flecha.style.display = "none";
    }

    elements.dialogueBox3.style.display = "none";
    elements.dialogueBox4.style.display = "none";
    elements.actionContainer.style.display = "none";
    elements.instruccionBox.innerHTML = "";
    elements.instruccionBox.classList.remove("instruccion");
    elements.instruccionBox.style.display = "none";

    currentLine++;

    if (currentLine >= dialogueLines.length) {
      dialogProcessing = false;
      return;
    }

    const line = dialogueLines[currentLine];

    setTimeout(() => {
      if (line.type === "instruccion") {
        elements.instruccionBox.innerHTML = line.action;
        elements.instruccionBox.classList.add("instruccion");
        elements.instruccionBox.style.display = "block";
      } else if (line.character === 3) {
        elements.dialogueText3.innerHTML = line.text;
        elements.dialogueBox3.style.display = "block";
      } else if (line.character === 4) {
        elements.dialogueText4.innerHTML = line.text;
        elements.dialogueBox4.style.display = "block";
      } else if (line.action) {
        elements.actionText.innerHTML = line.action;
        elements.actionContainer.style.display = "block";
      }

      if (currentLine === dialogueLines.length - 1) {
        if (elements.btnLibreta) elements.btnLibreta.style.display = "block";
        if (elements.flecha) {
          elements.flecha.style.display = "block";
          flechaVisible = true;
        }
      }

      dialogProcessing = false;
    }, 50);
  }

  // Ocultar libreta al iniciar
  if (elements.btnLibreta) {
    elements.btnLibreta.style.display = "none";
  }

  // Eventos
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

  // Click principal para avanzar diálogo y cerrar ajustes si corresponde
  document.addEventListener("click", (e) => {
    const hizoClickEnUI = e.target.closest(
      "#panelAjustes, #iconoModo, .modal, #btn-libreta, #iconoCasa"
    );

    // Cerrar ajustes si se hizo clic fuera del panel e icono
    if (
      elements.panel &&
      elements.iconoModo &&
      !elements.panel.contains(e.target) &&
      !elements.iconoModo.contains(e.target)
    ) {
      elements.panel.classList.remove("visible");
      elements.iconoModo.classList.remove("activo");
    }

    if (!hizoClickEnUI) {
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
      window.location.href = "../3_pantalla_exploracion1/pantalla_exploracion1.html";
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
