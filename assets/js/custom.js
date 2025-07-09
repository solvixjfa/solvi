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

  