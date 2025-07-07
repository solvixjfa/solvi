/*
============================================================
==          CUSTOM JS v7.1 (Disempurnakan)                ==
==  Menggabungkan Animasi, Navbar, dan Formulir Interaktif  ==
============================================================
*/

document.addEventListener('DOMContentLoaded', function () {

  /**
   * =======================================================
   * FUNGSI #1: Animasi Saat Scroll (Universal)
   * Deskripsi: Menerapkan efek "fade up" pada elemen saat
   * elemen tersebut masuk ke dalam area pandang (viewport).
   * Cara Pakai: Tambahkan kelas `.animate-on-scroll` dan `.fade-up`
   * pada elemen HTML yang ingin dianimasikan.
   * =======================================================
   */
  function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // Jika tidak ada elemen untuk dianimasikan, hentikan fungsi.
    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        // Jika elemen terlihat di layar
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Hentikan pengamatan agar animasi tidak berulang
          obs.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1 // Memicu animasi saat 10% elemen terlihat
    });

    // Mulai amati setiap elemen yang dipilih
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * =======================================================
   * FUNGSI #2: Navbar Sticky saat Scroll
   * Deskripsi: Mengubah tampilan navbar (menambahkan kelas .scrolled)
   * setelah pengguna scroll ke bawah sedikit.
   * Efek visualnya diatur di CSS.
   * =======================================================
   */
  function initializeStickyNavbar() {
    const navbar = document.getElementById('main_nav');
    
    // Jika navbar tidak ditemukan, hentikan fungsi.
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
      // Tambah/hapus kelas .scrolled jika posisi scroll > 10px
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  /**
   * =======================================================
   * FUNGSI #3: Formulir Kontak Interaktif (Multi-Step)
   * Deskripsi: Mengelola logika untuk formulir dengan
   * beberapa langkah (steps).
   * =======================================================
   */
  function initializeInteractiveForm() {
    const form = document.getElementById('interactive-form');
    
    // Jika form tidak ditemukan, hentikan fungsi.
    if (!form) return;

    // Ambil semua elemen yang dibutuhkan dari form
    const steps = Array.from(form.querySelectorAll('.form-step'));
    const nextBtns = form.querySelectorAll('.next-btn');
    const prevBtns = form.querySelectorAll('.prev-btn');
    const choiceBtns = form.querySelectorAll('.choice-btn');
    const progressBar = document.getElementById('progress-bar');
    const selectedServiceInput = document.getElementById('selected-service');
    
    // Jika tidak ada langkah (steps) dalam form, hentikan.
    if (steps.length === 0) return;

    let currentStep = 0;

    /**
     * Menampilkan langkah (step) berdasarkan indeksnya.
     * @param {number} stepIndex - Indeks dari langkah yang akan ditampilkan.
     */
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        
        // Update progress bar jika ada
        if (progressBar) {
            const progress = ((stepIndex + 1) / steps.length) * 100;
            progressBar.style.width = progress + '%';
        }
    }

    /**
     * Memvalidasi input pada langkah saat ini.
     * @returns {boolean} - True jika valid, false jika tidak.
     */
    function validateCurrentStep() {
        const inputs = steps[currentStep].querySelectorAll('[required]');
        let isValid = true;
        inputs.forEach(input => {
            input.classList.remove('is-invalid');
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('is-invalid'); // Tambah kelas error Bootstrap
            }
        });
        return isValid;
    }

    // Event listener untuk tombol "Selanjutnya"
    nextBtns.forEach(button => {
        button.addEventListener('click', () => {
            if (validateCurrentStep()) {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                }
            }
        });
    });

    // Event listener untuk tombol "Sebelumnya"
    prevBtns.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });
    
    // Event listener untuk tombol pilihan layanan
    choiceBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Mencegah perilaku default jika tombol ada di dalam form
            choiceBtns.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Simpan nilai pilihan ke input tersembunyi
            if (selectedServiceInput) {
              selectedServiceInput.value = button.textContent.trim();
            }
        });
    });

    // Tampilkan langkah pertama saat halaman dimuat
    showStep(currentStep);
  }

  // =======================================================
  // INISIALISASI SEMUA FUNGSI SAAT HALAMAN SIAP
  // =======================================================
  initializeScrollAnimations();
  initializeStickyNavbar();
  initializeInteractiveForm();

});
