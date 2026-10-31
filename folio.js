'use strict';
(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const messages = {
    zh: {
      skip:'跳至目錄',contents:'目錄',contact:'聯絡',view:'檢視 ↗',support:'支援 ↗',appStore:'App Store ↗',
      writingFigure:'圖版 I · Writing',paperieFigure:'圖版 II · Paperie',
      openWriting:'檢視 Writing 圖版',openPaperie:'檢視 Paperie 圖版',
      writingPlateAlt:'Writing 天空畫布的彩色印刷質感圖版',paperiePlateAlt:'Paperie 手帳跨頁的彩色印刷質感圖版',
      availability:'開放專案與合作。',contactNote:'如電郵未獲回覆，或希望更快交流，亦可透過社交平台私訊。',
      xAria:'透過 X 聯繫 @oklauuuuu',threadsAria:'透過 Threads 聯繫 @oklauuuuu',
      privacyAria:'隱私政策',writingPrivacy:'Writing 隱私',paperiePrivacy:'Paperie 隱私',backTop:'頁首 ↑',
      close:'關閉 ×',previous:'← 上一頁',next:'下一頁 →',
      videoFallback:'瀏覽器無法播放影片。',mediaError:'媒體載入失敗。',
      meta:'Asympta — Ka Ho Lau。作品與聯絡。',subject:'專案與合作',page:'第 {n} 頁，共 {total} 頁',
      printLabel:'印刷圖版',videoLabel:'實際操作 · 無聲影片',
      paperCanvas:'紙張畫布',skyCanvas:'天空畫布',spaces:'Spaces',journal:'手帳跨頁',cover:'手帳封面'
    },
    en: {
      skip:'Skip to contents',contents:'Contents',contact:'Contact',view:'View ↗',support:'Support ↗',appStore:'App Store ↗',
      writingFigure:'Plate I · Writing',paperieFigure:'Plate II · Paperie',
      openWriting:'View the Writing plates',openPaperie:'View the Paperie plates',
      writingPlateAlt:'A softly colored printed reproduction of the Writing sky canvas',paperiePlateAlt:'A softly colored printed reproduction of the Paperie journal spread',
      availability:'Open to projects & collaborations.',contactNote:'If your email remains unanswered, or for a quicker conversation, please contact me via social media.',
      xAria:'Contact @oklauuuuu on X',threadsAria:'Contact @oklauuuuu on Threads',
      privacyAria:'Privacy policies',writingPrivacy:'Writing privacy',paperiePrivacy:'Paperie privacy',backTop:'Top ↑',
      close:'Close ×',previous:'← Previous',next:'Next →',
      videoFallback:'Your browser cannot play this video.',mediaError:'The media could not be loaded.',
      meta:'Asympta — Ka Ho Lau. Works and contact.',subject:'Project & Collaboration',page:'Page {n} of {total}',
      printLabel:'Printed reproduction',videoLabel:'Actual app recording · Silent',
      paperCanvas:'Paper canvas',skyCanvas:'Sky canvas',spaces:'Spaces',journal:'Journal spread',cover:'Journal cover'
    }
  };
  // Add future work here and as a semantic article in index.html. The cover does not depend on a product count.
  const projects = {
    writing: {name:'Writing',roman:'I',store:'https://apps.apple.com/app/id6800755232',support:'https://okok147.github.io/asympta-support/',media:[
      {source:'assets/writing-ipad-2.webp',caption:'skyCanvas'},
      {source:'assets/writing-ipad-1.webp',caption:'paperCanvas'},
      {source:'assets/writing-ipad-3.webp',caption:'spaces'}
    ]},
    paperie: {name:'Paperie',roman:'II',store:'https://apps.apple.com/app/id6818553101',support:'https://okok147.github.io/asympta-paperie-support/',media:[
      {source:'assets/paperie-ipad-2.webp',caption:'journal'},
      {source:'assets/paperie-ipad-1.webp',caption:'cover'},
      {video:true,source:'assets/paperie-film.mp4',caption:'videoLabel'}
    ]}
  };
  const dialog = $('#viewer');
  const image = $('#viewer-image');
  const video = $('#viewer-video');
  const error = $('#media-error');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let language = 'zh';
  let selected = 'writing';
  let page = 0;
  let origin = null;
  let previousOverflow = '';
  let displayedKey = '';
  let passAnimation = null;
  const t = (key) => messages[language][key] || key;
  function printPass(element) {
    if (reduced.matches || !element || !element.animate) return;
    // The reproduction underneath is complete and always visible; only a transparent ink pass moves.
    passAnimation?.cancel();
    passAnimation = element.animate([
      {opacity:0,clipPath:'inset(0 100% 0 0)'},
      {opacity:.55,clipPath:'inset(0 40% 0 0)',offset:.48},
      {opacity:0,clipPath:'inset(0 0 0 100%)'}
    ], {duration:1150,easing:'cubic-bezier(.2,.6,.3,1)'});
  }
  function translate() {
    document.documentElement.lang = language === 'zh' ? 'zh-Hant' : 'en';
    $$('[data-i18n]').forEach(e => { e.textContent = t(e.dataset.i18n); });
    $$('[data-i18n-aria]').forEach(e => { e.setAttribute('aria-label', t(e.dataset.i18nAria)); });
    $$('[data-i18n-alt]').forEach(e => { e.alt = t(e.dataset.i18nAlt); });
    $$('.language').forEach(e => {
      e.hidden = false;
      e.textContent = language === 'zh' ? 'EN' : '繁中';
      e.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切換至繁體中文');
      e.lang = language === 'zh' ? 'en' : 'zh-Hant';
    });
    document.title = 'Asympta — Ka Ho Lau';
    $('meta[name="description"]').content = t('meta');
    $('meta[property="og:description"]').content = t('meta');
    $('[data-email]').href = 'mailto:hello@everformlab.com?subject=' + encodeURIComponent(t('subject'));
    if (dialog.open) updateViewerText();
  }
  function setLanguage(next) {
    language = next === 'en' ? 'en' : 'zh';
    translate();
    try { localStorage.setItem('asympta-language', language); } catch (_) { /* Private browsing remains fully usable. */ }
  }
  function currentItem() { return projects[selected].media[page]; }
  function updateViewerText() {
    const project = projects[selected];
    const item = currentItem();
    $('#viewer-title').textContent = project.name;
    $('#viewer-folio').textContent = project.roman + '.';
    $('#viewer-series').textContent = 'ASYMPTA / ' + project.roman;
    const caption = item.video ? t('videoLabel') : t(item.caption) + ' · ' + t('printLabel');
    $('#viewer-caption').textContent = caption;
    image.alt = project.name + ' — ' + caption;
    video.setAttribute('aria-label', project.name + ' — ' + t('videoLabel'));
    $('#viewer-counter').textContent = String(page + 1).padStart(2,'0') + ' / ' + String(project.media.length).padStart(2,'0');
    $('#viewer-counter').setAttribute('aria-label', t('page').replace('{n}',page + 1).replace('{total}',project.media.length));
    $('[data-prev]').disabled = page === 0;
    $('[data-next]').disabled = page === project.media.length - 1;
    $('#viewer-store').href = project.store;
    $('#viewer-support').href = project.support;
  }
  function renderMedia() {
    const item = currentItem();
    const key = selected + ':' + page;
    updateViewerText();
    if (key === displayedKey) return;
    displayedKey = key;
    error.hidden = true;
    video.pause();
    video.hidden = !item.video;
    image.hidden = Boolean(item.video);
    $('.viewer-media').classList.toggle('is-film-reproduction',Boolean(item.video));
    if (item.video) $('.viewer-media').classList.remove('is-print-reproduction');
    if (!item.video) {
      image.classList.add('is-print');
      $('.viewer-media').classList.add('is-print-reproduction');
      $('.viewer-media').classList.remove('is-film-reproduction');
      image.src = item.source;
      if (image.complete && image.naturalWidth > 0) printPass($('.viewer-media .print-pass'));
    }
  }
  function openViewer(key, trigger) {
    if (!projects[key] || dialog.open) return;
    if (typeof dialog.showModal !== 'function') { location.href = trigger.href; return; }
    selected = key; page = 0; origin = trigger; displayedKey = '';
    previousOverflow = document.body.style.overflow;
    renderMedia();
    dialog.showModal();
    document.body.classList.add('has-viewer');
    document.body.style.overflow = 'hidden';
    dialog.scrollTop = 0;
    $('[data-close]').focus({preventScroll:true});
  }
  function turn(delta) {
    if (!dialog.open) return;
    const next = page + delta;
    if (next < 0 || next >= projects[selected].media.length) return;
    page = next; renderMedia(); dialog.scrollTop = 0;
  }
  $$('[data-open]').forEach(a => a.addEventListener('click',e => {
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    if (typeof dialog.showModal !== 'function') return;
    e.preventDefault(); openViewer(a.dataset.open,a);
  }));
  $$('.language').forEach(b => b.addEventListener('click',() => setLanguage(language === 'zh' ? 'en' : 'zh')));
  $('[data-close]').addEventListener('click',() => dialog.close());
  $('[data-prev]').addEventListener('click',() => turn(-1));
  $('[data-next]').addEventListener('click',() => turn(1));
  dialog.addEventListener('close',() => {
    video.pause();
    passAnimation?.cancel();
    document.body.classList.remove('has-viewer');
    document.body.style.overflow = previousOverflow;
    if (origin?.isConnected) origin.focus({preventScroll:true});
  });
  dialog.addEventListener('click',e => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('keydown',e => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.target.closest('video,input,select,textarea')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); turn(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); turn(-1); }
  });
  image.addEventListener('load',() => { error.hidden = true; if (dialog.open) printPass($('.viewer-media .print-pass')); });
  image.addEventListener('error',() => { if (dialog.open && !image.hidden) error.hidden = false; });
  video.addEventListener('error',() => { if (dialog.open && !video.hidden) error.hidden = false; });
  document.addEventListener('visibilitychange',() => { if (document.hidden) video.pause(); });
  reduced.addEventListener('change',() => { if (reduced.matches) { passAnimation?.cancel(); document.getAnimations().forEach(a => a.finish()); } });
  let saved;
  try { saved = localStorage.getItem('asympta-language'); } catch (_) {}
  setLanguage(saved === 'en' ? 'en' : 'zh');
  // No hidden content, layout gates, auto-playing media, timer loops or scroll hijacking.
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      printPass($('.print-pass',entry.target));
      observer.unobserve(entry.target);
    }), {threshold:.25});
    $$('[data-plate]').forEach(e => observer.observe(e));
  }
})();
