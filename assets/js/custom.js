/*
============================================================
== CUSTOM INTERACTIVITY v3.0 (Combined & Final Version) ==
============================================================
*/

document.addEventListener('DOMContentLoaded', function () {

  /**
   * =======================================================
   * FUNGSI #1: Animasi Saat Scroll (Fade In Up)
   * Ini akan berjalan di semua halaman yang memiliki elemennya.
   * =======================================================
   */
  function initializeScrollAnimations() {
    const elements = document.querySelectorAll(`
      .banner-heading, .banner-body,
      .service-header, .service-heading, .service-footer,
      .service-work, .recent-work, 
      section.bg-secondary .h4,
      section.bg-secondary .display-1, 
      section.bg-secondary .btn
    `);

    // Jika tidak ada elemen untuk dianimasikan di halaman ini, hentikan.
    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => {
      el.classList.add('fade-in-up-effect');
      observer.observe(el);
    });
  }

  /**
   * =======================================================
   * FUNGSI #2: Navbar Sticky saat Scroll
   * Ini akan berjalan di semua halaman yang memiliki navbar.
   * =======================================================
   */
  function initializeStickyNavbar() {
    const navbar = document.getElementById('main_nav');
    // Jika tidak ada navbar di halaman ini, hentikan.
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  /**
   * =======================================================
   * FUNGSI #3: Formulir Kontak Interaktif (Multi-Step)
   * Ini HANYA akan berjalan di halaman yang ada formulirnya.
   * =======================================================
   */
  function initializeInteractiveForm() {
    const form = document.getElementById('interactive-form');
    // Jika tidak ada formulir interaktif di halaman ini, hentikan.
    if (!form) return;

    const steps = Array.from(form.querySelectorAll('.form-step'));
    const nextBtns = form.querySelectorAll('.next-btn');
    const prevBtns = form.querySelectorAll('.prev-btn');
    const choiceBtns = form.querySelectorAll('.choice-btn');
    const progressBar = document.getElementById('progress-bar');
    const selectedServiceInput = document.getElementById('selected-service');

    let currentStep = 0;

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        if (progressBar) {
            const progress = ((stepIndex + 1) / steps.length) * 100;
            progressBar.style.width = progress + '%';
            progressBar.setAttribute('aria-valuenow', progress);
        }
    }

    function validateCurrentStep() {
        const currentInputs = steps[currentStep].querySelectorAll('[required]');
        let isValid = true;
        currentInputs.forEach(input => {
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
                currentStep++;
                if (currentStep < steps.length) showStep(currentStep);
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
        button.addEventListener('click', () => {
            choiceBtns.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            if (selectedServiceInput) {
                selectedServiceInput.value = button.textContent.trim();
            }
        });
    });

    showStep(currentStep);
  }

  // =======================================================
  // PANGGIL SEMUA FUNGSI SAAT HALAMAN SIAP
  // =======================================================
  initializeScrollAnimations();
  initializeStickyNavbar();
  initializeInteractiveForm();

});
