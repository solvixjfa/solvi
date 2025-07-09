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

// custom.js

document.addEventListener('DOMContentLoaded', async function () {
  const SUPABASE_URL = 'https://xtarsaurwclktwhhryas.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // pastikan key masih aktif
  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const form = document.getElementById('contact-form');
  const btn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.innerText = 'Mengirim...';

    const data = {
      name: form.nama_lengkap.value.trim(),
      email: form.email.value.trim(),
      phone: form.whatsapp.value.trim(),
      message: `Layanan: ${form.kebutuhan_layanan.value}\n\nPesan:\n${form.pesan.value.trim()}`,
      source_page: 'contact-form',
      status: 'pending',
      is_read: false,
      created_at: new Date().toISOString()
    };

    if (!data.name || !data.email || !form.pesan.value.trim()) {
      alert('Nama, email, dan pesan wajib diisi.');
      btn.disabled = false;
      btn.innerText = 'Kirim Pesan';
      return;
    }

    const { error } = await supabase.from('kontak_form').insert([data]);

    if (error) {
      console.error(error);
      alert('❌ Gagal mengirim pesan.');
    } else {
      alert('✅ Pesan berhasil dikirim!');
      form.reset();
    }

    btn.disabled = false;
    btn.innerText = 'Kirim Pesan';
  });
});