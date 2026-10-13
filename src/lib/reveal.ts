// Fades sections in as they scroll into view. Content stays visible without JS or with reduced motion.
const TARGETS = '.section-heading, .service-card, .step-card, .feature-card, .promise-card, .about-copy, .about-visual, .locality-card, .coverage-card, .configurator, .estimate-aside, .faq-list > details, .callback-copy, .callback-card, .package-card, .footer-cta';

export function startReveal(): () => void {
  if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  const scan = () => {
    document.querySelectorAll<HTMLElement>(TARGETS).forEach(el => {
      if (el.classList.contains('reveal') || el.closest('[role="dialog"]')) return;
      // Skip anything already on screen so the first view never flickers.
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      const index = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 70}ms`);
      el.classList.add('reveal');
      observer.observe(el);
    });
  };
  scan();
  const mutations = new MutationObserver(scan);
  mutations.observe(document.getElementById('main-content') ?? document.body, { childList: true, subtree: true });
  return () => { observer.disconnect(); mutations.disconnect(); };
}
