const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  nav.classList.toggle('open', expanded);
});
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }
});
const filters = [...document.querySelectorAll('[data-filter]')];
const projects = [...document.querySelectorAll('.project[data-category]')];
filters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let visible = 0;
  projects.forEach(project => {
    project.hidden = category !== 'all' && project.dataset.category !== category;
    if (!project.hidden) visible++;
  });
  document.querySelector('#filter-status').textContent = document.documentElement.lang === 'ar' ? `عدد المشاريع المعروضة: ${visible}` : `${visible} projects shown`;
}));
const cases = JSON.parse(document.querySelector('#case-data').textContent);
const dialog = document.querySelector('#case-dialog');
let opener = null;
document.querySelectorAll('[data-case]').forEach(button => button.addEventListener('click', () => {
  const data = cases[button.dataset.case];
  if (!data) return;
  opener = button;
  document.querySelector('#case-title').textContent = data.title;
  const cover = button.dataset.case === 'wida' ? '<figure style="margin:0"><img src="wida-cover.webp" alt="Wida Service Hub — illustrative project cover"><figcaption class="note">'+(document.documentElement.lang === 'ar' ? 'تصور توضيحي لوظائف المنصة، دون بيانات فعلية.' : 'Illustrative platform overview, without live data.')+'</figcaption></figure>' : '';
  document.querySelector('#case-content').innerHTML = cover + data.body;
  dialog.showModal();
  dialog.scrollTop = 0;
}));
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {if(event.target === dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close', () => {if(opener) opener.focus();});
const sections = [...document.querySelectorAll('section[id]')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if(entry.isIntersecting) {
      nav.querySelectorAll('a').forEach(link => link.classList.toggle('active',link.getAttribute('href')==='#'+entry.target.id));
    }
  }, {rootMargin:'-15% 0px -65% 0px'});
  sections.forEach(section=>observer.observe(section));
}
