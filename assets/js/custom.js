/*
============================================================
==      CUSTOM JS v10.0 (Animasi Pro + Form Stabil)       ==
============================================================
*/

document.addEventListener('DOMContentLoaded', function () {

  /**
   * =======================================================
   * BAGIAN 1: SISTEM ANIMASI SAAT SCROLL (BARU & LEBIH BAIK)
   * =======================================================
   */
  function initializeScrollAnimations() {
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
      threshold: 0.1 // Animasi aktif saat 10% elemen terlihat
    });

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * =======================================================
   * BAGIAN 2: NAVBAR STICKY & TRANSPARAN
   * =======================================================
   */
  function initializeStickyNavbar() {
    const navbar = document.getElementById('main_nav');
    if (!navbar) return;
    
    // Tambahkan class 'fixed-top' pada navbar lewat JS
    navbar.classList.add('fixed-top');
    
    // Fungsi untuk handle background saat scroll
    const handleScroll = () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Panggil sekali saat load untuk set state awal
  }


  /**
   * =======================================================
   * BAGIAN 3: PENGIRIMAN FORMULIR KE SUPABASE (STABIL)
   * =======================================================
   */
  function initializeFormSubmission() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    // --- Inisialisasi Klien Supabase ---
    const SUPABASE_URL = 'https://xtarsaurwclktwhhryas.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...'; // Ganti dengan kunci Anda
    
    if (typeof supabase === 'undefined') {
      console.error('Supabase client not loaded.');
      return;
    }
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      submitButton.innerHTML = 'Mengirim...';
      submitButton.disabled = true;

      const nama = contactForm.querySelector('[name="nama_lengkap"]').value;
      const email = contactForm.querySelector('[name="email"]').value;
      const whatsapp = contactForm.querySelector('[name="whatsapp"]').value;
      const layanan = contactForm.querySelector('[name="kebutuhan_layanan"]').value;
      const pesan = contactForm.querySelector('[name="pesan"]').value;

      const { error } = await supabaseClient.from('solviXone').insert([{
        name: nama, email: email, phone: whatsapp,
        message: `Layanan: ${layanan}\n\nPesan:\n${pesan}`,
        source_page: 'contact-form-simple', status: 'pending', is_read: false
      }]);

      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;

      if (error) {
        alert('❌ Gagal mengirim pesan: ' + error.message);
      } else {
        alert('✅ Pesan Anda telah berhasil dikirim!');
        contactForm.reset();
      }
    });
  }

  // Panggil semua fungsi yang kita butuhkan
  initializeScrollAnimations();
  initializeStickyNavbar();
  initializeFormSubmission();
});
