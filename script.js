// script.js
document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. Logika Menu Hamburger & Overlay ---
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    const menuOverlay = document.getElementById('menuOverlay');
    const sidebarLinks = document.querySelectorAll('aside a');
    const header = document.querySelector('header');

    // Fungsi buka/tutup menu
    function toggleMenu() {
        sidebar.classList.toggle('open');
        menuOverlay.classList.toggle('active');
    }

    // Klik tombol hamburger
    hamburgerBtn.addEventListener('click', toggleMenu);

    // Klik di area abu-abu (overlay) untuk menutup menu
    menuOverlay.addEventListener('click', toggleMenu);

    // Klik link di menu otomatis menutup menu (di HP)
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

    // --- 2. Logika Scroll (Tombol ke Atas & Sembunyikan Judul Header) ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    let scrollTimeout;

    window.addEventListener('scroll', function() {
        // A. Logika Sembunyikan Judul Header di HP
        if (window.scrollY > 50) {
            header.classList.add('scrolled'); // Tambah class transparan
        } else {
            header.classList.remove('scrolled'); // Kembalikan seperti semula
        }

        // B. Logika Tombol Gulir ke Atas
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

    // Aksi klik tombol ke atas
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
