// Variables globales
let playlist = [];
let player = document.getElementById('player');
let dur = document.getElementById('dur'); // Control deslizante de la barra de progreso
let mDur = 0; // Variable para la duración total de la pista

// Función para cargar la lista de reproducción desde el archivo JSON
async function loadPlaylist() {
  try {
    const response = await fetch('src/data/data.json');
    if (!response.ok) throw new Error('Network response was not ok.');
    const data = await response.json();
    playlist = data; // Almacena los datos en la variable global
    playRandomSong(); // Inicia la reproducción con una canción aleatoria
    initPlayers(1); // Inicializa los reproductores
  } catch (error) {
    console.error('Error al cargar la lista de canciones:', error);
  }
}

// Función para reproducir una canción aleatoria
function playRandomSong() {
  if (playlist.length === 0) return; // Verifica si hay canciones en la lista
  let randomIndex = Math.floor(Math.random() * playlist.length);
  player.src = playlist[randomIndex].audio;
  $('.title').html(playlist[randomIndex].title);
  player.play();
}

// Función para calcular el tiempo total en formato minutos:segundos
function calculateTotalValue(length) {
  let minutes = Math.floor(length / 60);
  let seconds = (length % 60).toFixed(0).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// Función para calcular el tiempo actual en formato minutos:segundos
function calculateCurrentValue(currentTime) {
  let minutes = Math.floor(currentTime / 60);
  let seconds = (currentTime % 60).toFixed(0).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// Función para inicializar y actualizar la barra de progreso
function initProgressBar() {
  if (player.duration) {
    let length = player.duration;
    let currentTime = player.currentTime;
    let totalLength = calculateTotalValue(length);
    jQuery(".end-time").html(totalLength);
    let currentDisplay = calculateCurrentValue(currentTime);
    jQuery(".start-time").html(currentDisplay);
    dur.value = currentTime;
    dur.max = length; // Asegúrate de establecer el valor máximo del control deslizante

    // Si la pista ha terminado, reproduce una nueva canción
    if (currentTime >= length) {
      $("#play-btn").removeClass("fa-pause").addClass("fa-play");
      dur.value = 0;
      playRandomSong(); // Reproduce otra canción al finalizar la actual
    }
  }
}

// Función para actualizar la duración del reproductor
function updateDuration() {
  if (player.duration) {
    mDur = player.duration;
    dur.max = mDur; // Actualiza el valor máximo del control deslizante
  }
}

// Función para establecer el tiempo actual del reproductor
function setCurrentTime() {
  player.currentTime = dur.value;
}

// Función para inicializar los reproductores
function initPlayers(num) {
  for (let i = 0; i < num; i++) {
    (function () {
      let playBtn = document.getElementById('play-btn');

      if (playBtn != null) {
        playBtn.addEventListener('click', function () {
          togglePlay();
        });
      }

      function togglePlay() {
        if (!player.paused) {
          player.pause();
          $("#play-btn").removeClass("fa-pause").addClass("fa-play");
        } else {
          player.play();
          $("#play-btn").removeClass("fa-play").addClass("fa-pause");
        }
      }
    }());
  }
}

// Cambiar de canción
$("#next").data('dir', 1);
$("#prev").data('dir', -1);

$('#next, #prev').on('click', function () {
  let direction = $(this).data('dir');
  let currentIndex = playlist.findIndex(song => song.audio === player.src);
  let newIndex = (currentIndex + direction + playlist.length) % playlist.length;
  player.src = playlist[newIndex].audio;
  $('.title').html(playlist[newIndex].title);
  $('#play-btn').removeClass("fa-play").addClass("fa-pause");
  player.play();
});

// Control del volumen
$(".audio-player").toArray().forEach(function (player) {
  let audio = $(player).find("audio")[0];
  let volumeControl = $(player).find(".volumeControl .wrapper");
  volumeControl.find(".outer").on("click", function (e) {
    let volumePosition = e.pageX - $(this).offset().left;
    let audioVolume = volumePosition / $(this).width();
    if (audioVolume >= 0 && audioVolume <= 1) {
      audio.volume = audioVolume;
      $(this).find(".inner").css("width", audioVolume * 100 + "%");
    }
  });
});

// Control del dropdown
$('.dropdown-toggle').click(function () {
  $(this).next('.dropdown').slideToggle("fast");
});
$(document).click(function (e) {
  var target = e.target;
  if (!$(target).is('.dropdown-toggle') && !$(target).parents().is('.dropdown-toggle')) {
    $('.dropdown').hide();
  }
});

// Cambio de temas
$('#darkButton').click(switchDark);
$('#whiteButton').click(switchWhite);
$('#blueButton').click(switchBlue);

function switchDark() {
  $('#skin').attr('class', 'dark audio-player');
  $('.inner').css('background', '#fff');
  $('.title').css('color', '#fff');
  $('.time').css('color', '#fff');
  $('.fa-volume-up').css('color', '#fff');
  $('.audio-player #play-btn').css({'color': '#fff', 'border-color': '#fff'});
  $('.ctrl_btn').css({'color': '#fff', 'border-color': '#fff'});
}

function switchWhite() {
  $('#skin').attr('class', 'white audio-player');
  $('.inner').css('background', '#555');
  $('.title').css('color', '#555');
  $('.time').css('color', '#555');
  $('.fa-volume-up').css('color', '#555');
  $('.audio-player #play-btn').css({'color': '#555', 'border-color': '#555'});
  $('.ctrl_btn').css({'color': '#555', 'border-color': '#555'});
}

function switchBlue() {
  $('#skin').attr('class', 'blue audio-player');
  $('.inner').css('background', '#fff');
  $('.title').css('color', '#fff');
  $('.time').css('color', '#fff');
  $('.fa-volume-up').css('color', '#fff');
  $('.audio-player #play-btn').css({'color': '#fff', 'border-color': '#fff'});
  $('.ctrl_btn').css({'color': '#fff', 'border-color': '#fff'});
}

// Inicializar el reproductor y la lista de reproducción
loadPlaylist(); // Llama a la función para cargar la lista de reproducción
initPlayers($('#player-container').length);

// Eventos de actualización del reproductor
player.ontimeupdate = initProgressBar;
player.onloadedmetadata = updateDuration;

// Evento para actualizar el tiempo actual cuando se cambia el control deslizante
dur.addEventListener('input', setCurrentTime);
