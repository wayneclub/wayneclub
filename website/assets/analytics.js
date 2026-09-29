'use strict';
(() => {
  const id = window.WAYNE_ANALYTICS?.measurementId || '';
  const configured = /^G-[A-Z0-9]{6,}$/.test(id);
  const select = document.getElementById('analytics-select');
  const status = document.getElementById('analytics-status');
  const dialog = document.getElementById('privacy-sheet');
  let choice; try {choice=localStorage.getItem('wayne-analytics-consent');}catch{}
  let loaded=false, active=false, toastTimer;
  window.dataLayer=window.dataLayer||[];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag=gtag;
  const pageLocation=()=>location.origin+location.pathname;
  const referrer=()=>{try{return new URL(document.referrer).origin+'/';}catch{return '';}};
  function pageView(){if(active)gtag('event','page_view',{page_location:pageLocation(),page_title:document.title,page_referrer:referrer(),language:document.documentElement.lang});}
  function enable(){
    if(!configured)return;
    window['ga-disable-'+id]=false;
    if(!loaded){
      gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
      gtag('js',new Date());
      gtag('config',id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_domain:location.hostname,cookie_flags:'SameSite=Lax;Secure',page_location:pageLocation(),page_referrer:referrer()});
      const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);document.head.append(script);loaded=true;
    }
    gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});active=true;pageView();
  }
  function disable(){
    active=false;window['ga-disable-'+id]=true;
    if(loaded)gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    const names=document.cookie.split(';').map(c=>c.trim().split('=')[0]).filter(n=>n==='_ga'||n==='_ga_'+id.slice(2));
    names.forEach(n=>['',location.hostname,'.'+location.hostname].forEach(domain=>{document.cookie=n+'=; Max-Age=0; Path=/; SameSite=Lax; Secure'+(domain?'; Domain='+domain:'');}));
  }
  function remember(value){choice=value;try{localStorage.setItem('wayne-analytics-consent',value);}catch{};select.value=value;value==='granted'?enable():disable();document.querySelector('.consent-banner').hidden=true;}
  select.value=choice==='granted'?'granted':'denied';
  select.disabled=!configured;
  status.textContent=configured?'You can change this choice at any time.':'Analytics is not currently enabled.';
  document.querySelector('.privacy-button').addEventListener('click',()=>{dialog.showModal();document.body.classList.add('sheet-open');});
  select.addEventListener('change',()=>remember(select.value));
  document.querySelectorAll('[data-consent]').forEach(b=>b.addEventListener('click',()=>remember(b.dataset.consent)));
  if(configured){if(choice==='granted')enable();else if(choice!=='denied')document.querySelector('.consent-banner').hidden=false;}
  const track=(name,params={})=>{if(active)gtag('event',name,{...params,language:document.documentElement.lang});};
  document.querySelectorAll('.project-open').forEach((button,index)=>button.addEventListener('click',()=>track('project_open',{project_index:index+1})));
  document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>track('project_filter',{category:b.dataset.filter})));
  document.querySelectorAll('a[href$=".pdf"]').forEach(a=>a.addEventListener('click',()=>track('resume_download')));
  document.querySelectorAll('a[href^="mailto:"]').forEach(a=>a.addEventListener('click',()=>track('contact_click')));
  document.querySelector('.copy-email').addEventListener('click',()=>track('email_copy'));
  document.getElementById('language-select').addEventListener('change',()=>{track('language_change');pageView();});
  document.getElementById('appearance-select').addEventListener('change',e=>track('appearance_change',{appearance:e.target.value}));
  window.addEventListener('storage',e=>{if(e.key==='wayne-analytics-consent'){choice=e.newValue;select.value=choice==='granted'?'granted':'denied';choice==='granted'?enable():disable();}});
  window.wayneI18n.translate(dialog);window.wayneI18n.translate(document.querySelector('.consent-banner'));
})();
