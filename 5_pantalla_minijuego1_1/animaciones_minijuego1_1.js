document.addEventListener("DOMContentLoaded", () => {
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
  const piezas = document.querySelectorAll(".trozo");

  let musicaActiva = true;
  let sonidoActivo = true;
  let piezasColocadas = new Set();
  let puzzleCompletado = false;

  if (musica) {
    musica.muted = false;
    musica.currentTime = 0;
    musica.volume = 0.1;
    musica.play().catch(() => {});
  }

  function toggleSwitch(switchImg, estado) {
    if (switchImg) {
      switchImg.src = estado ? "./media/off.png" : "./media/on.png";
    }
    return !estado;
  }

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

  window.addEventListener("click", (e) => {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });

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

  const posicionesIniciales = {};

  piezas.forEach((pieza) => {
    const computedStyle = window.getComputedStyle(pieza);
    posicionesIniciales[pieza.id] = {
      left: parseInt(computedStyle.left) || pieza.offsetLeft,
      top: parseInt(computedStyle.top) || pieza.offsetTop,
    };

    let offsetX = 0;
    let offsetY = 0;
    let arrastrando = false;

    pieza.addEventListener("mousedown", (e) => {
      e.preventDefault();
      if (pieza.classList.contains("colocada")) return;

      arrastrando = true;
      const piezaRect = pieza.getBoundingClientRect();
      offsetX = e.clientX - piezaRect.left;
      offsetY = e.clientY - piezaRect.top;

      pieza.style.cursor = "grabbing";
      pieza.style.zIndex = 1000;
      pieza.classList.add("arrastrando");

      const mover = (e) => {
        if (!arrastrando) return;
        const nuevaX = e.clientX - offsetX;
        const nuevaY = e.clientY - offsetY;

        pieza.style.left = `${nuevaX}px`;
        pieza.style.top = `${nuevaY}px`;

        resaltarTargetsCercanos(pieza);
      };

      const soltar = (e) => {
        if (!arrastrando) return;
        arrastrando = false;

        document.removeEventListener("mousemove", mover);
        document.removeEventListener("mouseup", soltar);

        pieza.style.cursor = "grab";
        pieza.style.zIndex = 10;
        pieza.classList.remove("arrastrando");

        document.querySelectorAll(".target").forEach((target) => {
          target.classList.remove("target-resaltado");
        });

        verificarEncaje(pieza);
      };

      document.addEventListener("mousemove", mover);
      document.addEventListener("mouseup", soltar);
    });
  });

  function resaltarTargetsCercanos(pieza) {
    const targetId = "target" + pieza.id.replace("trozo", "");
    const target = document.getElementById(targetId);
    if (!target) return;

    const piezaRect = pieza.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const centroXPieza = piezaRect.left + piezaRect.width / 2;
    const centroYPieza = piezaRect.top + piezaRect.height / 2;
    const centroXTarget = targetRect.left + targetRect.width / 2;
    const centroYTarget = targetRect.top + targetRect.height / 2;

    const distanciaX = Math.abs(centroXPieza - centroXTarget);
    const distanciaY = Math.abs(centroYPieza - centroYTarget);

    document.querySelectorAll(".target").forEach((t) => {
      t.classList.remove("target-resaltado");
    });

    if (distanciaX < 80 && distanciaY < 80) {
      target.classList.add("target-resaltado");
    }
  }

  function verificarEncaje(pieza) {
    const targetId = "target" + pieza.id.replace("trozo", "");
    const target = document.getElementById(targetId);

    if (!target) {
      regresarAPosicionInicial(pieza);
      return;
    }

    const piezaRect = pieza.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const centroXPieza = piezaRect.left + piezaRect.width / 2;
    const centroYPieza = piezaRect.top + piezaRect.height / 2;
    const centroXTarget = targetRect.left + targetRect.width / 2;
    const centroYTarget = targetRect.top + targetRect.height / 2;

    const distanciaX = Math.abs(centroXPieza - centroXTarget);
    const distanciaY = Math.abs(centroYPieza - centroYTarget);

    const tolerancia = 50;

    if (distanciaX < tolerancia && distanciaY < tolerancia) {
      colocarEnTarget(pieza, target);
    } else {
      regresarAPosicionInicial(pieza);
    }
  }

  function colocarEnTarget(pieza, target) {
    const targetRect = target.getBoundingClientRect();
    const nuevaX = targetRect.left + targetRect.width / 2 - pieza.offsetWidth / 2;
    const nuevaY = targetRect.top + targetRect.height / 2 - pieza.offsetHeight / 2;

    pieza.style.transition = "all 0.4s ease";
    pieza.style.left = `${nuevaX}px`;
    pieza.style.top = `${nuevaY}px`;

    pieza.classList.add("colocada");
    target.classList.add("ocupado");

    setTimeout(() => {
      pieza.style.transition = "none";
    }, 400);

    if (!piezasColocadas.has(pieza.id)) {
      piezasColocadas.add(pieza.id);
    }

    if (piezasColocadas.size === piezas.length && !puzzleCompletado) {
      puzzleCompletado = true;

      setTimeout(() => {
        window.location.href = "../6_pantalla_exito/pantalla_exito.html";
      }, 3000);
    }
  }

  function regresarAPosicionInicial(pieza) {
    const original = posicionesIniciales[pieza.id];
    if (original) {
      pieza.style.transition = "all 0.4s ease";
      pieza.style.left = `${original.left}px`;
      pieza.style.top = `${original.top}px`;

      piezasColocadas.delete(pieza.id);
      pieza.classList.remove("colocada");

      const targetId = "target" + pieza.id.replace("trozo", "");
      const target = document.getElementById(targetId);
      if (target) {
        target.classList.remove("ocupado");
      }

      setTimeout(() => {
        pieza.style.transition = "none";
      }, 400);
    }
  }

  piezas.forEach((pieza) => {
    pieza.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      pieza.dispatchEvent(mouseEvent);
    });

    document.addEventListener("touchmove", (e) => {
      if (e.target === pieza || pieza.classList.contains("arrastrando")) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousemove", {
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
        document.dispatchEvent(mouseEvent);
      }
    });

    document.addEventListener("touchend", () => {
      const mouseEvent = new MouseEvent("mouseup", {});
      document.dispatchEvent(mouseEvent);
    });
  });

  if (instruccionBox) {
    instruccionBox.textContent =
      "¡Tienes trozos de una fotografía! Arrastra los fragmentos y colócalos en el espacio rectangular para completar la imagen.";
    instruccionBox.style.display = "block";
  }
});
