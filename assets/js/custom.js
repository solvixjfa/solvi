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

document.addEventListener('DOMContentLoaded', function () {

    // Efek blur dan shrink navbar saat scroll
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
        handleNavbarScroll();
    }

    // Tandai link navbar aktif
    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop();
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

    // Inisialisasi Isotope + filter tombol
    // Gunakan window.load agar semua gambar pasti selesai
    window.addEventListener('load', function () {
        if (window.jQuery && $.fn.isotope) {
            const $projects = $('.projects').isotope({
                itemSelector: '.project',
                layoutMode: 'fitRows'
            });

            // Filter tombol
            $('.filter-btn').on('click', function (e) {
                e.preventDefault(); // Hindari loncat ke atas

                const filterValue = $(this).attr('data-filter');
                $projects.isotope({ filter: filterValue });

                // Atur kelas aktif
                $('.filter-btn').removeClass('active shadow');
                $(this).addClass('active shadow');
            });
        }
    });

    // Animasi elemen saat scroll (intersection observer)
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