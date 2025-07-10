/*
 * File JavaScript Kustom
 * Berisi semua fungsionalitas interaktif untuk website.
 *
 * Daftar Fungsi:
 * 1. Efek Navbar saat di-scroll.
 * 2. Menandai link navigasi yang aktif.
 * 3. Inisialisasi filter portofolio (Isotope).
 * 4. Animasi elemen saat muncul di layar (Intersection Observer).
 */

document.addEventListener('DOMContentLoaded', function () {

    // Efek blur dan shrink navbar saat scroll
    const navbar = document.getElementById('main_nav');
    if (navbar) {
        const handleNavbarScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleNavbarScroll);
        handleNavbarScroll();
    }

    // Tandai link navbar aktif
    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('#main_nav .nav-link');

        navLinks.forEach(link => {
            const linkPage = new URL(link.href).pathname.split('/').pop();
            link.classList.remove('active');
            if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        });
    };
    setActiveNavLink();

    // Inisialisasi Isotope + filter tombol
    // Gunakan window.load agar semua gambar pasti selesai
    window.addEventListener('load', function () {
        if (window.jQuery && $.fn.isotope) {
            const $projects = $('.projects').isotope({
                itemSelector: '.project',
                layoutMode: 'fitRows'
            });

            // Filter tombol
            $('.filter-btn').on('click', function (e) {
                e.preventDefault(); // Hindari loncat ke atas

                const filterValue = $(this).attr('data-filter');
                $projects.isotope({ filter: filterValue });

                // Atur kelas aktif
                $('.filter-btn').removeClass('active shadow');
                $(this).addClass('active shadow');
            });
        }
    });

    // Animasi elemen saat scroll (intersection observer)
    const initializeScrollAnimations = () => {
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
            threshold: 0.1
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    };
    initializeScrollAnimations();

});

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('threejs-container');
    if (!container) return;

    // 1. Inisialisasi Scene, Camera, dan Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    camera.position.z = 2.5;
    
    // 2. Membuat Objek 3D dengan Shader Kustom untuk Efek Cair
    const clock = new THREE.Clock();
    
    // Data yang akan dikirim ke shader untuk mengontrol animasi
    const uniforms = {
        u_time: { type: 'f', value: 0.0 },
        u_frequency: { type: 'f', value: 1.5 },
        u_amplitude: { type: 'f', value: 0.25 },
        u_color: { type: 'c', value: new THREE.Color(0x8A2BE2) } // Warna dasar ungu
    };

    const geometry = new THREE.DodecahedronGeometry(0.8, 15); // Geometri dasar dengan detail tinggi
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `
            uniform float u_time;
            uniform float u_frequency;
            uniform float u_amplitude;

            // Fungsi noise untuk deformasi organik
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            float snoise(vec3 v) {
                const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                vec3 i = floor(v + dot(v, C.yyy));
                vec3 x0 = v - i + dot(i, C.xxx);
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min(g.xyz, l.zxy);
                vec3 i2 = max(g.xyz, l.zxy);
                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy;
                vec3 x3 = x0 - D.yyy;
                i = mod289(i);
                vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                float n_ = 0.142857142857;
                vec3 ns = n_ * D.wyz - D.xzx;
                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_);
                vec4 x = x_ * ns.x + ns.yyyy;
                vec4 y = y_ * ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                vec4 b0 = vec4(x.xy, y.xy);
                vec4 b1 = vec4(x.zw, y.zw);
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
                p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
            }

            varying vec3 vNormal;
            void main() {
                vNormal = normal;
                float noise = snoise(normal * u_frequency + u_time) * u_amplitude;
                vec3 newPosition = position + normal * noise;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 u_color;
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                gl_FragColor = vec4(u_color + intensity, 1.0);
            }
        `
    });
    const morphingCrystal = new THREE.Mesh(geometry, material);
    scene.add(morphingCrystal);

    // 3. Fungsi Animasi (Mengupdate waktu untuk shader)
    function animate() {
        requestAnimationFrame(animate);
        uniforms.u_time.value = clock.getElapsedTime() * 0.3;
        morphingCrystal.rotation.y += 0.002;
        renderer.render(scene, camera);
    }
    animate();

    // 4. Interaksi Mouse
    let isMouseDown = false;
    let previousMousePosition = { x: 0, y: 0 };
    container.addEventListener('mousedown', (e) => { isMouseDown = true; container.style.cursor = 'grabbing'; });
    container.addEventListener('mouseup', () => { isMouseDown = false; container.style.cursor = 'grab'; });
    container.addEventListener('mouseleave', () => { isMouseDown = false; container.style.cursor = 'grab'; });
    container.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        const deltaMove = { x: e.offsetX - previousMousePosition.x, y: e.offsetY - previousMousePosition.y };
        morphingCrystal.rotation.y += deltaMove.x * 0.005;
        morphingCrystal.rotation.x += deltaMove.y * 0.005;
        previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });
    
    // 5. Menangani Perubahan Ukuran Jendela
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});

