(() => {
  const carousel=document.querySelector('.home-carousel');
  const slides=[...carousel.querySelectorAll('[data-slide]')];
  const dots=[...carousel.querySelectorAll('[data-slide-to]')];
  const pause=carousel.querySelector('.carousel-pause');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let current=0,timer=null,userPaused=false,focused=false,visible=true,start=null,remaining=[];
  function randomNext(){if(!remaining.length){remaining=slides.map((_,i)=>i).filter(i=>i!==current);for(let i=remaining.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[remaining[i],remaining[j]]=[remaining[j],remaining[i]]}}return remaining.shift()}
  function syncPause(){pause.setAttribute('aria-pressed',String(userPaused));pause.setAttribute('aria-label',userPaused?'Reproduzir carrossel':'Pausar carrossel');pause.firstElementChild.textContent=userPaused?'▷':'Ⅱ'}
  function schedule(){clearTimeout(timer);if(!userPaused&&!focused&&visible&&!document.hidden)timer=setTimeout(()=>show(randomNext(),false),8500)}
  function show(index,manual=true){current=(index+slides.length)%slides.length;slides.forEach((slide,i)=>{const active=i===current;slide.classList.toggle('is-active',active);slide.inert=!active;slide.setAttribute('aria-hidden',String(!active))});dots.forEach((dot,i)=>{if(i===current)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current')});carousel.querySelector('.carousel-count b').textContent=String(current+1).padStart(2,'0');if(manual){remaining=[];document.getElementById('carousel-status').textContent=slides[current].getAttribute('aria-label')}schedule()}
  dots.forEach(dot=>dot.addEventListener('click',()=>show(Number(dot.dataset.slideTo))));
  carousel.querySelector('[data-carousel-prev]').addEventListener('click',()=>show(current-1));
  carousel.querySelector('[data-carousel-next]').addEventListener('click',()=>show(current+1));
  pause.addEventListener('click',()=>{userPaused=!userPaused;syncPause();schedule()});
  carousel.addEventListener('keydown',e=>{if(e.target.closest('a,button'))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(current+(e.key==='ArrowRight'?1:-1))}});
  function syncFocus(){focused=Boolean(document.activeElement.closest('.carousel-slide'))&&document.activeElement.matches(':focus-visible');schedule()}
  carousel.addEventListener('focusin',syncFocus);carousel.addEventListener('focusout',()=>queueMicrotask(syncFocus));
  carousel.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&!e.target.closest('button,.slide-cta'))start={x:e.clientX,y:e.clientY}});
  let suppressClickUntil=0;
  carousel.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4){suppressClickUntil=Date.now()+500;show(current+(dx<0?1:-1))}});carousel.addEventListener('pointercancel',()=>{start=null});
  carousel.addEventListener('click',e=>{if(Date.now()<suppressClickUntil&&e.target.closest('.slide-media')){e.preventDefault();e.stopPropagation()}},true);
  document.addEventListener('visibilitychange',schedule);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()},{threshold:.12}).observe(carousel);syncPause();schedule();
  document.querySelectorAll('[data-open-exams]').forEach(a=>a.addEventListener('click',()=>document.getElementById('exames-tab').click()));
  const cards=[...document.querySelectorAll('#consultas .service-card')];
  const more=document.createElement('button');more.type='button';more.className='specialties-more';more.setAttribute('aria-controls','consultas');more.setAttribute('aria-expanded','false');document.getElementById('consultas').after(more);
  let expanded=false;function updateCards(){cards.forEach((card,i)=>{card.hidden=i>=4&&!expanded});more.textContent=expanded?'Mostrar menos especialidades ↑':`Ver todas as especialidades (${cards.length}) ↓`;more.setAttribute('aria-expanded',String(expanded));more.hidden=cards.length<=4||document.getElementById('consultas').hidden}
  more.addEventListener('click',()=>{expanded=!expanded;updateCards()});document.querySelectorAll('[data-tab]').forEach(tab=>tab.addEventListener('click',()=>updateCards()));new MutationObserver(updateCards).observe(document.getElementById('consultas'),{attributes:true,attributeFilter:['hidden']});updateCards();
  const selector='.button, button, .quick-action, .service-card a, .text-link, .mobile-location';
  document.addEventListener('pointerdown',e=>{const target=e.target.closest(selector);if(!target||e.button!==0)return;target.classList.add('is-pressed');if(motion.matches)return;const rect=target.getBoundingClientRect(),ripple=document.createElement('span');ripple.className='tap-ripple';ripple.setAttribute('aria-hidden','true');const size=Math.max(rect.width,rect.height)*2;ripple.style.cssText=`width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;target.appendChild(ripple);ripple.addEventListener('animationend',()=>ripple.remove(),{once:true})});
  const release=()=>document.querySelectorAll('.is-pressed').forEach(el=>setTimeout(()=>el.classList.remove('is-pressed'),100));document.addEventListener('pointerup',release);document.addEventListener('pointercancel',release);window.addEventListener('blur',release);
})();
