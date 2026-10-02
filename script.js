// script.js
document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. LOGIKA MENU HAMBURGER ---
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    const menuOverlay = document.getElementById('menuOverlay');
    const sidebarLinks = document.querySelectorAll('aside a');
    const header = document.querySelector('header');

    function toggleMenu() {
        sidebar.classList.toggle('open');
        menuOverlay.classList.toggle('active');
    }

    hamburgerBtn.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if(window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                menuOverlay.classList.remove('active');
            }
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 2. LOGIKA SCROLL TO TOP & HEADER ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    let scrollTimeout;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 200) {
            scrollTopBtn.classList.add('show');
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(function() {
                scrollTopBtn.classList.remove('show');
            }, 3000); 
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 3. LOGIKA PEMUTAR MUSIK DENGAN MEMORI LOKAL ---
    
    // DAFTAR LAGU ANDA (Sudah di dalam folder musik)
    const songs = [
        { title: "Kota Ini Tak Sama Tanpamu", src: "musik/kotataksama.mp3" },
        { title: "Usik", src: "musik/usik.mp3" },
        { title: "Melangitkanmu", src: "musik/langit.mp3" }
    ];

    let currentSongIndex = 0;
    const audio = document.getElementById('audio-player');
    
    // Ambil data memori dari browser
    const savedSongIndex = localStorage.getItem('savedSongIndex');
    const savedTime = localStorage.getItem('savedTime');

    if (savedSongIndex !== null) {
        currentSongIndex = parseInt(savedSongIndex);
    }

    // Elemen UI Musik
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const musicPlayerContainer = document.getElementById('musicPlayerContainer');
    const closeMusicBtn = document.getElementById('closeMusicBtn');
    const playBtn = document.getElementById('playPause');
    const titleDisp = document.getElementById('song-title');
    const playlistDiv = document.getElementById('playlist');
    const loopBtn = document.getElementById('loopBtn');
    
    const currentTimeEl = document.getElementById('currentTime');
    const durationTimeEl = document.getElementById('durationTime');
    const progressBar = document.getElementById('progressBar');

    // Buka / Tutup Popup Musik
    musicToggleBtn.addEventListener('click', () => {
        musicPlayerContainer.classList.toggle('show');
    });
    closeMusicBtn.addEventListener('click', () => {
        musicPlayerContainer.classList.remove('show');
    });

    // Inisialisasi Playlist
    function initPlayer() {
        songs.forEach((song, index) => {
            let div = document.createElement('div');
            div.innerText = song.title;
            div.onclick = () => loadSong(index, true); // True = auto play saat diklik dari list
            playlistDiv.appendChild(div);
        });
        
        // Muat lagu dari memori terakhir
        audio.src = songs[currentSongIndex].src;
        titleDisp.innerText = songs[currentSongIndex].title;

        // Jika ada waktu tersimpan, kembalikan waktunya saat lagu disiapkan browser
        audio.addEventListener('loadedmetadata', function restoreTime() {
            if (savedTime !== null) {
                audio.currentTime = parseFloat(savedTime);
            }
            audio.removeEventListener('loadedmetadata', restoreTime); // Hapus agar tidak jalan saat ganti lagu
        });
    }

    // Fungsi Load Lagu
    function loadSong(index, autoPlay = true) {
        currentSongIndex = index;
        
        // Simpan indeks lagu ke memori, dan hapus memori waktu lama
        localStorage.setItem('savedSongIndex', currentSongIndex);
        localStorage.removeItem('savedTime'); 

        audio.src = songs[index].src;
        titleDisp.innerText = songs[index].title;
        playlistDiv.classList.remove('active');
        
        if (autoPlay) {
            audio.play().then(() => {
                playBtn.innerText = "⏸";
            }).catch(e => console.log("Menunggu interaksi user untuk autoplay"));
        } else {
            playBtn.innerText = "▶";
        }
    }

    // Fungsi Play / Pause
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playBtn.innerText = "⏸";
        } else {
            audio.pause();
            playBtn.innerText = "▶";
        }
    });

    // Fungsi Next & Prev
    document.getElementById('nextBtn').addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex, true);
    });
    document.getElementById('prevBtn').addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex, true);
    });

    // Fungsi Mute
    document.getElementById('muteBtn').addEventListener('click', function() {
        audio.muted = !audio.muted;
        this.innerText = audio.muted ? "🔇" : "🔊";
    });

    // Buka Daftar Lagu
    document.getElementById('toggleListBtn').addEventListener('click', function() {
        playlistDiv.classList.toggle('active');
    });

    // Fungsi Loop
    loopBtn.addEventListener('click', function() {
        audio.loop = !audio.loop;
        if (audio.loop) {
            this.classList.add('active'); 
        } else {
            this.classList.remove('active');
        }
    });

    // Auto Lanjut saat lagu berakhir
    audio.addEventListener('ended', function() {
        if (!audio.loop) {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
            loadSong(currentSongIndex, true);
        }
    });

    // Format waktu
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    // Update Progress Bar, Waktu, & SIMPAN KE MEMORI TERUS MENERUS
    audio.addEventListener('timeupdate', () => {
        currentTimeEl.innerText = formatTime(audio.currentTime);
        
        if (audio.duration) {
            durationTimeEl.innerText = formatTime(audio.duration);
            progressBar.value = (audio.currentTime / audio.duration) * 100;
        }

        // Simpan waktu saat ini ke memori peramban
        if (audio.currentTime > 0) {
            localStorage.setItem('savedTime', audio.currentTime);
        }
    });

    // Menggeser Progress Bar
    progressBar.addEventListener('input', (e) => {
        if (audio.duration) {
            const seekTime = (e.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        }
    });

    // Jalankan inisialisasi awal
    initPlayer();
});
