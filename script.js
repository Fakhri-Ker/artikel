document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. Logika Menu Hamburger & Overlay ---
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    const menuOverlay = document.getElementById('menuOverlay');
    const sidebarLinks = document.querySelectorAll('aside a');

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
            
            // Tutup menu jika sedang di HP
            if(window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                menuOverlay.classList.remove('active');
            }

            // Smooth scroll
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

    // --- 2. Logika Tombol Gulir ke Atas (Muncul saat digulir, hilang setelah 5 detik) ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    let scrollTimeout;

    window.addEventListener('scroll', function() {
        // Jika layar digulir lebih dari 200px ke bawah
        if (window.scrollY > 200) {
            scrollTopBtn.classList.add('show');
            
            // Hapus hitung mundur sebelumnya
            clearTimeout(scrollTimeout);
            
            // Setel waktu mundur 5 detik (5000 milidetik)
            scrollTimeout = setTimeout(function() {
                scrollTopBtn.classList.remove('show');
            }, 3000); // Tombol hilang setelah 3 detik didiamkan
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
