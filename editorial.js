'use strict';
const supports = { writing: 'https://okok147.github.io/asympta-support/', paperie: 'https://okok147.github.io/asympta-paperie-support/' };
const stores = { writing: 'https://apps.apple.com/app/id6800755232', paperie: 'https://apps.apple.com/app/id6818553101' };
const stories = {
  writing: [
    { image: 'writing-ipad-1.webp', zh: ['想法多一點，紙就大一點。','用 Apple Pencil 手寫、畫圖，或直接打字。自由移動、縮放畫布，讓筆記、草圖與零碎念頭慢慢連起來。','無限畫布 · Apple Pencil · 文字輸入','Writing · 真實 App 畫面：紙張畫布'], en: ['A little more room for every idea.','An open canvas for handwriting, sketches, and typed notes. Pan and zoom to make room, and let your ideas find their connections.','Apple Pencil · Handwriting · Drawing · Text','Writing · Actual app screenshot: paper canvas'] },
    { image: 'writing-ipad-2.webp', zh: ['抬頭，是另一片天空。','在紙張與天空之間，換一個喜歡的書寫環境。慢慢移動、縮放，讓思緒自由展開。','紙張與天空 · 自由移動與縮放','Writing · 真實 App 畫面：天空畫布'], en: ['Look up. There is another sky.','Move between paper and sky, and find a place you like to write. Pan, zoom, and give your thoughts space to wander.','Paper and sky · Pan and zoom','Writing · Actual app screenshot: sky canvas'] },
    { image: 'writing-ipad-3.webp', zh: ['每個念頭，都有自己的位置。','用不同的 Spaces 放下不同的想法。記一段文字，留一張手繪，再帶走一份 PNG。','Spaces 整理 · PNG 匯出','Writing · 真實 App 畫面：Spaces'], en: ['A place for each little idea.','Keep different thoughts in different Spaces. Leave a few words or a sketch, and take a PNG with you.','Spaces · PNG export','Writing · Actual app screenshot: Spaces'] }
  ],
  paperie: [
    { video: true, zh: ['把今天，收進一頁紙。','用手寫或打字記下日常，貼入照片、貼紙與印章。像翻開一本紙手帳，留下自己的生活片段。','手寫與打字 · 照片 · 貼紙與印章','Paperie · 真實操作影片 · 1:30，無聲'], en: ['Keep a little of today.','Write or type a few words, add a photo, and make the page your own with stickers and stamps. A small journal with the warmth of paper.','Actual app recording · 90 seconds · Silent','Paperie · Actual app recording · 1:30, silent'] },
    { image: 'paperie-ipad-2.webp', zh: ['把喜歡的，貼近日常。','手寫、打字、貼紙與印章，像桌上的文具一樣，隨手取用。讓每一頁，都長成自己的樣子。','Apple Pencil · 打字 · 貼紙與印章','Paperie · 真實 App 畫面：跨頁手帳'], en: ['A few favourite things, on a page.','Handwriting, typing, stickers, and stamps — like stationery within reach. Let each page become a little more your own.','Apple Pencil · Typing · Stickers and stamps','Paperie · Actual app screenshot: journal spread'] },
    { image: 'paperie-ipad-1.webp', zh: ['下次翻開，還是你的那一頁。','選一個喜歡的封面，為今天打開一頁。日子可以很普通，留下它的方式可以很有自己的心意。','自選封面 · 日常手帳','Paperie · 真實 App 畫面：手帳封面'], en: ['Something to come back to.','Choose a cover you like, and open a page for today. An ordinary day can still be kept in a way that feels like you.','A choice of covers · Everyday journaling','Paperie · Actual app screenshot: notebook cover'] }
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
const byId = id => document.getElementById(id);
const dialog=byId('story-dialog'),video=byId('paperie-film'),playButton=byId('start-film'),
      errorMessage=byId('video-error'),storyImage=byId('story-image'),
      prevButton=byId('prev-page'),nextButton=byId('next-page');
let language='zh',project='writing',page=0,trigger=null,previousOverflow='';
function label(key){return key==='writing'?'Writing':'Paperie'}
function setLanguage(next){
  language=next;document.documentElement.lang=next==='en'?'en':'zh-Hant';
  document.querySelectorAll('[data-i18n]').forEach(el=>{const value=translations[next][el.dataset.i18n];if(value!==undefined)el.textContent=value});
  document.querySelectorAll('.language-switch').forEach(button=>{button.textContent=next==='en'?'繁中':'EN';button.setAttribute('aria-label',next==='en'?'切換至繁體中文':'Switch to English')});
  document.querySelectorAll('[data-open]').forEach(button=>button.setAttribute('aria-label',next==='en'?'Read about Asympta '+label(button.dataset.open):'閱讀 Asympta '+label(button.dataset.open)+' 作品介紹'));
  playButton.setAttribute('aria-label',next==='en'?'Play real Paperie video':'播放 Paperie 真實操作影片');
  document.querySelector('meta[name="description"]').content=next==='en'?
  'Asympta — independent software by Ka Ho Lau. Open to projects and collaborations.':
  'Asympta — Ka Ho Lau 的獨立數位作品。歡迎專案與合作邀約。';
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
