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
    confirmacionModal: document.getElementById("confirmacionModal"),
    confirmarBtn: document.getElementById("confirmarBtn"),
    cancelarBtn: document.getElementById("cancelarBtn"),

    lienzo: document.getElementById("lienzo"),
    colorPicker: document.getElementById("color"),
    grosorRange: document.getElementById("grosor"),
    btnBorrarTodo: document.getElementById("borrarTodo"),
    btnModoBorrador: document.getElementById("modoBorrador"),
    btnGuardar: document.getElementById("guardar"),

    instruccionBox: document.getElementById("instruccionBox"),
    actionContainer: document.getElementById("actionContainer"),
    fondoNegro: document.getElementById("fondoNegro"),
  };

  const iconosYLibreta = [
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
  let instruccionActual = 0;

  const instrucciones = [
    {
      action:
        "¡Bien hecho detective has resuelto el misterio! Ahora deja volar tu imaginación. **Usa el ratón para dibujar** a Leotolda en la pizarra digital. **Puedes elegir tus colores favoritos, cambiar el grosor del lápiz y borrar si te equivocas**. Cuando termines, puedes **guardar tu dibujo** como un recuerdo mágico de esta historia tan misteriosa.",
      type: "instruccion",
    },
  ];

  mostrarInstruccionesIniciales();

  if (elements.musica && !haReproducidoMusica) {
    elements.musica.muted = false;
    elements.musica.currentTime = 0;
    elements.musica.volume = 0.1;
    elements.musica
      .play()
      .catch((e) => console.error("🎵 Error al reproducir música:", e));
    haReproducidoMusica = true;
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

  if (elements.btnCasa && elements.confirmacionModal) {
    elements.btnCasa.addEventListener("click", (e) => {
      e.stopPropagation();
      elements.confirmacionModal.style.display = "flex";
    });
  }

  elements.closeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllModals();
    });
  });

  if (elements.confirmarBtn) {
    elements.confirmarBtn.addEventListener("click", () => {
      window.location.href = "../1_pantalla_inicio/pantalla_inicio.html";
    });
  }

  if (elements.cancelarBtn && elements.confirmacionModal) {
    elements.cancelarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      elements.confirmacionModal.style.display = "none";
    });
  }

  window.addEventListener("click", (event) => {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (event.target === modal) modal.style.display = "none";
    });
  });

  document.addEventListener("click", (e) => {
    if (
      elements.panel &&
      elements.iconoModo &&
      !elements.panel.contains(e.target) &&
      !elements.iconoModo.contains(e.target)
    ) {
      elements.panel.classList.remove("visible");
      elements.panel.classList.add("oculto");
      elements.iconoModo.classList.remove("activo");
    }
  });

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
    document.querySelectorAll(".modal").forEach((m) => (m.style.display = "none"));
  }

  function cambiarModo(event) {
    if (!elements.panel || !elements.iconoModo) return;

    if (event?.target && elements.iconoModo.contains(event.target)) {
      const esVisible = elements.panel.classList.contains("visible");

      if (esVisible) {
        elements.panel.classList.remove("visible");
        elements.panel.classList.add("oculto");
        elements.iconoModo.classList.remove("activo");
      } else {
        elements.panel.classList.add("visible");
        elements.panel.classList.remove("oculto");
        elements.iconoModo.classList.add("activo");
      }
    }
  }

  function mostrarInstruccionesIniciales() {
    if (elements.fondoNegro && elements.instruccionBox) {
      elements.fondoNegro.style.display = "block";
      mostrarInstruccion(0);
      // Activar avanzar instrucciones solo después de mostrar la primera
      document.addEventListener("click", avanzarInstruccion);
    }
  }

  function mostrarInstruccion(indice) {
    if (indice < instrucciones.length && elements.instruccionBox) {
      const instruccion = instrucciones[indice];
      let textoHTML = instruccion.action.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
      );
      elements.instruccionBox.innerHTML = textoHTML;
      elements.instruccionBox.style.display = "block";
    }
  }

  function avanzarInstruccion(e) {
    if (elements.fondoNegro && elements.fondoNegro.style.display === "block") {
      e.stopPropagation();
      instruccionActual++;
      if (instruccionActual < instrucciones.length) {
        mostrarInstruccion(instruccionActual);
      } else {
        elements.fondoNegro.style.display = "none";
        elements.instruccionBox.style.display = "none";
        // Remover el listener cuando ya no hay más instrucciones
        document.removeEventListener("click", avanzarInstruccion);
      }
    }
  }

  window.irALaCasa = () => {
    if (elements.confirmacionModal) elements.confirmacionModal.style.display = "flex";
  };

  window.cambiarModo = (e) => {
    cambiarModo(e);
  };

  if (
    !elements.lienzo ||
    !elements.colorPicker ||
    !elements.grosorRange ||
    !elements.btnBorrarTodo ||
    !elements.btnModoBorrador ||
    !elements.btnGuardar
  ) {
    console.warn("Faltan elementos para la pizarra, no se inicializa.");
    return;
  }

  const ctx = elements.lienzo.getContext("2d");
  let dibujando = false;
  let borradorActivo = false;
  let colorActual = elements.colorPicker.value;
  let grosorActual = elements.grosorRange.value;

  function ajustarTamañoCanvas() {
    const rect = elements.lienzo.getBoundingClientRect();
    elements.lienzo.width = rect.width;
    elements.lienzo.height = rect.height;
  }

  window.addEventListener("resize", ajustarTamañoCanvas);
  ajustarTamañoCanvas();

  elements.colorPicker.addEventListener("input", (e) => {
    colorActual = e.target.value;
    if (borradorActivo) {
      borradorActivo = false;
      elements.btnModoBorrador.classList.remove("activado");
    }
  });

  elements.grosorRange.addEventListener("input", (e) => {
    grosorActual = e.target.value;
  });

  elements.btnBorrarTodo.addEventListener("click", () => {
    ctx.clearRect(0, 0, elements.lienzo.width, elements.lienzo.height);
  });

  elements.btnModoBorrador.addEventListener("click", () => {
    borradorActivo = !borradorActivo;
    elements.btnModoBorrador.classList.toggle("activado", borradorActivo);
  });

  elements.btnGuardar.addEventListener("click", () => {
    const enlace = document.createElement("a");
    enlace.download = "dibujo_leotolda.png";
    enlace.href = elements.lienzo.toDataURL("image/png");
    enlace.click();

    // Esperar un momento para asegurar que la descarga comience
    setTimeout(() => {
      window.location.href = "../18_pantalla_despedida/pantalla_despedida.html"; // Cambia la ruta a la pantalla de destino
    }, 1000); // 1 segundo de espera (ajustable)
  });

  function obtenerPosicion(e) {
    const rect = elements.lienzo.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function iniciarDibujo(e) {
    dibujando = true;
    const pos = obtenerPosicion(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function dibujar(e) {
    if (!dibujando) return;
    const pos = obtenerPosicion(e);
    ctx.lineWidth = grosorActual;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (borradorActivo) {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = colorActual;
    }

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function terminarDibujo() {
    if (dibujando) {
      dibujando = false;
      ctx.globalCompositeOperation = "source-over";
    }
  }

  elements.lienzo.addEventListener("mousedown", iniciarDibujo);
  elements.lienzo.addEventListener("mousemove", dibujar);
  elements.lienzo.addEventListener("mouseup", terminarDibujo);
  elements.lienzo.addEventListener("mouseout", terminarDibujo);

  elements.lienzo.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    elements.lienzo.dispatchEvent(mouseEvent);
  });

  elements.lienzo.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    elements.lienzo.dispatchEvent(mouseEvent);
  });

  elements.lienzo.addEventListener("touchend", (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent("mouseup", {});
    elements.lienzo.dispatchEvent(mouseEvent);
  });

  console.log("✅ Pizarra inicializada correctamente...");
});
