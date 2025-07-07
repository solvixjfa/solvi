
document.addEventListener('DOMContentLoaded', function () {

  // FUNGSI ANIMASI & NAVBAR (Tidak ada perubahan)
  function initializeScrollAnimations() { /* ... kode sama seperti sebelumnya ... */ }
  function initializeStickyNavbar() { /* ... kode sama seperti sebelumnya ... */ }

  /**
   * ===================================================================
   * FUNGSI #3: Formulir Kontak Interaktif DENGAN INTEGRASI SUPABASE
   * ===================================================================
   */
  function initializeInteractiveForm() {
    const form = document.getElementById('interactive-form');
    if (!form) return;

    // --- Inisialisasi Klien Supabase ---
    // Pastikan URL dan Kunci Anon Anda benar.
    // PENTING: Pastikan Anda telah mengaktifkan Row Level Security (RLS) di tabel Supabase Anda!
    const SUPABASE_URL = 'https://xtarsaurwclktwhhryas.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...'; // Ganti dengan kunci Anda yang lengkap
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Ambil semua elemen yang dibutuhkan dari form
    const steps = Array.from(form.querySelectorAll('.form-step'));
    const nextBtns = form.querySelectorAll('.next-btn');
    const prevBtns = form.querySelectorAll('.prev-btn');
    const choiceBtns = form.querySelectorAll('.choice-btn');
    const progressBar = document.getElementById('progress-bar');
    const selectedServiceInput = document.getElementById('selected-service');
    const submitButton = form.querySelector('button[type="submit"]');

    if (steps.length === 0) return;
    let currentStep = 0;

    function showStep(stepIndex) {
        steps.forEach((step, index) => step.classList.toggle('active', index === stepIndex));
        if (progressBar) {
            const progress = ((stepIndex + 1) / steps.length) * 100;
            progressBar.style.width = progress + '%';
        }
    }

    function validateCurrentStep() {
        const inputs = steps[currentStep].querySelectorAll('[required]');
        let isValid = true;
        inputs.forEach(input => {
            input.classList.remove('is-invalid');
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('is-invalid');
            }
        });
        return isValid;
    }

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

    prevBtns.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });
    
    choiceBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            choiceBtns.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            if (selectedServiceInput) {
              selectedServiceInput.value = button.textContent.trim();
            }
        });
    });

    // --- Event Listener untuk Pengiriman Form ke Supabase ---
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Selalu cegah pengiriman form default

        if (!validateCurrentStep()) {
            alert('Mohon isi semua data yang wajib diisi.');
            return;
        }

        // Tampilkan status loading pada tombol submit
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = 'Mengirim...';
        submitButton.disabled = true;

        // Ambil semua nilai dari form
        const layanan = selectedServiceInput.value;
        const pesan = form.querySelector('[name="pesan_detail"]').value;
        const nama = form.querySelector('[name="nama_lengkap"]').value;
        const email = form.querySelector('[name="email"]').value;
        const whatsapp = form.querySelector('[name="whatsapp"]').value;
        const usaha = form.querySelector('[name="nama_usaha"]').value;

        // Kirim data ke tabel 'solviXone' di Supabase
        const { error } = await supabaseClient.from('solviXone').insert([{
          name: nama,
          email: email,
          phone: whatsapp,
          message: `Layanan: ${layanan}\n\nPesan:\n${pesan}\n\nUsaha: ${usaha || 'Tidak ada'}`,
          source_page: 'contact-form',
          status: 'pending',
          is_read: false
        }]);

        // Kembalikan tombol ke keadaan semula
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;

        if (error) {
          alert('❌ Gagal mengirim pesan: ' + error.message);
        } else {
          alert('✅ Pesan Anda telah berhasil dikirim! Saya akan segera menghubungi Anda.');
          form.reset(); // Kosongkan form
          // Atur ulang tampilan ke langkah pertama
          currentStep = 0;
          showStep(0);
          choiceBtns.forEach(btn => btn.classList.remove('active'));
        }
    });

    // Tampilkan langkah pertama saat halaman dimuat
    showStep(currentStep);
  }
  
  // Panggil semua fungsi inisialisasi
  initializeScrollAnimations();
  initializeStickyNavbar();
  initializeInteractiveForm();
});
