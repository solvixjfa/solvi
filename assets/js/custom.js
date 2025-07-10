/*
 * File JavaScript Kustom
 * Berisi semua fungsionalitas interaktif untuk website.
 *
 * Daftar Fungsi:
 * 1. Efek Navbar saat di-scroll.
 * 2. Menandai link navigasi yang aktif.
 * 3. Inisialisasi filter portofolio (Isotope).
 * 4. Animasi elemen saat muncul di layar (Intersection Observer).
 */

// Menjalankan semua skrip setelah seluruh DOM siap
document.addEventListener('DOMContentLoaded', function () {

    // =================================================================
    // FUNGSI 1: EFEK NAVBAR SAAT SCROLL (Frosted Glass Effect)
    // =================================================================
    const navbar = document.getElementById('main_nav');
    if (navbar) {
        const handleNavbarScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleNavbarScroll);
        handleNavbarScroll(); // Jalankan saat pertama kali memuat
    }

    // =================================================================
    // FUNGSI 2: MENANDAI LINK NAVIGASI YANG AKTIF
    // =================================================================
    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop(); // Mendapatkan nama file (misal: "index.html")
        const navLinks = document.querySelectorAll('#main_nav .nav-link');

        navLinks.forEach(link => {
            const linkPage = new URL(link.href).pathname.split('/').pop();
            link.classList.remove('active');
            if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        });
    };
    setActiveNavLink();

    // =================================================================
    // FUNGSI 3: INISIALISASI FILTER PORTOFOLIO (ISOTOPE)
    // =================================================================
    // Pastikan jQuery dan Isotope sudah dimuat sebelum ini berjalan
    if (window.jQuery && $.fn.isotope) {
        // Menggunakan event 'load' dari window untuk memastikan semua gambar dimuat
        $(window).on('load', function() {
            var $projects = $('.projects').isotope({
                itemSelector: '.project',
                layoutMode: 'fitRows'
            });

            $(".filter-btn").click(function(e) {
                e.preventDefault(); // Mencegah link '#' menggulir ke atas
                
                var filterValue = $(this).attr("data-filter");
                $projects.isotope({ filter: filterValue });

                // Mengatur kelas 'active' pada tombol filter
                $(".filter-btn").removeClass("active shadow");
                $(this).addClass("active shadow");
            });
        });
    }


    // =================================================================
    // FUNGSI 4: ANIMASI ELEMEN SAAT MUNCUL DI LAYAR
    // =================================================================
    const initializeScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    };
    initializeScrollAnimations();

});

