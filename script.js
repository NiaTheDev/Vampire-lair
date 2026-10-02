// Progress bar karier: animasi sekali saat halaman dibuka
(function () {
  var fill = document.querySelector(".fill");
  var pct = document.getElementById("pct");
  if (!fill || !pct) return;

  var target = parseInt(fill.dataset.level, 10) || 0;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    fill.style.width = target + "%";
    pct.textContent = target;
    return;
  }

  setTimeout(function () { fill.style.width = target + "%"; }, 300);

  var n = 0;
  var timer = setInterval(function () {
    n++;
    pct.textContent = n;
    if (n >= target) clearInterval(timer);
  }, 1600 / target);
})();

// Visitor counter (disimpan di browser pengunjung saja, bukan counter asli)
(function () {
  var el = document.getElementById("visits");
  if (!el) return;
  var count = 1;
  try {
    count = (parseInt(localStorage.getItem("lairVisits"), 10) || 0) + 1;
    localStorage.setItem("lairVisits", count);
  } catch (e) {}
  el.textContent = String(count).padStart(6, "0");
})();

// Music player: playlist, volume 50%, mulai lewat tombol PLAY
(function () {
  // Ganti judul dan nama file sesuai lagu di folder audio/
  var playlist = [
    { title: "I'm Not Okay - My Chemical Romance", file: "audio/imnotokay.mp3" },
    { title: "Helena - My Chemical Romance", file: "audio/helena.mp3"},
    { title: "King For A Day - Pierce The Veil, Kellin Quinn", file: "audio/kingforaday.mp3"},
    { title: "Bring Me To Life - Evanescence", file: "audio/bringmetolife.mp3"},
    { title: "Complicated - Avril Lavigne", file: "audio/complicated.mp3"}
  ];

  var audio = document.getElementById("audio");
  var btnPlay = document.getElementById("play");
  var btnPrev = document.getElementById("prev");
  var btnNext = document.getElementById("next");
  var np = document.getElementById("np");
  if (!audio || !btnPlay || !np || !playlist.length) return;

  var i = 0;
  audio.volume = 0.25;

  function load(idx) {
    i = (idx + playlist.length) % playlist.length;
    audio.src = playlist[i].file;
  }

  function play() {
    var p = audio.play();
    if (p && p.catch) {
      p.catch(function () { np.textContent = "klik PLAY lagi"; });
    }
  }

  audio.addEventListener("play", function () {
    np.textContent = playlist[i].title;
    btnPlay.textContent = "PAUSE";
    btnPlay.setAttribute("aria-label", "Jeda musik");
  });
  audio.addEventListener("pause", function () {
    btnPlay.textContent = "PLAY";
    btnPlay.setAttribute("aria-label", "Putar musik");
  });
  audio.addEventListener("ended", function () { load(i + 1); play(); });
  audio.addEventListener("error", function () {
    np.textContent = "file tidak ketemu: " + playlist[i].file;
    btnPlay.textContent = "PLAY";
  });

  btnPlay.addEventListener("click", function () {
    if (!audio.src) load(0);
    if (audio.paused) play(); else audio.pause();
  });
  btnNext.addEventListener("click", function () { load(i + 1); play(); });
  btnPrev.addEventListener("click", function () { load(i - 1); play(); });
})();