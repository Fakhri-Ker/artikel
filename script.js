// script.js
document.addEventListener("DOMContentLoaded", function() {
    // Memilih semua tautan di dalam sidebar
    const links = document.querySelectorAll('aside a');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Mencegah lompatan standar
            
            // Mengambil ID tujuan dari atribut href (misal: #konsep-cms)
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Meluncur dengan mulus ke bagian tujuan, dikurangi jarak untuk header
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
