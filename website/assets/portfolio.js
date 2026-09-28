'use strict';
const i18n = window.wayneI18n;
const prefs = window.waynePreferences;
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const save = (key,value) => { try { localStorage.setItem(key,value); } catch {} };
document.getElementById('year').textContent = new Date().getFullYear();
const languageSelect = document.getElementById('language-select');
const appearanceSelect = document.getElementById('appearance-select');
languageSelect.value = prefs.routeLanguage || (['en','zh-Hant','zh-Hans'].includes(prefs.read('wayne-language')) ? prefs.read('wayne-language') : 'auto');
appearanceSelect.value = document.documentElement.dataset.appearance;
function syncLocaleURL(lang){const path={en:'/en/','zh-Hant':'/zh-hant/','zh-Hans':'/zh-hans/',auto:'/'}[lang]||'/';history.replaceState(null,'',path+location.hash);document.querySelector('link[rel=canonical]').href='https://wayneclub.com'+path;document.querySelector('meta[property="og:url"]').content='https://wayneclub.com'+path;}
const preferencesDialog = document.getElementById('preferences');
function openSheet(dialog) {dialog.showModal();document.body.classList.add('sheet-open');}
for (const dialog of document.querySelectorAll('dialog')) {
  dialog.querySelector('.close-sheet').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>document.body.classList.remove('sheet-open'));
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
}
document.querySelector('.settings-button').addEventListener('click',()=>openSheet(preferencesDialog));
languageSelect.addEventListener('change',()=>{save('wayne-language',languageSelect.value);i18n.apply(languageSelect.value);syncLocaleURL(languageSelect.value);});
appearanceSelect.addEventListener('change',()=>{save('wayne-appearance',appearanceSelect.value);document.documentElement.dataset.appearance=appearanceSelect.value;});
window.addEventListener('languagechange',()=>{if(languageSelect.value==='auto')i18n.apply('auto');});
window.addEventListener('storage',event=>{
  if(event.key==='wayne-language'){languageSelect.value=['en','zh-Hant','zh-Hans'].includes(event.newValue)?event.newValue:'auto';i18n.apply(languageSelect.value);}
  if(event.key==='wayne-appearance'){appearanceSelect.value=['light','dark'].includes(event.newValue)?event.newValue:'auto';document.documentElement.dataset.appearance=appearanceSelect.value;}
});
const projects=[...document.querySelectorAll('.project')];
// Keep an English source template for locale changes while a sheet is open.
const projectTemplates = projects.map(card=>({title:card.querySelector('h3').textContent,info:card.querySelector('.project-info').innerHTML,href:card.href}));
const projectDialog=document.getElementById('project-sheet');let activeProject=null;
function renderProject(){if(activeProject===null)return;const p=projectTemplates[activeProject];const content=document.getElementById('project-content');content.innerHTML=p.info;content.querySelector('h3').id='project-title';i18n.translate(content);document.getElementById('project-github').href=p.href;}
projects.forEach((card,index)=>{
  card.setAttribute('aria-haspopup','dialog');
  card.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();activeProject=index;renderProject();openSheet(projectDialog);});
});
for(const button of document.querySelectorAll('.filter'))button.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  projects.forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;});
});
const disclosures=[];
document.querySelectorAll('.job').forEach((job,index)=>{
  const detail=job.querySelector('.job-detail');const panel=document.createElement('div');panel.className='job-extra';panel.id='achievements-'+index;
  panel.append(detail.querySelector('.outcomes'),detail.querySelector('.tags'));
  const button=document.createElement('button');button.className='disclosure';button.setAttribute('aria-controls',panel.id);button.setAttribute('aria-expanded','false');panel.hidden=true;
  button.textContent='Show achievements';detail.append(button,panel);disclosures.push({button,panel});
  button.addEventListener('click',()=>{panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden));button.textContent=i18n.t(panel.hidden?'Show achievements':'Hide achievements');});
});
let toastTimer;
document.querySelector('.copy-email').addEventListener('click',async()=>{
  let message='Email address copied';
  try{await navigator.clipboard.writeText('me@wayneclub.com');}catch{message='Could not copy. Please use the email link.';}
  const toast=document.querySelector('.toast');toast.textContent=i18n.t(message);toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),3500);
});
window.addEventListener('wayne:language',()=>{renderProject();disclosures.forEach(({button,panel})=>button.textContent=i18n.t(panel.hidden?'Show achievements':'Hide achievements'));});
i18n.apply(languageSelect.value);
const navLinks=[...document.querySelectorAll('nav a')];
if('IntersectionObserver' in window){
  const sections=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)navLinks.forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});});},{rootMargin:'-15% 0px -55% 0px'});
  document.querySelectorAll('#work,#experience,#about').forEach(s=>sections.observe(s));
  const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');reveal.unobserve(e.target);}}),{threshold:0.08});
  document.querySelectorAll('.section-heading,.project,.experience,.education,.contact').forEach(el=>{el.classList.add('reveal');reveal.observe(el);});
}
const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
document.querySelectorAll('.project,.identity').forEach(card=>{
  card.addEventListener('pointermove',event=>{
    if(motion.matches||!finePointer.matches)return;
    const r=card.getBoundingClientRect(),x=(event.clientX-r.left)/r.width,y=(event.clientY-r.top)/r.height;
    card.style.setProperty('--pointer-x',x*100+'%');card.style.setProperty('--pointer-y',y*100+'%');
    if(card.classList.contains('identity'))card.style.transform=`perspective(900px) rotateX(${(0.5-y)*7}deg) rotateY(${(x-0.5)*7}deg)`;
  });
  card.addEventListener('pointerleave',()=>{card.style.removeProperty('transform');card.style.removeProperty('--pointer-x');card.style.removeProperty('--pointer-y');});
});
motion.addEventListener('change',()=>document.querySelector('.identity')?.style.removeProperty('transform'));
let scrollPending=false;
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.reading-progress').style.transform=`scaleX(${max>0?scrollY/max:0})`;document.querySelector('.nav').classList.toggle('scrolled',scrollY>30);scrollPending=false;}
window.addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateProgress);}},{passive:true});window.addEventListener('resize',updateProgress);updateProgress();
