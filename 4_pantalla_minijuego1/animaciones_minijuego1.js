document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const musica = document.getElementById("musicaFondo");
  const switchMusica = document.getElementById("switchMusica");
  const switchSonido = document.getElementById("switchSonido");
  const panelAjustes = document.getElementById("panelAjustes");
  const iconoModo = document.getElementById("iconoModo");
  const btnCasa = document.getElementById("iconoCasa");
  const confirmacionModal = document.getElementById("confirmacionModal");
  const confirmarBtn = document.getElementById("confirmarBtn");
  const cancelarBtn = document.getElementById("cancelarBtn");
  const btnLibreta = document.getElementById("btn-libreta");
  const modalLibreta = document.getElementById("modal-libreta");
  const closeButtons = document.querySelectorAll(".close");
  const instruccionBox = document.getElementById("instruccionBox");
  const iconoFlecha = document.getElementById("iconoFlecha");

  let musicaActiva = true;
  let sonidoActivo = true;

  // Música de fondo
  if (musica) {
    musica.muted = false;
    musica.currentTime = 0;
    musica.volume = 0.1;
    musica.play().catch(() => {});
  }

  // Cambiar estado de los switches
  function toggleSwitch(switchImg, estado) {
    if (switchImg) {
      switchImg.src = estado ? "./media/off.png" : "./media/on.png";
    }
    return !estado;
  }

  // Panel de ajustes
  if (switchMusica) {
    switchMusica.addEventListener("click", (e) => {
      e.stopPropagation();
      musicaActiva = toggleSwitch(switchMusica, musicaActiva);
      if (musica) musica.muted = !musicaActiva;
    });
  }

  if (switchSonido) {
    switchSonido.addEventListener("click", (e) => {
      e.stopPropagation();
      sonidoActivo = toggleSwitch(switchSonido, sonidoActivo);
    });
  }

  if (iconoModo) {
    iconoModo.addEventListener("click", (e) => {
      e.stopPropagation();
      panelAjustes.classList.toggle("visible");
    });
  }

  document.addEventListener("click", (e) => {
    if (
      panelAjustes &&
      iconoModo &&
      !panelAjustes.contains(e.target) &&
      !iconoModo.contains(e.target)
    ) {
      panelAjustes.classList.remove("visible");
    }
  });

  // Modal de confirmación para volver a inicio
  if (btnCasa) {
    btnCasa.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirmacionModal) confirmacionModal.style.display = "flex";
    });
  }

  if (confirmarBtn) {
    confirmarBtn.addEventListener("click", () => {
      window.location.href = "../1_pantalla_inicio/pantalla_inicio.html";
    });
  }

  if (cancelarBtn) {
    cancelarBtn.addEventListener("click", () => {
      if (confirmacionModal) confirmacionModal.style.display = "none";
    });
  }

  // Cerrar modal al hacer clic fuera
  window.addEventListener("click", (e) => {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });

  // Modal de libreta
  if (btnLibreta && modalLibreta) {
    btnLibreta.addEventListener("click", (e) => {
      e.stopPropagation();
      modalLibreta.style.display = "flex";
    });
  }

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const modal = btn.closest(".modal");
      if (modal) modal.style.display = "none";
    });
  });

  // Mostrar instrucción inicial
  const dialogueLines = [
    {
      action:
        "¡Parece que esta maleta esconde algo interesante! <strong>Haz clic en los objetos para moverlos y descubrir qué hay debajo</strong>. ¡Manos a la obra, detective!",
      type: "instruccion",
    },
  ];

  if (instruccionBox && dialogueLines.length > 0) {
    const instruccion = dialogueLines.find((line) => line.type === "instruccion");
    if (instruccion) {
      instruccionBox.style.display = "block";
      instruccionBox.innerHTML = instruccion.action;
    }
  }

  // FUNCIONALIDAD PRINCIPAL: Animar objetos al hacer clic
  const objetos = ["ropa", "zapatos", "gafas", "libro", "camara"];
  let objetosMovidos = 0;

  objetos.forEach((id) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      // Debug: mostrar que el elemento es clickeable
      console.log(`Elemento ${id} encontrado y listo para click`);

      elemento.addEventListener("click", (e) => {
        e.stopPropagation();
        console.log(`Click en ${id}`);

        // Verificar que el objeto no haya sido movido ya
        if (!elemento.classList.contains("fuera-" + id)) {
          elemento.classList.add("fuera-" + id);
          objetosMovidos++;

          // Mostrar flecha cuando todos los objetos estén movidos
          if (objetosMovidos >= objetos.length && iconoFlecha) {
            iconoFlecha.style.display = "block";
            console.log("Todos los objetos movidos - mostrando flecha");
            if (instruccionBox) {
              instruccionBox.innerHTML =
                "¡Excelente trabajo, detective! Tu astucia ha dado frutos. Ahora, <strong>pulsa la flecha para continuar</strong>.";
            }
          }
        }
      });

      // Evento hover para mostrar feedback visual adicional
      elemento.addEventListener("mouseenter", () => {
        if (!elemento.classList.contains("fuera-" + id)) {
          elemento.style.filter = "brightness(1.2)";
        }
      });

      elemento.addEventListener("mouseleave", () => {
        elemento.style.filter = "brightness(1)";
      });
    } else {
      console.error(`Elemento ${id} no encontrado`);
    }
  });

  // Debug: verificar posicionamiento después de cargar
  setTimeout(() => {
    console.log("=== VERIFICACIÓN DE POSICIONAMIENTO ===");
    objetos.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(el);
        console.log(`${id}:`, {
          position: {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          },
          zIndex: computedStyle.zIndex,
          pointerEvents: computedStyle.pointerEvents,
          display: computedStyle.display,
        });
      }
    });
  }, 1000);

  // Debug: agregar event listener general para verificar todos los clicks
  document.addEventListener("click", (e) => {
    console.log("Click detectado en:", e.target.id || e.target.tagName, e.target);
  });
});

// Flecha para avanzar
if (iconoFlecha) {
  iconoFlecha.addEventListener("click", () => {
    window.location.href = "../5_pantalla_minijuego1_1/pantalla_minijuego1_1.html";
  });
}
