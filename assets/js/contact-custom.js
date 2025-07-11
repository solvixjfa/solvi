document.addEventListener('DOMContentLoaded', async function () {
  const { createClient } = supabase;
  const SUPABASE_URL = 'https://xtarsaurwclktwhhryas.supabase.co';
  const SUPABASE_KEY = '...'; // Ganti dengan anon key kamu
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
      alert('❌ Nama, email, dan pesan wajib diisi.');
      btn.disabled = false;
      btn.innerText = 'Kirim Pesan';
      return;
    }

    try {
      // Kirim ke Supabase
      const { error: supabaseError } = await client.from('kontak_form').insert([data]);
      if (supabaseError) throw new Error('Supabase error: ' + supabaseError.message);

      // Kirim ke Formspree
      const formspreeRes = await fetch("https://formspree.io/f/mldnpnaq", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });

      const formspreeResult = await formspreeRes.json();
      if (!formspreeRes.ok) throw new Error('Formspree error: ' + (formspreeResult.error || 'Unknown error'));

      alert('✅ Pesan berhasil dikirim!');
      form.reset();
    } catch (err) {
      console.error(err);
      alert('❌ Gagal mengirim pesan: ' + err.message);
    }

    btn.disabled = false;
    btn.innerText = 'Kirim Pesan';
  });
});