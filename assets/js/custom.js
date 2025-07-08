document.addEventListener('DOMContentLoaded', function () {

  // BAGIAN 1: SISTEM ANIMASI SAAT SCROLL
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
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => { 
      observer.observe(element); 
    });
  }

  // BAGIAN 2: NAVBAR STICKY & TRANSPARAN
  function initializeStickyNavbar() {
    const navbar = document.getElementById('main_nav');
    if (!navbar) return;
    
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  }

  // BAGIAN 3: KONFIGURASI SUPABASE
  function initializeSupabase() {
    const SUPABASE_URL = 'https://xtarsaurwclktwhhryas.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0YXJzYXVyd2Nsa3R3aGhyeWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDM1ODksImV4cCI6MjA2NzM3OTU4OX0.ZAgs8NbZs8F2GuBVfiFYuyqOLrRC1hemdMyE-i4riYI';
    
    if (typeof supabase === 'undefined') {
      console.error('❌ Supabase client not loaded. Pastikan Anda sudah include script Supabase!');
      return null;
    }
    
    return supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  // BAGIAN 4: PENGIRIMAN FORMULIR KE SUPABASE
  function initializeFormSubmission() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) {
      console.warn('⚠️ Form dengan ID "contact-form" tidak ditemukan');
      return;
    }

    const supabaseClient = initializeSupabase();
    if (!supabaseClient) return;

    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Disable tombol submit dan ubah teks
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      submitButton.innerHTML = '⏳ Mengirim...';
      submitButton.disabled = true;

      try {
        // Ambil data dari form
        const formData = {
          nama: contactForm.querySelector('[name="nama_lengkap"]')?.value || '',
          email: contactForm.querySelector('[name="email"]')?.value || '',
          whatsapp: contactForm.querySelector('[name="whatsapp"]')?.value || '',
          layanan: contactForm.querySelector('[name="kebutuhan_layanan"]')?.value || '',
          pesan: contactForm.querySelector('[name="pesan"]')?.value || ''
        };

        // Validasi data
        if (!formData.nama || !formData.email || !formData.pesan) {
          throw new Error('Nama, email, dan pesan harus diisi!');
        }

        // Kirim data ke Supabase
        const { data, error } = await supabaseClient
          .from('solviXone')
          .insert([{
            name: formData.nama,
            email: formData.email,
            phone: formData.whatsapp,
            message: `Layanan: ${formData.layanan}\n\nPesan:\n${formData.pesan}`,
            source_page: 'contact-form-dark',
            status: 'pending',
            is_read: false,
            created_at: new Date().toISOString()
          }]);

        if (error) {
          throw error;
        }

        // Berhasil
        showNotification('✅ Pesan Anda telah berhasil dikirim!', 'success');
        contactForm.reset();
        
      } catch (error) {
        console.error('Error:', error);
        showNotification('❌ Gagal mengirim pesan: ' + error.message, 'error');
      } finally {
        // Reset tombol submit
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      }
    });
  }

  // BAGIAN 5: SISTEM NOTIFIKASI
  function showNotification(message, type = 'info') {
    // Hapus notifikasi sebelumnya jika ada
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = `custom-notification custom-notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    // Tambahkan styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-width: 400px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.4;
      animation: slideIn 0.3s ease-out;
      ${type === 'success' ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : ''}
      ${type === 'error' ? 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' : ''}
      ${type === 'info' ? 'background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb;' : ''}
    `;

    // Tambahkan ke body
    document.body.appendChild(notification);

    // Auto remove setelah 5 detik
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // BAGIAN 6: FUNGSI UTILITAS SUPABASE TAMBAHAN
  const supabaseUtils = {
    // Ambil semua data dari tabel
    async getAllData(tableName) {
      const supabaseClient = initializeSupabase();
      if (!supabaseClient) return null;

      try {
        const { data, error } = await supabaseClient
          .from(tableName)
          .select('*');
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
        return null;
      }
    },

    // Tambah data baru
    async insertData(tableName, newData) {
      const supabaseClient = initializeSupabase();
      if (!supabaseClient) return null;

      try {
        const { data, error } = await supabaseClient
          .from(tableName)
          .insert([newData]);
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error inserting data:', error);
        return null;
      }
    },

    // Update data
    async updateData(tableName, id, updates) {
      const supabaseClient = initializeSupabase();
      if (!supabaseClient) return null;

      try {
        const { data, error } = await supabaseClient
          .from(tableName)
          .update(updates)
          .eq('id', id);
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error updating data:', error);
        return null;
      }
    },

    // Hapus data
    async deleteData(tableName, id) {
      const supabaseClient = initializeSupabase();
      if (!supabaseClient) return null;

      try {
        const { error } = await supabaseClient
          .from(tableName)
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return true;
      } catch (error) {
        console.error('Error deleting data:', error);
        return false;
      }
    }
  };

  // BAGIAN 7: INISIALISASI SEMUA FUNGSI
  function initialize() {
    console.log('🚀 Memulai inisialisasi aplikasi...');
    
    try {
      initializeScrollAnimations();
      console.log('✅ Animasi scroll berhasil diinisialisasi');
      
      initializeStickyNavbar();
      console.log('✅ Navbar sticky berhasil diinisialisasi');
      
      initializeFormSubmission();
      console.log('✅ Form submission berhasil diinisialisasi');
      
      // Cek koneksi Supabase
      const supabaseClient = initializeSupabase();
      if (supabaseClient) {
        console.log('✅ Koneksi Supabase berhasil');
      }
      
      console.log('🎉 Semua fungsi berhasil diinisialisasi!');
      
    } catch (error) {
      console.error('❌ Error saat inisialisasi:', error);
    }
  }

  // Jalankan inisialisasi
  initialize();

  // Export utils untuk penggunaan global (opsional)
  window.supabaseUtils = supabaseUtils;
  window.showNotification = showNotification;
});

// BAGIAN 8: TAMBAHAN CSS UNTUK NOTIFIKASI (Tambahkan ke CSS Anda)
const notificationStyles = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .custom-notification {
    transition: all 0.3s ease;
  }

  .custom-notification:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  }

  .notification-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .notification-close {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .notification-close:hover {
    opacity: 1;
  }
`;

// Inject styles ke halaman
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);