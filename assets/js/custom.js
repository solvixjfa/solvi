/*
============================================================
== CUSTOM JS v7.0 (Hanya Fungsi Non-Filter) ==
============================================================
*/

document.addEventListener('DOMContentLoaded', function () {

  /**
   * =======================================================
   * FUNGSI #1: Animasi Saat Scroll (Fade In Up)
   * =======================================================
   */
  function initializeScrollAnimations() {
    const elements = document.querySelectorAll(`
      .banner-heading, .banner-body,
      .service-header, .service-heading, .service-footer,
      .service-work, .recent-work, 
      section.bg-secondary .h4,
      section.bg-secondary .display-1, 
      section.bg-secondary .btn,
      .fade-in-up-effect
    `);
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
      if (!el.classList.contains('fade-in-up-effect')) {
          el.classList.add('fade-in-up-effect');
      }
      observer.observe(el);
    });
  }

  /**
   * =======================================================
   * FUNGSI #2: Navbar Sticky saat Scroll
   * =======================================================
   */
  function initializeStickyNavbar() {
    const navbar = document.getElementById('main_nav');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  /**
   * =======================================================
   * FUNGSI #3: Formulir Kontak Interaktif (Multi-Step)
   * =======================================================
   */
  function initializeInteractiveForm() {
    const form = document.getElementById('interactive-form');
    if (!form) return;
    const steps = Array.from(form.querySelectorAll('.form-step'));
    const nextBtns = form.querySelectorAll('.next-btn');
    const prevBtns = form.querySelectorAll('.prev-btn');
    const choiceBtns = form.querySelectorAll('.choice-btn');
    const progressBar = document.getElementById('progress-bar');
    const selectedServiceInput = document.getElementById('selected-service');
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
            if (selectedServiceInput) selectedServiceInput.value = button.textContent.trim();
        });
    });
    
    showStep(currentStep);
  }

  // Panggil semua fungsi yang aman untuk dijalankan saat HTML siap
  initializeScrollAnimations();
  initializeStickyNavbar();
  initializeInteractiveForm();

});

