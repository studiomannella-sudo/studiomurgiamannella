(() => {
  'use strict';
  if (window.studioAdsConsent) return;
  window.studioAdsConsent = true;
  const key = 'smm-ads-consent-v1';
  const lifetime = 180 * 86400000;
  let choice = null, started = false;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && Date.now() - saved.at < lifetime && ['yes','no'].includes(saved.value)) choice = saved.value;
  } catch (_) {}
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  const denied = {ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'};
  gtag('consent', 'default', denied);
  function start() {
    if (started) return;
    started = true;
    gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'denied',analytics_storage:'denied'});
    gtag('set','ads_data_redaction',true);
    gtag('js',new Date());
    gtag('config','AW-18499929173',{send_page_view:false,allow_enhanced_conversions:false,allow_ad_personalization_signals:false});
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-18499929173';
    document.head.appendChild(script);
  }
  const panel = document.createElement('section');
  panel.id = 'smm-consent';
  panel.setAttribute('aria-label','Preferenze cookie');
  panel.innerHTML = '<strong>Misurazione della pubblicità</strong><p>Con il tuo consenso usiamo Google Ads per misurare i clic su WhatsApp provenienti dagli annunci. Google può utilizzare cookie e ricevere dati della visita. Puoi rifiutare e usare comunque tutti i contatti.</p><details><summary>Dettagli sui cookie</summary><p>Lo Studio Murgia Mannella, Via Palabanda 12, Cagliari, usa questa misurazione per valutare gli annunci. Non inviamo il contenuto delle conversazioni, email o numeri di telefono del visitatore. Non attiviamo pubblicità personalizzata. I cookie Google Ads possono durare fino a 90 giorni; la scelta è salvata su questo dispositivo per 180 giorni. Puoi revocarla da “Preferenze cookie” in fondo alla pagina. Contatti: studiomurgiamannella@gmail.com. <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Come Google utilizza i dati</a>.</p></details><div class="smm-consent-actions"><button type="button" data-choice="no">Rifiuta</button><button type="button" data-choice="yes">Accetta misurazione</button></div>';
  document.body.appendChild(panel);
  const preferences = document.createElement('button');
  preferences.type = 'button';
  preferences.className = 'smm-preferences';
  preferences.textContent = 'Preferenze cookie';
  (document.querySelector('footer .wrap') || document.querySelector('footer') || document.body).appendChild(preferences);
  preferences.addEventListener('click', () => { panel.hidden = false; panel.querySelector('button').focus(); });
  panel.hidden = choice !== null;
  function clearAdsCookies() {
    document.cookie.split(';').forEach(item => {
      const name = item.split('=')[0].trim();
      if (!/^_gcl_/.test(name)) return;
      const parts = location.hostname.split('.');
      document.cookie = name + '=; Max-Age=0; path=/';
      for (let i=0; i<parts.length-1; i++) document.cookie = name + '=; Max-Age=0; path=/; domain=.' + parts.slice(i).join('.');
    });
  }
  panel.addEventListener('click', event => {
    const button = event.target.closest('button[data-choice]');
    if (!button) return;
    choice = button.dataset.choice;
    try { localStorage.setItem(key, JSON.stringify({value:choice,at:Date.now()})); } catch (_) {}
    panel.hidden = true;
    if (choice === 'yes') start();
    else {
      gtag('consent','update',denied);
      clearAdsCookies();
      if (started) location.reload();
    }
    preferences.focus();
  });
  if (choice === 'yes') start();
  document.addEventListener('click', event => {
    if (choice !== 'yes' || event.defaultPrevented || event.button !== 0) return;
    const link = event.target.closest('a[href]');
    if (!link) return;
    let url;
    try { url = new URL(link.href); } catch (_) { return; }
    if (url.protocol === 'tel:' && url.pathname.replace(/[^+\d]/g, '') === '+390706490526') {
      gtag('event', 'phone_click', {event_category:'contact', event_label:'studio_landline'});
      return;
    }
    if (url.protocol !== 'https:' || url.hostname !== 'wa.me' || url.pathname.replace(/\/$/,'') !== '/393498020239') return;
    const sameTab = !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && (!link.target || link.target === '_self');
    let navigated = false;
    const navigate = () => { if (sameTab && !navigated) { navigated = true; location.assign(link.href); } };
    if (sameTab) { event.preventDefault(); setTimeout(navigate, 900); }
    gtag('event','conversion',{send_to:'AW-18499929173/eAW5CL-gupUdENWIuvVE',event_callback:navigate,event_timeout:800});
  });
})();