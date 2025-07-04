const musicPlayer = {
  playlist: document.querySelector(".playlist"),
  togglePlayBtn: document.querySelector(".btn-play"),
  titleName: document.querySelector(".song-title"),
  audioElement: document.querySelector("#audio"),
  playIcon: document.querySelector(".icon-play"),
  pauseIcon: document.querySelector(".icon-pause"),
  imgMain: document.querySelector("#music-image"),
  btnNext: document.querySelector(".btn-next"),
  btnPrev: document.querySelector(".btn-prev"),
  btnRepeat: document.querySelector(".btn-repeat"),
  btnRandom: document.querySelector(".btn-random"),
  audioRange: document.querySelector(".audio-range"),
  audioVolumeBtn: document.querySelector(".audio-volume-btn"),
  audioVolume: document.querySelector(".audio-volume"),

  songList: [
    {
      id: 1,
      filePath: "./assets/songs/ChayNgayDi-SonTungMTP-5468704.mp3",
      title: "Chạy ngay đi",
      artist: "Sơn Tùng M-TP",
      img: "./assets/img/chay-ngay-di.jpg",
    },
    {
      id: 2,
      filePath: "./assets/songs/GioThi-buitruonglinh-16952778.mp3",
      title: "Gió Thị",
      artist: "Bùi Trường Linh",
      img: "./assets/img/gio-thi.jpg",
    },
    {
      id: 3,
      filePath: "./assets/songs/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3",
      title: "Hãy trao cho anh",
      artist: "Sơn Tùng M-TP ft. Snoop Dogg",
      img: "./assets/img/hay-trao-cho-anh.jpg",
    },
    {
      id: 4,
      filePath: "./assets/songs/MatKetNoi-DuongDomic-16783113.mp3",
      title: "Mất kết nối",
      artist: "Dương Domic",
      img: "./assets/img/mat-ket-noi.jpg",
    },
    {
      id: 5,
      filePath: "./assets/songs/TaiSinh-TungDuong-16735175.mp3",
      title: "Tái sinh",
      artist: "Tùng Dương",
      img: "./assets/img/tai-sinh.jpg",
    },
  ],

  currentSongIndex: 0,
  canPlay: false,
  isRepeat: localStorage.getItem("repeat") === "true",
  isRandom: localStorage.getItem("random") === "true",

  start() {
    this.render();
    this.setupCurrentSong();

    // DOM Events
    this.togglePlayBtn.onclick = this.togglePlay.bind(this);

    this.audioElement.onplay = () => {
      this.canPlay = true;
      this.pauseIcon.style.display = "block";
      this.playIcon.style.display = "none";
    };

    this.audioElement.onpause = () => {
      this.canPlay = false;
      this.pauseIcon.style.display = "none";
      this.playIcon.style.display = "block";
    };

    // Audio time update
    this.audioElement.ontimeupdate = () => {
      if (this.audioElement.duration) {
        const progressPercent = (this.audioElement.currentTime / this.audioElement.duration) * 100;
        this.audioRange.value = progressPercent;
      }
    };

    // Audio range seeking
    this.audioRange.oninput = (e) => {
      const seekTime = (e.target.value / 100) * this.audioElement.duration;
      this.audioElement.currentTime = seekTime;
    };

    // Volume control
    this.audioVolumeBtn.onclick = () => {
      this.audioVolume.hidden = !this.audioVolume.hidden;
    };

    this.audioVolume.oninput = (e) => {
      this.audioElement.volume = e.target.value / 100;
    };

    // Song ended event
    this.audioElement.onended = () => {
      if (!this.isRepeat) {
        this.handlePrevOrNext(1);
      }
    };

    // Navigation buttons
    this.btnNext.onclick = this.handlePrevOrNext.bind(this, 1);
    this.btnPrev.onclick = this.handlePrevOrNext.bind(this, -1);
    this.btnRepeat.onclick = this.eventRepeat.bind(this);
    this.btnRandom.onclick = this.eventRandom.bind(this);

    // Playlist click event
    this.playlist.onclick = (e) => {
      const songItem = e.target.closest('.song-item');
      if (songItem) {
        const songId = parseInt(songItem.dataset.id);
        this.currentSongIndex = this.songList.findIndex(song => song.id === songId);
        this.setupCurrentSong();
        this.render();
        this.audioElement.play();
      }
    };

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        this.togglePlay();
        e.preventDefault();
      }
    }); 
  },

  handlePrevOrNext(step) {
    if (this.isRandom) {
      this.currentSongIndex = this.getRandomIndex();
    } else {
      this.currentSongIndex += step;
    }
    this.handleNewSongIndex();
    this.audioElement.play();
  },

  getRandomIndex() {
    if (this.songList.length === 1) {
      return this.currentSongIndex;
    }

    let randomIndex = null;
    do {
      randomIndex = Math.floor(Math.random() * this.songList.length);
    } while (randomIndex === this.currentSongIndex);
    return randomIndex;
  },

  eventRandom() {
    this.isRandom = !this.isRandom;
    this.setRandomActive();
  },

  setRandomActive() {
    this.btnRandom.classList.toggle("active", this.isRandom);
    localStorage.setItem("random", this.isRandom);
  },

  eventRepeat() {
    this.isRepeat = !this.isRepeat;
    this.audioElement.loop = this.isRepeat;
    this.setRepeatActive();
  },

  setRepeatActive() {
    this.btnRepeat.classList.toggle("active", this.isRepeat);
    localStorage.setItem("repeat", this.isRepeat);
  },

  handleNewSongIndex() {
    this.currentSongIndex =
      (this.currentSongIndex + this.songList.length) % this.songList.length;
    this.setupCurrentSong();
    this.render();
  },

  setupCurrentSong() {
    const currentSong = this.getCurrentSong();
    this.titleName.textContent = currentSong.title;
    this.audioElement.src = currentSong.filePath;
    this.imgMain.src = currentSong.img;
    this.audioRange.value = 0;
    this.setRepeatActive();
    this.setRandomActive();
  },

  getCurrentSong() {
    return this.songList[this.currentSongIndex];
  },

  async togglePlay() {
    if (this.audioElement.paused) {
       await this.audioElement.play();
    } else {
      this.audioElement.pause();
    }
  },

  render() {
    const html = this.songList
      .map((song, index) => {
        return `
            <li class="song-item ${
              index === this.currentSongIndex ? "active" : ""
            }" data-id="${song.id}">
            <img src="${song.img}" class="song-image" alt="${song.title}">
            <h3>${song.title}</h3>
            </li>`;
      })
      .join("");
      

    this.playlist.innerHTML = `<ul style="list-style: none; padding: 0; margin: 0;">${html}</ul>`;
  },
};

musicPlayer.start();