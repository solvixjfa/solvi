/**
 * Custom JavaScript for Contact Page Animations
 * Menggunakan Intersection Observer API untuk efisiensi
 */

document.addEventListener("DOMContentLoaded", function() {

    // Pilih semua elemen yang ingin dianimasikan
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // Cek jika tidak ada elemen untuk dianimasikan
    if (!animatedElements.length) {
        return;
    }

    // Buat observer baru
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Jika elemen masuk ke dalam viewport
            if (entry.isIntersecting) {
                // Tambahkan kelas 'is-visible' untuk memicu animasi CSS
                entry.target.classList.add('is-visible');
                
                // (Opsional) Berhenti mengamati elemen ini setelah animasi berjalan sekali
                // Hapus baris di bawah jika Anda ingin animasi berjalan setiap kali elemen di-scroll
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Opsi untuk observer
        root: null, // relatif terhadap viewport
        rootMargin: '0px',
        threshold: 0.1 // picu animasi saat 10% elemen terlihat
    });

    // Mulai amati setiap elemen
    animatedElements.forEach(element => {
        observer.observe(element);
    });

});

