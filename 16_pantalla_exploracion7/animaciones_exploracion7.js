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
    dialogueText3: document.getElementById("dialogueText3"),
    personaje3: document.getElementById("personaje-3"),
    confirmacionModal: document.getElementById("confirmacionModal"),
    confirmarBtn: document.getElementById("confirmarBtn"),
    cancelarBtn: document.getElementById("cancelarBtn"),
    iconosYLibreta: null,
  };

  elements.iconosYLibreta = [
    elements.panel,
    elements.iconoModo,
    elements.btnCasa,
    elements.btnLibreta,
    elements.modalLibreta,
    elements.confirmacionModal,
  ].filter(Boolean);

  let haReproducidoMusica = false;
  let musicaActiva = true;
  let sonidoActivo = true;

  let autoDialogCurrentLine = -1;
  let autoDialogProcessing = false;
  let autoDialogCompleted = false;

  if (elements.musica && !haReproducidoMusica) {
    elements.musica.muted = false;
    elements.musica.currentTime = 0;
    elements.musica.volume = 0.1;
    elements.musica
      .play()
      .catch((e) => console.error("🎵 Error al reproducir música:", e));
    haReproducidoMusica = true;
  }

  const autoDialogueLines = [
    {
      character: 3,
      text: "Bueno, hemos llegado al final del tren… pero no encontramos a Leotolda...",
    },
    {
      character: 3,
      text: "¡Espera! ¡Se me acaba de ocurrir algo! Tal vez tú podrías ayudarnos. Ya sabes cómo es Leotolda.",
    },
    {
      character: 3,
      text: "Ella es <strong>una pasajera muy importante, es muy alegre, tiene el pelo rizado y lleva un vestido colorido</strong>.",
    },
    {
      character: 3,
      text: "¡Vamos, detective! ¡A ver si podemos darle forma a nuestra búsqueda!",
    },
  ];

  function showNextAutoDialogue() {
    if (autoDialogProcessing) return;
    autoDialogProcessing = true;

    if (
      autoDialogCurrentLine === autoDialogueLines.length - 1 &&
      elements.instruccionBox?.style.display === "block"
    ) {
      elements.instruccionBox.style.display = "none";
      autoDialogCompleted = true;
      autoDialogProcessing = false;
      return;
    }

    hideAllDialogues();
    autoDialogCurrentLine++;

    if (autoDialogCurrentLine >= autoDialogueLines.length) {
      autoDialogCompleted = true;
      autoDialogProcessing = false;

      // Espera 1 segundo antes de redirigir
      setTimeout(() => {
        window.location.href = "../17_pantalla_final/pantalla_final.html";
      }, 1000);

      return;
    }

    const line = autoDialogueLines[autoDialogCurrentLine];

    setTimeout(() => {
      showDialogueLine(line);
      if (autoDialogCurrentLine === autoDialogueLines.length - 1) {
        if (elements.btnLibreta) elements.btnLibreta.style.display = "block";
      }
      autoDialogProcessing = false;
    }, 100);
  }

  function hideAllDialogues() {
    if (elements.dialogueBox3) elements.dialogueBox3.style.display = "none";
    if (elements.instruccionBox) {
      elements.instruccionBox.innerHTML = "";
      elements.instruccionBox.classList.remove("instruccion");
      elements.instruccionBox.style.display = "none";
    }
  }

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
      }
    }
  }

  setTimeout(() => {
    showNextAutoDialogue();
  }, 1000);

  if (elements.personaje3) {
    elements.personaje3.style.cursor = "pointer";
    elements.personaje3.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!autoDialogCompleted) {
        showNextAutoDialogue();
      }
    });
  }

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

  document.addEventListener("click", (e) => {
    const clickEnZonasBloqueadas = elements.iconosYLibreta.some(
      (el) => el && el.contains(e.target)
    );

    const hizoClickEnUI = e.target.closest(
      "#panelAjustes, #iconoModo, .modal, #btn-libreta, #iconoCasa, #confirmacionModal"
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

    if (hizoClickEnUI || clickEnZonasBloqueadas) return;

    if (!autoDialogCompleted) {
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

    if (event?.target && elements.iconoModo.contains(event.target)) {
      elements.panel.classList.toggle("visible");
      elements.iconoModo.classList.toggle(
        "activo",
        elements.panel.classList.contains("visible")
      );
      return;
    }

    if (!elements.panel.contains(event?.target)) {
      elements.panel.classList.remove("visible");
      elements.iconoModo.classList.remove("activo");
    }
  }

  window.irALaCasa = function () {
    if (elements.confirmacionModal) elements.confirmacionModal.style.display = "flex";
  };

  window.cambiarModo = function (e) {
    cambiarModo(e);
  };
});
