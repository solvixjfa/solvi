document.addEventListener('DOMContentLoaded', async function () {
  const { createClient } = supabase;
  const SUPABASE_URL = 'https://xtarsaurwclktwhhryas.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0YXJzYXVyd2Nsa3R3aGhyeWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDM1ODksImV4cCI6MjA2NzM3OTU4OX0.ZAgs8NbZs8F2GuBVfiFYuyqOLrRC1hemdMyE-i4riYI';
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

    const { error } = await client.from('kontak_form').insert([data]);

    if (error) {
      console.error('❌ Supabase Insert Error:', error);
      alert('❌ Gagal mengirim pesan. Pastikan koneksi atau akses database sudah benar.');
    } else {
      alert('✅ Pesan berhasil dikirim!');
      form.reset();
    }

    btn.disabled = false;
    btn.innerText = 'Kirim Pesan';
  });
});