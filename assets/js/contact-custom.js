document.addEventListener('DOMContentLoaded', async function () {
  // 🔁 ANIMASI SCROLL
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (animatedElements.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));
  }

  // 🔁 FORM SUPABASE
  const SUPABASE_URL = 'https://xtarsaurwclktwhhryas.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Ubah dengan key kamu
  const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);
  if (!supabase) {
    console.error('❌ Supabase belum siap.');
    return;
  }

  const form = document.getElementById('contact-form');
  if (!form) return;
  const btn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.innerText = 'Mengirim...';

    const name = form.nama_lengkap.value.trim();
    const email = form.email.value.trim();
    const phone = form.whatsapp.value.trim();
    const layanan = form.kebutuhan_layanan.value;
    const pesan = form.pesan.value.trim();

    if (!name || !email || !pesan) {
      alert('❌ Nama, Email, dan Pesan wajib diisi.');
      btn.disabled = false;
      btn.innerText = 'Kirim Pesan';
      return;
    }

    const { error } = await supabase.from('kontak_form').insert([{
      name,
      email,
      phone,
      message: `Layanan: ${layanan}\n\nPesan:\n${pesan}`,
      source_page: 'contact-form',
      status: 'pending',
      is_read: false,
      created_at: new Date().toISOString()
    }]);

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