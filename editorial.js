'use strict';
const supports = { writing: 'https://okok147.github.io/asympta-support/', paperie: 'https://okok147.github.io/asympta-paperie-support/' };
const stores = { writing: 'https://apps.apple.com/app/id6800755232', paperie: 'https://apps.apple.com/app/id6818553101' };
const stories = {
  writing: [
    { image: 'writing-ipad-1.webp', zh: ['Apple Pencil 書寫與無限畫布','支援 Apple Pencil 手寫、草圖與文字輸入。畫布可以自由移動和縮放，並在同一空間整理筆記與圖像。','無限畫布 · Apple Pencil · 文字輸入','Writing · 真實 App 畫面：紙張畫布'], en: ['Apple Pencil and an infinite canvas','Write with Apple Pencil, draw sketches, or type notes on a canvas that can be panned and zoomed.','Apple Pencil · Handwriting · Drawing · Text','Writing · Actual app screenshot: paper canvas'] },
    { image: 'writing-ipad-2.webp', zh: ['紙張與天空書寫場景','可在紙張和天空場景之間切換，使用相同的拖動與縮放操作。','紙張與天空 · 自由移動與縮放','Writing · 真實 App 畫面：天空畫布'], en: ['Paper and sky writing scenes','Switch between paper and sky backgrounds while continuing to pan and zoom your canvas.','Paper and sky · Pan and zoom','Writing · Actual app screenshot: sky canvas'] },
    { image: 'writing-ipad-3.webp', zh: ['Spaces 與 PNG 匯出','用不同 Spaces 分開管理主題、文字與草圖，並將內容匯出為 PNG。','Spaces 整理 · PNG 匯出','Writing · 真實 App 畫面：Spaces'], en: ['Spaces and PNG export','Organize text and sketches in separate Spaces and export your content as PNG.','Spaces · PNG export','Writing · Actual app screenshot: Spaces'] }
  ],
  paperie: [
    { video: true, zh: ['支援手寫與文具的數位手帳','在手帳頁面上手寫、打字，並加入照片、貼紙與印章。可像紙本手帳一樣翻閱。','手寫與打字 · 照片 · 貼紙與印章','Paperie · 真實操作影片 · 1:30，無聲'], en: ['A digital journal with stationery','Handwrite or type journal entries, insert photos, stickers and stamps, and turn pages like a paper journal.','Actual app recording · 90 seconds · Silent','Paperie · Actual app recording · 1:30, silent'] },
    { image: 'paperie-ipad-2.webp', zh: ['跨頁手帳與貼紙工具','在跨頁手帳中使用 Apple Pencil 書寫、文字、貼紙及印章。','Apple Pencil · 打字 · 貼紙與印章','Paperie · 真實 App 畫面：跨頁手帳'], en: ['Journal spreads and stickers','Use Apple Pencil writing, typed text, stickers and stamps in an open journal spread.','Apple Pencil · Typing · Stickers and stamps','Paperie · Actual app screenshot: journal spread'] },
    { image: 'paperie-ipad-1.webp', zh: ['封面與手帳頁面','選擇手帳封面，建立頁面並記錄日常內容。','自選封面 · 日常手帳','Paperie · 真實 App 畫面：手帳封面'], en: ['Covers and journal pages','Choose a journal cover and create pages for your daily entries.','A choice of covers · Everyday journaling','Paperie · Actual app screenshot: notebook cover'] }
  ]
};

const translations = {
  zh: {
    skip:'跳至內容',navWork:'作品',navCollab:'合作',
    heroDescription:'為思緒、書寫與日常創造一點空間。由 Ka Ho Lau 獨立設計與製作的數位作品。',
    heroFootnote:'兩件小作品，無數個尚未寫下的時刻。',explore:'閱讀作品 ↓',
    writingCategory:'書寫 / 繪畫 / 思考',paperieCategory:'手帳 / 紙張 / 日常',
    writingDescription:'一張無限延伸的紙，讓想法自由生長。',
    paperieDescription:'一本可以隨身攜帶，慢慢留下生活的紙本手帳。',
    readStory:'閱讀作品介紹 ↗',collabSide:'歡迎專案與合作邀約',
    collabDescription:'開放產品設計、創意技術與獨立專案合作。如果你有正在構思的作品，歡迎來信交流。',
    collabAction:'討論一個專案 ↗',writingPrivacy:'Writing 隱私',paperiePrivacy:'Paperie 隱私',
    closeStory:'關閉 ×',previous:'← 上一頁',next:'下一頁 →',
    videoFallback:'瀏覽器不支援播放影片。',videoError:'影片暫時無法播放。',watchFilm:'▷ 觀看實際操作',support:'APP 支援 ↗'
  },
  en: {
    skip:'Skip to content',navWork:'Works',navCollab:'Collaborate',
    heroDescription:'Making room for ideas, writing, and the everyday. Independent digital works designed and built by Ka Ho Lau.',
    heroFootnote:'Two small works. Countless moments not yet written.',explore:'Explore the works ↓',
    writingCategory:'WRITING / DRAWING / THINKING',paperieCategory:'JOURNAL / PAPER / EVERYDAY',
    writingDescription:'An open canvas for thoughts to take shape.',
    paperieDescription:'A small paper-inspired journal for everyday life.',
    readStory:'Read the story ↗',collabSide:'OPEN TO PROJECTS & COLLABORATIONS',
    collabDescription:'Open to product design, creative technology, and independent project collaborations. If you have something in mind, I would love to hear about it.',
    collabAction:'Start a conversation ↗',writingPrivacy:'Writing privacy',paperiePrivacy:'Paperie privacy',
    closeStory:'Close ×',previous:'← Previous',next:'Next →',
    videoFallback:'Your browser does not support video.',videoError:'The video could not play.',watchFilm:'▷ Watch the recording',support:'APP SUPPORT ↗'
  }
};
Object.assign(translations.zh,{"homeAria":"Asympta 首頁","mainNavAria":"主選單","imprintRole":"獨立作品 · 2026","atlas":"圖錄 / 01","topline":"設計 · 軟體 · 日常","byline":"KA HO LAU 的作品","heroLine1":"書寫。","heroLine2":"繪畫。","heroLine3":"記錄。","heroDiagramAria":"原創雕版地形圖研究","fig01":"圖 01","fig01Caption":"等高線 / 地形 / 雕版","worksHeading":"精選作品","workIndex":"索引 / 001—002","writingNumber":"第 001 號","paperieNumber":"第 002 號","writingMeta":"無限畫布 · APPLE PENCIL · 文字","paperieMeta":"手帳 · 貼紙 · 印章","writingDiagramAria":"手寫線條研究","paperieDiagramAria":"翻開手帳的線描研究","plateI":"圖版 I · 無限延展","plateII":"圖版 II · 記錄日常","folio":"書頁","openFor":"歡迎交流","collabIndex":"專案與合作 / 003","collabTitle1":"開放","collabTitle2":"專案","collabTitle3":"與合作。","contactFallback":"如電郵未獲回覆，或希望更快交流，亦可透過以下社交平台私訊。","xLink":"X 私訊 ↗","threadsLink":"Threads 私訊 ↗","copyright":"© 2026 KA HO LAU · 獨立作品","privacyNavAria":"隱私政策","pageNavAria":"翻頁選單","backTop":"↑ 頁首","dialogBreadcrumb":"ASYMPTA / 作品 / ","atlasOfThings":"作品檔案 · 2026","storeAction":"App Store 下載 ↗","videoAria":"Paperie 真實 App 操作影片","metaTitle":"Asympta — Ka Ho Lau · 獨立作品","metaDescription":"Ka Ho Lau 的獨立 App：Asympta Writing 與 Paperie。開放專案與合作提案。","emailSubject":"專案與合作邀約"});
Object.assign(translations.en,{"homeAria":"Asympta home","mainNavAria":"Main navigation","imprintRole":"INDEPENDENT WORKS · 2026","atlas":"ATLAS / 01","topline":"DESIGN · SOFTWARE · EVERYDAY LIFE","byline":"THE WORK OF KA HO LAU","heroLine1":"Write.","heroLine2":"Sketch.","heroLine3":"Keep.","heroDiagramAria":"Original archival topographical engraving","fig01":"FIG. 01","fig01Caption":"CONTOUR / RELIEF / ENGRAVING","worksHeading":"SELECTED WORKS","workIndex":"INDEX / 001—002","writingNumber":"NO. 001","paperieNumber":"NO. 002","writingMeta":"OPEN CANVAS · APPLE PENCIL · TEXT","paperieMeta":"JOURNAL · STICKERS · STAMPS","writingDiagramAria":"Study of a handwritten line","paperieDiagramAria":"Technical drawing of an open journal","plateI":"PLATE I · WITHOUT AN END","plateII":"PLATE II · A DAY KEPT","folio":"FOLIO","openFor":"OPEN FOR CONVERSATION","collabIndex":"PROJECTS & COLLABORATIONS / 003","collabTitle1":"Open to","collabTitle2":"projects","collabTitle3":"& collaborations.","contactFallback":"If an email goes unanswered, or you would prefer a quicker conversation, you can also reach me by social media direct message.","xLink":"Message on X ↗","threadsLink":"Message on Threads ↗","copyright":"© 2026 KA HO LAU · INDEPENDENT WORKS","privacyNavAria":"Privacy policies","pageNavAria":"Page navigation","backTop":"↑ TOP","dialogBreadcrumb":"ASYMPTA / WORKS / ","atlasOfThings":"WORK ARCHIVE · 2026","storeAction":"View on App Store ↗","videoAria":"Actual Paperie app recording","metaTitle":"Asympta — Ka Ho Lau · Independent Works","metaDescription":"Writing and Paperie by Ka Ho Lau. Open to projects and collaborations.","emailSubject":"Project & Collaboration Enquiry"});

Object.assign(translations.zh,{"heroDescription":"由 Ka Ho Lau 獨立設計與開發的 Writing 與 Paperie，提供 iPhone、iPad 的手寫畫布與數位手帳。","heroFootnote":"Writing 與 Paperie · iPhone / iPad","writingDescription":"支援 Apple Pencil 手寫、草圖及文字輸入的無限畫布，可自由移動與縮放。","paperieDescription":"可手寫、打字、加入照片、貼紙與印章的數位手帳，支援翻頁閱讀。","collabDescription":"歡迎產品設計、App、創意技術及獨立專案的合作提案。來信時可附上需求概要與預計時程。","collabAction":"電郵洽談 ↗"});
Object.assign(translations.en,{"heroDescription":"Writing and Paperie are independently built iPhone and iPad apps for handwriting, sketching, and digital journaling.","heroFootnote":"Writing & Paperie · iPhone / iPad","writingDescription":"An infinite canvas for Apple Pencil handwriting, sketching, typed notes, and pan-and-zoom.","paperieDescription":"A digital journal for handwriting, typing, photos, stickers, stamps, and page turning.","collabDescription":"Available for product design, apps, creative technology, and independent projects. Please include a short brief and proposed timeline.","collabAction":"Enquire by email ↗"});
Object.assign(translations.zh,{plateAlt:"原創雕版風格地形圖，包含等高線、排線與墨點"});Object.assign(translations.en,{plateAlt:"Original engraved topographical plate with contour lines, hachures and stippled ink"});
const byId = id => document.getElementById(id);
const dialog=byId('story-dialog'),video=byId('paperie-film'),playButton=byId('start-film'),
      errorMessage=byId('video-error'),storyImage=byId('story-image'),
      prevButton=byId('prev-page'),nextButton=byId('next-page');
let language='zh',project='writing',page=0,trigger=null,previousOverflow='';
function label(key){return key==='writing'?'Writing':'Paperie'}
function setLanguage(next){
  language=next;document.documentElement.lang=next==='en'?'en':'zh-Hant';
  document.querySelectorAll('[data-i18n]').forEach(el=>{const value=translations[next][el.dataset.i18n];if(value!==undefined)el.textContent=value});
  document.querySelectorAll('[data-i18n-alt]').forEach(el=>{const value=translations[next][el.dataset.i18nAlt];if(value!==undefined)el.setAttribute('alt',value)});
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el=>{
    const value=translations[next][el.dataset.i18nAriaLabel];if(value!==undefined)el.setAttribute('aria-label',value);
  });
  document.title=translations[next].metaTitle;
  const ogTitle=document.querySelector('meta[property="og:title"]');if(ogTitle)ogTitle.content=translations[next].metaTitle;
  const ogDesc=document.querySelector('meta[property="og:description"]');if(ogDesc)ogDesc.content=translations[next].metaDescription;
  const emailLink=document.querySelector('.contact-link');
  if(emailLink)emailLink.href='mailto:hello@everformlab.com?subject='+encodeURIComponent(translations[next].emailSubject);

  document.querySelectorAll('.language-switch').forEach(button=>{button.textContent=next==='en'?'繁中':'EN';button.setAttribute('aria-label',next==='en'?'切換至繁體中文':'Switch to English')});
  document.querySelectorAll('[data-open]').forEach(button=>button.setAttribute('aria-label',next==='en'?'Read about Asympta '+label(button.dataset.open):'閱讀 Asympta '+label(button.dataset.open)+' 作品介紹'));
  playButton.setAttribute('aria-label',next==='en'?'Play real Paperie video':'播放 Paperie 真實操作影片');
  document.querySelector('meta[name="description"]').content=translations[next].metaDescription;
  try{localStorage.setItem('asympta-language',next)}catch(_){}
  if(dialog.open)renderStory();
}
function renderStory(){
  const item=stories[project][page],copy=item[language];
  byId('story-product').textContent=label(project).toUpperCase();
  byId('story-chapter').textContent=String(page+1).padStart(2,'0')+' / '+label(project).toUpperCase();
  byId('story-title').textContent=copy[0];
  byId('story-body').textContent=copy[1];
  byId('story-detail').textContent=copy[2];
  byId('media-caption').textContent=copy[3];
  byId('film-wrap').hidden=!item.video;
  storyImage.hidden=!!item.video;
  if(item.image){storyImage.src='assets/'+item.image;storyImage.alt=copy[3]}
  if(!item.video)video.pause();
  playButton.hidden=!item.video||!video.paused;
  errorMessage.hidden=true;
  const dl=byId('story-download');
  dl.href=stores[project];dl.setAttribute('aria-label',language==='en'?'Download Asympta '+label(project):'下載 Asympta '+label(project));
  byId('story-icon').src='assets/'+project+'-icon.webp';
  byId('story-support').href=supports[project];
  byId('page-counter').textContent=String(page+1).padStart(2,'0')+' / 03';
  byId('page-counter').setAttribute('aria-label',language==='en'?'Page '+(page+1)+' of 3':'第 '+(page+1)+' 頁，共 3 頁');
  prevButton.disabled=page===0;nextButton.disabled=page===2;
}
function openStory(key,button){
  if(dialog.open||!stories[key])return;
  project=key;page=0;trigger=button;previousOverflow=document.body.style.overflow;
  video.pause();video.controls=false;playButton.hidden=false;renderStory();
  dialog.showModal();document.body.style.overflow='hidden';byId('close-story').focus({preventScroll:true});
}
function closeStory(){if(dialog.open)dialog.close()}
function turn(direction){
  if(!dialog.open||page+direction<0||page+direction>=stories[project].length)return;
  video.pause();page+=direction;renderStory();dialog.scrollTop=0;
}
document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>openStory(button.dataset.open,button)));
document.querySelectorAll('.language-switch').forEach(button=>button.addEventListener('click',()=>setLanguage(language==='en'?'zh':'en')));
byId('close-story').addEventListener('click',closeStory);
prevButton.addEventListener('click',()=>turn(-1));nextButton.addEventListener('click',()=>turn(1));
dialog.addEventListener('close',()=>{video.pause();document.body.style.overflow=previousOverflow;if(trigger?.isConnected)trigger.focus({preventScroll:true})});
dialog.addEventListener('click',event=>{if(event.target===dialog)closeStory()});
dialog.addEventListener('keydown',event=>{if(event.target===video||event.altKey||event.ctrlKey||event.metaKey)return;
  if(event.key==='ArrowRight'){event.preventDefault();turn(1)}else if(event.key==='ArrowLeft'){event.preventDefault();turn(-1)}
});
video.controls=false;
playButton.addEventListener('click',async()=>{errorMessage.hidden=true;try{await video.play()}catch(error){if(error.name!=='AbortError'){video.controls=true;errorMessage.hidden=false}}});
video.addEventListener('play',()=>{video.controls=true;playButton.hidden=true;errorMessage.hidden=true});
video.addEventListener('pause',()=>{if(dialog.open&&!byId('film-wrap').hidden)playButton.hidden=false});
video.addEventListener('ended',()=>{playButton.hidden=false});
video.addEventListener('error',()=>{errorMessage.hidden=false;playButton.hidden=true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause()});
const storyFigure=document.querySelector('.story-figure');
let touchStart=null;
const interactive=target=>Boolean(target.closest('a,button,video,input,textarea,select,[contenteditable="true"]'));
storyFigure.addEventListener('pointerdown',event=>{
 touchStart=null;if(!matchMedia('(max-width:700px),(pointer:coarse)').matches||!event.isPrimary||event.button!==0||interactive(event.target))return;
 touchStart={id:event.pointerId,x:event.clientX,y:event.clientY,t:performance.now()};
},{passive:true});
storyFigure.addEventListener('pointerup',event=>{
 const t=touchStart;touchStart=null;if(!t||t.id!==event.pointerId||interactive(event.target))return;
 if(performance.now()-t.t>500||Math.hypot(event.clientX-t.x,event.clientY-t.y)>9)return;
 if(window.getSelection()&&!window.getSelection().isCollapsed)return;
 const box=storyFigure.getBoundingClientRect();turn(event.clientX<box.left+box.width/2?-1:1);
},{passive:true});
storyFigure.addEventListener('pointercancel',()=>touchStart=null,{passive:true});
dialog.addEventListener('scroll',()=>touchStart=null,{passive:true});
let stored;try{stored=localStorage.getItem('asympta-language')}catch(_){}
setLanguage(stored==='en'?'en':'zh');


/* Printmaking motion: short-lived, intentional assembly of ink and line. */
(function(){
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(reduced.matches||!('IntersectionObserver' in window))return;
  const blocks=[...document.querySelectorAll('[data-reveal]')];
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target)}});
  },{threshold:0.08,rootMargin:'0px 0px -12px 0px'});
  blocks.forEach((el,i)=>{el.style.setProperty('--reveal-delay',Math.min(i%3,2)*105+'ms');observer.observe(el)});
  document.documentElement.classList.add('motion-ready');
  const art=document.querySelector('[data-engraving]');if(art){
    const artObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){art.classList.add('is-printed');artObserver.unobserve(entry.target)}})},{threshold:.18});
    artObserver.observe(art);
  }
  const diagrams=[...document.querySelectorAll('.diagram svg')];
  const inkObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add('is-inked');
    inkObserver.unobserve(entry.target);
  })},{threshold:0.15});
  diagrams.forEach(svg=>{
    svg.querySelectorAll('path:not([stroke-dasharray])').forEach((path,index)=>{
      if(index>=16)return;
      try{
        const length=path.getTotalLength();
        if(!Number.isFinite(length)||length<5)return;
        path.style.setProperty('--stroke-length',String(length));
        path.style.setProperty('--stroke-order',Math.min(index,12));
        path.classList.add('draw-line');
      }catch(_){}
    });
    inkObserver.observe(svg);
  });
  reduced.addEventListener('change',event=>{
    if(!event.matches)return;
    document.documentElement.classList.remove('motion-ready');
    diagrams.forEach(svg=>svg.classList.add('is-inked'));
  });
})();


/* Trace lines over the complete original image; the original illustration never disappears. */
(function(){
 document.querySelectorAll('.work-diagram svg').forEach(svg=>{
  [...svg.querySelectorAll('path.draw-line')].forEach(path=>{
   const length=Number(path.style.getPropertyValue('--stroke-length'));if(!length)return;
   const copy=path.cloneNode(false);
   copy.classList.remove('draw-line');copy.classList.add('printing-trace');
   copy.removeAttribute('id');copy.setAttribute('fill','none');
   copy.style.setProperty('--stroke-length',String(length));
   copy.style.setProperty('--stroke-order',path.style.getPropertyValue('--stroke-order')||'0');
   path.parentNode.appendChild(copy);
  });
 });
})();
