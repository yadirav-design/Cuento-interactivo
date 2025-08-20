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

  // Elementos para la secuencia de imágenes
  const exitoImg1 = document.getElementById("exito-img1");
  const exitoImg2 = document.getElementById("exito-img2");
  const exitoImg3 = document.getElementById("exito-img3");
  const dialogueBox3 = document.getElementById("dialogueBox3");
  const dialogueText3 = document.getElementById("dialogueText3");

  let musicaActiva = true;
  let sonidoActivo = true;
  let dialogVisible3 = false; // Control para estado diálogo 3

  // Configuración inicial de música con manejo de errores
  if (musica) {
    musica.muted = false;
    musica.currentTime = 0;
    musica.volume = 0.1;

    musica.addEventListener("error", () => {
      console.log("Error cargando audio - continuando sin música");
      musicaActiva = false;
      if (switchMusica) switchMusica.src = "./media/off.png";
    });

    musica.play().catch(() => {
      console.log("Audio no se pudo reproducir automáticamente");
    });
  }

  // Función para mostrar el diálogo 3
  function mostrarDialogo3() {
    if (!dialogueBox3 || !dialogueText3) return;
    dialogueText3.textContent = "¡Impresionante! Continuemos tras la pista, detective.";
    dialogueBox3.style.display = "block";
    dialogueBox3.style.opacity = "0";
    requestAnimationFrame(() => {
      dialogueBox3.style.transition = "opacity 0.5s ease-in-out";
      dialogueBox3.style.opacity = "1";
    });
    dialogVisible3 = true;

    // Espera 3 segundos y cambia de pantalla
    setTimeout(() => {
      window.location.href = "../7_pantalla_exploracion2/pantalla_exploracion2.html";
    }, 3000);
  }

  // Función para ocultar el diálogo 3 (por si necesitas ocultarlo después)
  function ocultarDialogo3() {
    if (!dialogueBox3) return;
    dialogueBox3.style.display = "none";
    dialogVisible3 = false;
  }

  // Función para iniciar la secuencia de imágenes de éxito
  function iniciarSecuenciaExito() {
    [exitoImg1, exitoImg2, exitoImg3].forEach((img) => img.classList.remove("mostrar"));

    setTimeout(() => {
      exitoImg1.classList.add("mostrar");
    }, 300);

    setTimeout(() => {
      exitoImg1.classList.remove("mostrar");
      exitoImg2.classList.add("mostrar");
    }, 3300);

    setTimeout(() => {
      exitoImg2.classList.remove("mostrar");
      exitoImg3.classList.add("mostrar");

      // Mostrar diálogo 3 tras la última imagen
      setTimeout(() => {
        mostrarDialogo3();
      }, 500);
    }, 6600);
  }

  // Iniciar la secuencia automáticamente
  iniciarSecuenciaExito();

  // Función toggle para switches
  function toggleSwitch(switchImg, estado) {
    if (switchImg) {
      switchImg.src = estado ? "./media/off.png" : "./media/on.png";
    }
    return !estado;
  }

  // Controles de audio
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

  // Panel de ajustes
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

  // Botón de casa
  if (btnCasa) {
    btnCasa.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirmacionModal) confirmacionModal.style.display = "flex";
    });
  }

  // Confirmación de volver al inicio
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

  // Cierre de modales al hacer clic fuera
  window.addEventListener("click", (e) => {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });

  // Libreta
  if (btnLibreta && modalLibreta) {
    btnLibreta.addEventListener("click", (e) => {
      e.stopPropagation();
      modalLibreta.style.display = "flex";
    });
  }

  // Cierre de cualquier modal con botón .close
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const modal = btn.closest(".modal");
      if (modal) modal.style.display = "none";
    });
  });
});
