// Variables globales
let playlist = [];
let currentSongIndex = 0; // Índice para la canción actual
let player = document.getElementById('player');
let dur = document.getElementById('dur'); // Control deslizante de la barra de progreso
let mDur = 0; // Variable para la duración total de la pista

// Función para cargar la lista de reproducción desde el archivo JSON
async function loadPlaylist() {
  try {
    const response = await fetch('src/data/data.json');
    if (!response.ok) throw new Error('Error al cargar la lista.');
    const data = await response.json();
    playlist = data;
    if (playlist.length > 0) {
      playSong(currentSongIndex); // Reproducir la primera canción
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Función para reproducir una canción según el índice
function playSong(index) {
  if (playlist.length === 0) return; // Verifica si hay canciones en la lista
  currentSongIndex = index; // Actualiza el índice actual
  player.src = playlist[currentSongIndex].audio;
  $('.title').html(playlist[currentSongIndex].title);
  player.play();
}

// Función para avanzar a la siguiente canción
function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % playlist.length; // Avanzar con ciclo
  playSong(currentSongIndex);
}

// Función para retroceder a la canción anterior
function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length; // Retroceder con ciclo
  playSong(currentSongIndex);
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
    dur.max = length;

    if (currentTime >= length) {
      $("#play-btn").removeClass("fa-pause").addClass("fa-play");
      dur.value = 0;
      nextSong(); // Avanzar a la siguiente canción al finalizar
    }
  }
}

// Función para actualizar la duración del reproductor
function updateDuration() {
  if (player.duration) {
    mDur = player.duration;
    dur.max = mDur;
  }
}

// Función para establecer el tiempo actual del reproductor
function setCurrentTime() {
  player.currentTime = dur.value;
}

// Inicializa el botón de reproducción
function initPlayers() {
  let playBtn = document.getElementById('play-btn');
  if (playBtn) {
    playBtn.addEventListener('click', togglePlay);
  }

  function togglePlay() {
    if (player.paused) {
      player.play();
      $("#play-btn").removeClass("fa-play").addClass("fa-pause");
    } else {
      player.pause();
      $("#play-btn").removeClass("fa-pause").addClass("fa-play");
    }
  }
}

// Control de los botones de siguiente y anterior
$("#next").on('click', nextSong);
$("#prev").on('click', prevSong);

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

// Función para cambiar el tema de la interfaz
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

// Inicializar el reproductor y la lista de reproducción
loadPlaylist(); // Llama a la función para cargar la lista de reproducción
initPlayers($('#player-container').length);

// Eventos de actualización del reproductor
player.ontimeupdate = initProgressBar;
player.onloadedmetadata = updateDuration;

// Evento para actualizar el tiempo actual cuando se cambia el control deslizante
dur.addEventListener('input', setCurrentTime);
