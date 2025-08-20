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
    dialogueText3: document.getElementById("dialogueText3"),
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

  // Debug: Verificar que los elementos existen
  console.log("🔍 Elementos encontrados:", {
    dialogueBox3: !!elements.dialogueBox3,
    dialogueText3: !!elements.dialogueText3,
    actionContainer: !!elements.actionContainer,
    actionText: !!elements.actionText,
    instruccionBox: !!elements.instruccionBox,
    flecha: !!elements.flecha,
  });

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

  // Diálogos simplificados - solo personaje 3 y acciones
  const dialogueLines = [
    {
      character: 3,
      text: "¡Misión cumplida, detective! Has seguido todas las pistas, resuelto el misterio y demostrado que tienes un ojo de águila para descubrir la verdad.",
    },
    {
      character: 3,
      text: "El caso está cerrado, pero siempre hay más aventuras esperando… ¿te atreves a volver a investigar?",
    },
    {
      character: 3,
      text: "<strong>Pulsa el icono de la casa para reiniciar la aventura</strong>. Las pistas están listas y el misterio te espera…",
    },
  ];

  // Función para ocultar todos los elementos de diálogo
  function hideAllDialogueElements() {
    console.log("🫥 Ocultando todos los elementos de diálogo");

    if (elements.dialogueBox3) {
      elements.dialogueBox3.style.display = "none";
      console.log("📦 dialogueBox3 oculto");
    }
    if (elements.actionContainer) {
      elements.actionContainer.style.display = "none";
      console.log("📦 actionContainer oculto");
    }
    if (elements.instruccionBox) {
      elements.instruccionBox.style.display = "none";
      elements.instruccionBox.innerHTML = "";
      elements.instruccionBox.classList.remove("instruccion");
      console.log("📦 instruccionBox oculto");
    }
    if (elements.flecha && !flechaVisible) {
      elements.flecha.style.display = "none";
      console.log("📦 flecha oculta");
    }
  }

  // Ocultar todos los elementos de diálogo inicialmente
  hideAllDialogueElements();

  // Ocultar libreta al iniciar
  if (elements.btnLibreta) {
    elements.btnLibreta.style.display = "none";
  }

  // Función para mostrar el siguiente diálogo
  function showNextDialogue() {
    if (dialogProcessing) {
      console.log("⏳ Diálogo en proceso, ignorando click");
      return;
    }

    dialogProcessing = true;
    console.log(`🎭 Mostrando diálogo ${currentLine + 1}/${dialogueLines.length}`);

    // Si estamos en la última línea y es una instrucción, mostrar la flecha
    if (
      currentLine === dialogueLines.length - 1 &&
      elements.instruccionBox?.style.display === "block"
    ) {
      console.log("🏁 Última instrucción, mostrando flecha");
      setTimeout(() => {
        if (elements.flecha) {
          elements.flecha.style.display = "block";
          flechaVisible = true;
          console.log("➡️ Flecha mostrada");
        }
      }, 2000);
      dialogProcessing = false;
      return;
    }

    // Ocultar flecha si está visible (excepto al final)
    if (flechaVisible && elements.flecha && currentLine < dialogueLines.length - 1) {
      elements.flecha.style.display = "none";
      flechaVisible = false;
      console.log("➡️ Flecha oculta temporalmente");
    }

    // Ocultar todos los elementos de diálogo
    hideAllDialogueElements();

    currentLine++;

    // Si hemos llegado al final de los diálogos
    if (currentLine >= dialogueLines.length) {
      console.log("🏁 Todos los diálogos mostrados");
      dialogProcessing = false;
      return;
    }

    const line = dialogueLines[currentLine];
    console.log("📝 Procesando línea:", line);

    // Pequeño delay para suavizar la transición
    setTimeout(() => {
      if (line.type === "instruccion") {
        console.log("📋 Mostrando instrucción");
        if (elements.instruccionBox) {
          elements.instruccionBox.innerHTML = line.action;
          elements.instruccionBox.classList.add("instruccion");
          elements.instruccionBox.style.display = "block";
        } else {
          console.error("❌ instruccionBox no encontrado");
        }
      } else if (line.character === 3) {
        console.log("🕵️ Mostrando diálogo del detective (personaje 3)");
        if (elements.dialogueText3 && elements.dialogueBox3) {
          elements.dialogueText3.innerHTML = line.text;
          elements.dialogueBox3.style.display = "block";
        } else {
          console.error("❌ dialogueBox3 o dialogueText3 no encontrados");
        }
      } else if (line.action) {
        console.log("🎬 Mostrando acción");
        if (elements.actionText && elements.actionContainer) {
          elements.actionText.innerHTML = line.action;
          elements.actionContainer.style.display = "block";
        } else {
          console.error("❌ actionContainer o actionText no encontrados");
        }
      }

      // Si es la última línea, mostrar la libreta
      if (currentLine === dialogueLines.length - 1) {
        console.log("🏁 Última línea, mostrando libreta");
        if (elements.btnLibreta) {
          elements.btnLibreta.style.display = "block";
        }
      }

      dialogProcessing = false;
      console.log("✅ Diálogo procesado correctamente");
    }, 300); // Aumento el delay un poco para mejor efecto
  }

  // Iniciar el primer diálogo automáticamente después de un delay
  console.log("🚀 Iniciando sistema de diálogos...");
  setTimeout(() => {
    console.log("▶️ Mostrando primer diálogo");
    showNextDialogue();
  }, 1000);

  // Eventos de los switches
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

  // Click principal para avanzar diálogo y cerrar ajustes
  document.addEventListener("click", (e) => {
    const hizoClickEnUI = e.target.closest(
      "#panelAjustes, #iconoModo, .modal, #btn-libreta, #iconoCasa, #iconoFlecha"
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

    // Solo avanzar diálogo si no se hizo clic en UI específica
    if (!hizoClickEnUI && currentLine < dialogueLines.length) {
      console.log("👆 Click para avanzar diálogo");
      showNextDialogue();
    }
  });

  // Resto de eventos
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
    elements.flecha.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log("➡️ Click en flecha, navegando...");
      window.location.href = "../3_pantalla_exploracion1/pantalla_exploracion1.html";
    });
  }

  // Funciones auxiliares
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
