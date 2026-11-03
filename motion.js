(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 740px)');
  const rtl = document.documentElement.dir === 'rtl';
  const progress = document.createElement('div');
  progress.className = 'reading-progress'; progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  let scrollFrame = 0;
  const updateProgress = () => {
    scrollFrame = 0;
    const range = document.documentElement.scrollHeight - innerHeight;
    progress.style.scale = `${range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0} 1`;
  };
  addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress); }, {passive:true});
  addEventListener('resize', updateProgress); updateProgress();
  const hero = document.querySelector('.hero');
  if (hero) {
    const network = document.createElement('div'); network.className = 'hero-network'; network.setAttribute('aria-hidden','true');
    for (let i=0;i<14;i++) {
      const dot = document.createElement('i');
      dot.style.cssText = `--x:${6+(i*37)%89}%;--y:${8+(i*23)%80}%;--delay:${-i*1.7}s;--time:${12+i%5*3}s`;
      network.append(dot);
    }
    hero.prepend(network);
  }
  if (preference.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const animations = new Set();
  const run = (el, frames, options) => {
    const animation = el.animate(frames,options); animations.add(animation);
    animation.finished.then(()=>animations.delete(animation)).catch(()=>animations.delete(animation));
    return animation;
  };
  const reveal = el => {
    if (el.dataset.motionSeen) return;
    el.dataset.motionSeen = 'true';
    let x=0,y=mobile.matches?20:36,scale=1;
    if (el.matches('.section-heading,.timeline,.scope-list li')) { x=(rtl?1:-1)*(mobile.matches?16:36); y=0; }
    if (el.matches('.about-image,.award img,.feature-image,.case-screenshot')) { scale=.96;y=20; }
    if (el.matches('.hero-visual,.client-identity')) { scale=.97;y=24; }
    const delay=Number(el.dataset.motionDelay||0);
    run(el,[{opacity:0,translate:`${x}px ${y}px`,scale},{opacity:1,translate:'0px 0px',scale:1}],{duration:mobile.matches?620:850,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
    if (el.matches('.section-heading')) el.classList.add('heading-revealed');
  };
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if (!entry.isIntersecting) return;
    reveal(entry.target);observer.unobserve(entry.target);
  }),{threshold:0,rootMargin:'0px 0px -35px 0px'});
  const selectors='.section-heading,.about-image,.about-content,.expertise,.timeline,.feature-image,.feature-content,.project,.client-card,.skill-group,.award img,.award>div,.education,.cv,.contact-grid>div,.case-hero-grid>div,.scope-list li,.case-aside,.delivery-grid>div,.case-screenshot';
  const items=[...document.querySelectorAll(selectors)];
  items.forEach(el=>{
    if(el.matches('.project,.client-card,.expertise,.skill-group,.education,.cv,.delivery-grid>div')) {
      const index=[...el.parentElement.children].indexOf(el);
      el.dataset.motionDelay=String((index%(mobile.matches?1:3))*110);
    }
    observer.observe(el);
  });
  const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const el=entry.target,original=el.textContent,target=parseInt(original,10),suffix=original.replace(/^\d+/,'');
    countObserver.unobserve(el);
    if(!Number.isFinite(target))return;
    el.setAttribute('aria-label',original);
    let start;
    const tick=now=>{
      if(preference.matches){el.textContent=original;return;}
      start??=now;const t=Math.min((now-start)/1200,1);
      el.textContent=String(Math.round(target*(1-Math.pow(1-t,3))))+suffix;
      if(t<1)requestAnimationFrame(tick);else el.textContent=original;
    };
    requestAnimationFrame(tick);
  }),{threshold:.6});
  document.querySelectorAll('.overview strong').forEach(el=>countObserver.observe(el));
  preference.addEventListener('change',event=>{if(event.matches){observer.disconnect();countObserver.disconnect();animations.forEach(a=>a.cancel());}});
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('.project:not([hidden])').forEach((el,i)=>{
      if(el.getBoundingClientRect().top>=innerHeight)return;
      el.dataset.motionSeen='';el.dataset.motionDelay=String((i%(mobile.matches?1:3))*75);reveal(el);
    });
  }));
})();
