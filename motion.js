(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const selector = '.section-heading,.about-grid,.expertise,.timeline,.feature,.project,.client-card,.skill-group,.award,.education,.cv,.contact-grid,.case-hero-grid,.scope-list li,.case-aside,.delivery-grid>div,.case-screenshot';
  const items = [...document.querySelectorAll(selector)];
  let observer;
  const showAll = () => { observer?.disconnect(); items.forEach(el => el.classList.add('is-visible')); };
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
  items.forEach(el => {
    const siblings = [...el.parentElement.children];
    el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el) % 3, 2) * 65}ms`);
    if (el.getBoundingClientRect().top < innerHeight) return;
    el.classList.add('motion-pending');
    observer.observe(el);
  });
  preference.addEventListener('change', event => { if (event.matches) showAll(); });
  // Filtering should never leave newly exposed cards invisible.
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.project:not([hidden])').forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add('is-visible');
    });
  }));
})();
