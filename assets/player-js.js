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
  btnDuration: document.querySelector(".audio-range"),
  btnVolume: document.querySelector(".audio-volume-btn"),
  volumeRange: document.querySelector(".audio-volume"),
  containerVolume: document.querySelector(".volume"),

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
      filePath: "../assets/songs/GioThi-buitruonglinh-16952778.mp3",
      title: "Gió Thị",
      artist: "Bùi Trường Linh",
      img: "./assets/img/gio-thi.jpg",
    },
    {
      id: 3,
      filePath: "../assets/songs/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3",
      title: "Hãy trao cho anh",
      artist: "Sơn Tùng M-TP ft. Snoop Dogg",
      img: "./assets/img/hay-trao-cho-anh.jpg",
    },
    {
      id: 4,
      filePath: "../assets/songs/MatKetNoi-DuongDomic-16783113.mp3",
      title: "Mất kết nối",
      artist: "Dương Domic",
      img: "./assets/img/mat-ket-noi.jpg",
    },
    {
      id: 5,
      filePath: "../assets/songs/TaiSinh-TungDuong-16735175.mp3",
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
      //   console.log(this.canPlay);
    };

    this.audioElement.onpause = () => {
      this.canPlay = false;
      this.pauseIcon.style.display = "none";
      this.playIcon.style.display = "block";
      //   console.log(this.canPlay);
    };

    this.btnNext.onclick = this.handlePrevOrNext.bind(this, 1);

    this.btnPrev.onclick = this.handlePrevOrNext.bind(this, -1);

    this.btnRepeat.onclick = this.eventRepeat.bind(this);
    this.btnRandom.onclick = this.eventRandom.bind(this);

    // Cập nhật tiến trình nhạc lên btnDuration (audio-range) và hiển thị thời gian
    this.audioElement.ontimeupdate = () => {
      if (this.audioElement.duration) {
        const percent =
          (this.audioElement.currentTime / this.audioElement.duration) * 100;
        this.btnDuration.value = percent;
      }
    };

    // Cho phép tua nhạc khi kéo btnDuration
    this.btnDuration.oninput = (e) => {
      if (this.audioElement.duration) {
        const seekTime = (e.target.value / 100) * this.audioElement.duration;
        this.audioElement.currentTime = seekTime;
      }
    };

    this.btnVolume.onclick = () => {
      this.audioElement.muted = !this.audioElement.muted;
    };

    this.btnVolume.onmouseover = () => {
      this.volumeRange.style.visibility = "visible";
    };

    this.containerVolume.onmouseleave = () => {
      this.volumeRange.style.visibility = "hidden";
    };

    this.volumeRange.oninput = (e) => {
      this.audioElement.volume = e.target.value / 100;
      this.audioElement.muted = e.target.value == 0;
    };

    const songItems = document.querySelectorAll(".song-item");
    songItems.forEach((item, index) => {
      item.onclick = () => {

        // Bỏ class active ở tất cả các item
        songItems.forEach((e) => e.classList.remove("active"));
        
        // Thêm class active cho item được click
        item.classList.add("active");
        this.currentSongIndex = index;
        this.setupCurrentSong();
        this.audioElement.play();
      };
    });

    console.log(songItems);
    console.log(musicPlayer.songItems);

    // this.btnRandom.onclick = () => {
    //   this.isRandom = !this.isRandom;
    //   this.setRandomActive();
    //   localStorage.setItem("random", this.isRandom);
    // };

    // this.btnRepeat.onclick = () => {
    //   this.isRepeat = !this.isRepeat;
    //   this.btnRepeat.classList.toggle("active", this.isRepeat);
    //   console.log(this);
    // };

    // this.audioElement.ontimeupdate = () => {
    //   if (this.audioElement.duration) {
    //     const percent =
    //       (this.audioElement.currentTime / this.audioElement.duration) * 100;
    //     this.btnDuration.value = percent;

    //     // Hiển thị thời gian
    //     const format = (s) =>
    //       String(Math.floor(s / 60)).padStart(2, "0") +
    //       ":" +
    //       String(Math.floor(s % 60)).padStart(2, "0");
    //     this.timeDisplay.textContent = `${format(this.audioElement.currentTime)} / ${format(
    //       this.audioElement.duration
    //     )}`;
    //   } else {
    //     this.timeDisplay.textContent = "00:00 / 00:00";
    //   }
    // };
  },

  setCurrentTime() {
    const currentTime = this.audioElement.currentTime;
    return (
      String(Math.floor(currentTime / 60)).padStart(2, "0") +
      ":" +
      String(Math.floor(currentTime % 60)).padStart(2, "0")
    );
  },

  setDurationTime() {
    const durationTime = this.audioElement.duration || 0;
    return (
      String(Math.floor(durationTime / 60)).padStart(2, "0") +
      ":" +
      String(Math.floor(durationTime % 60)).padStart(2, "0")
    );
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
    // console.log(this.isRepeat);
  },

  setRepeatActive() {
    this.btnRepeat.classList.toggle("active", this.isRepeat);
    localStorage.setItem("repeat", this.isRepeat);
  },

  onCanPlay() {
    if (musicPlayer.canPlay) {
      this.audioElement.play();
    }
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
    this.setRepeatActive();
    this.setRandomActive();

    this.onCanPlay();
  },

  getCurrentSong() {
    return this.songList[this.currentSongIndex];
  },

  togglePlay() {
    if (this.audioElement.paused) {
      this.audioElement.play();
    } else {
      this.audioElement.pause();
    }
  },

  render() {
    const html = this.songList
      .map((song, index) => {
        return `
            <ul class="song-item ${
              index === this.currentSongIndex ? "active" : ""
            }" data-id="${song.id}">
            <img src="${song.img}" class="song-image">
            <h3>${song.title}</h3>
            </ul>`;
      })
      .join("");

    this.playlist.innerHTML = html;
  },
  // player : $('.player'),
  // btnRepeat : $('.btn-repeat'),
  // btnPrev : $('.btn-prev'),
  // btnPlay : $('.btn-play'),
  // btnRandom : $('.btn-random'),
};

musicPlayer.start();
