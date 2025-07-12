# Solusi Digital Website

Website profesional untuk layanan transformasi digital, pengembangan web, dan otomatisasi bisnis.

## 🚀 Fitur Utama

- **Landing Page Modern** dengan animasi dan interaksi yang menarik
- **Sistem Autentikasi** menggunakan Supabase
- **Dashboard Admin** untuk mengelola pesan kontak
- **Portfolio Showcase** dengan filter dan lightbox
- **Responsive Design** yang optimal di semua perangkat
- **SEO Optimized** dengan meta tags dan struktur yang baik

## 🛠️ Teknologi

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **UI Framework**: Bootstrap 5
- **Database**: Supabase
- **Hosting**: Vercel
- **Icons**: Boxicons
- **Animations**: CSS3 Transitions & Keyframes

## 📁 Struktur Project

```
├── index.html              # Halaman utama
├── about.html              # Halaman tentang
├── work.html               # Portfolio/karya
├── pricing.html            # Halaman harga
├── contact.html            # Formulir kontak
├── login.html              # Halaman login admin
├── dashboard.html          # Dashboard admin
├── work-single.html        # Detail workflow
├── assets/
│   ├── css/
│   │   ├── custom.css      # Styling utama
│   │   ├── templatemo.css  # Template styling
│   │   └── contact-custom.css
│   ├── js/
│   │   ├── custom.js       # JavaScript utama
│   │   ├── auth.js         # Sistem autentikasi
│   │   ├── dashboard.js    # Logika dashboard
│   │   └── contact-custom.js
│   └── img/                # Gambar dan aset
├── vercel.json             # Konfigurasi Vercel
└── package.json            # Dependencies
```

## 🔧 Setup Development

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd solusi-digital-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Supabase**
   - Buat project di [Supabase](https://supabase.com)
   - Update URL dan API key di file JavaScript
   - Buat tabel `kontak_form` sesuai schema

4. **Run development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment ke Vercel

### Otomatis (Recommended)
1. Push code ke GitHub
2. Connect repository di [Vercel Dashboard](https://vercel.com)
3. Deploy otomatis setiap push

### Manual
```bash
npm install -g vercel
vercel --prod
```

## 📊 Database Schema

### Tabel: kontak_form
```sql
CREATE TABLE kontak_form (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  source_page VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Environment Variables

Untuk production, set environment variables berikut:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 Responsive Breakpoints

- **Mobile**: < 576px
- **Tablet**: 576px - 768px
- **Desktop**: 768px - 1200px
- **Large Desktop**: > 1200px

## 🎨 Color Palette

- **Primary**: #2563eb (Blue-600)
- **Secondary**: #60a5fa (Blue-400)
- **Accent**: #7c3aed (Purple-600)
- **Text**: #1e3a8a (Blue-900)
- **Background**: #eff6ff (Blue-50)

## 📈 Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🔒 Security Features

- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: Supabase built-in protection
- **Input Validation**: Frontend dan backend validation
- **Secure Headers**: X-Frame-Options, X-Content-Type-Options

## 📞 Support

Untuk pertanyaan atau dukungan:
- **Email**: solvixone@gmail.com
- **WhatsApp**: +62857-3604-8626

## 📄 License

MIT License - Lihat file LICENSE untuk detail lengkap.

---

**Dibuat dengan ❤️ oleh solviXone**