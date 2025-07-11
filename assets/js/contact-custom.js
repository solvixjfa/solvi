document.addEventListener('DOMContentLoaded', async function () {
  const { createClient } = supabase;
  const SUPABASE_URL = 'https://xtarsaurwclktwhhryas.supabase.co';
  const SUPABASE_KEY = '...'; // sesuaikan
  const client = createClient(SUPABASE_URL, SUPABASE_KEY);

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

    // Kirim ke Supabase
    const { error } = await client.from('kontak_form').insert([data]);

    // Kirim juga ke Formspree
    const formspree = await fetch("https://formspree.io/f/mldnpnaq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message
      })
    });

    if (error || !formspree.ok) {
      console.error('❌ Error:', error || formspree.statusText);
      alert('❌ Gagal kirim ke Supabase atau Formspree.');
    } else {
      alert('✅ Pesan berhasil dikirim!');
      form.reset();
    }

    btn.disabled = false;
    btn.innerText = 'Kirim Pesan';
  });
});