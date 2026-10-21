'use strict';
const stores = { writing: 'https://apps.apple.com/app/id6800755232', paperie: 'https://apps.apple.com/app/id6818553101' };
const stories = {
  writing: [
    { image: 'writing-ipad-1.webp', zh: ['留住，一閃而過的念頭。','像拿起紙筆一樣，把字、線條和念頭放下。畫布可以一直延伸，不急著替想法畫上邊界。','Apple Pencil · 手寫 · 繪圖 · 文字','Writing · 真實 App 畫面：紙張畫布'], en: ['A little room for a passing thought.','Put down a word, a line, or an idea, as you would with paper and a pen. An open canvas leaves room for the next thought.','Apple Pencil · Handwriting · Drawing · Text','Writing · Actual app screenshot: paper canvas'] },
    { image: 'writing-ipad-2.webp', zh: ['抬頭，是另一片天空。','在紙張與天空之間，換一個喜歡的書寫環境。慢慢移動、縮放，讓思緒自由展開。','紙張與天空 · 自由移動與縮放','Writing · 真實 App 畫面：天空畫布'], en: ['Look up. There is another sky.','Move between paper and sky, and find a place you like to write. Pan, zoom, and give your thoughts space to wander.','Paper and sky · Pan and zoom','Writing · Actual app screenshot: sky canvas'] },
    { image: 'writing-ipad-3.webp', zh: ['每個念頭，都有自己的位置。','用不同的 Spaces 放下不同的想法。記一段文字，留一張手繪，再帶走一份 PNG。','Spaces 整理 · PNG 匯出','Writing · 真實 App 畫面：Spaces'], en: ['A place for each little idea.','Keep different thoughts in different Spaces. Leave a few words or a sketch, and take a PNG with you.','Spaces · PNG export','Writing · Actual app screenshot: Spaces'] }
  ],
  paperie: [
    { video: true, zh: ['今天，值得留下一頁。','一本貼近紙張的小手帳。寫下幾句話，放進照片，也放進那些不想忘記的小事。','真實 App 操作 · 90 秒無聲影片','Paperie · 真實操作影片 · 1:30，無聲'], en: ['Today deserves a little page.','A small journal with the warmth of paper. A few words, a photograph, and the everyday things you would like to keep.','Actual app recording · 90 seconds · Silent','Paperie · Actual app recording · 1:30, silent'] },
    { image: 'paperie-ipad-2.webp', zh: ['把喜歡的，貼近日常。','手寫、打字、貼紙與印章，像桌上的文具一樣，隨手取用。讓每一頁，都長成自己的樣子。','Apple Pencil · 打字 · 貼紙與印章','Paperie · 真實 App 畫面：跨頁手帳'], en: ['A few favourite things, on a page.','Handwriting, typing, stickers, and stamps — like stationery within reach. Let each page become a little more your own.','Apple Pencil · Typing · Stickers and stamps','Paperie · Actual app screenshot: journal spread'] },
    { image: 'paperie-ipad-1.webp', zh: ['下次翻開，還是你的那一頁。','選一個喜歡的封面，為今天打開一頁。日子可以很普通，留下它的方式可以很有自己的心意。','自選封面 · 日常手帳','Paperie · 真實 App 畫面：手帳封面'], en: ['Something to come back to.','Choose a cover you like, and open a page for today. An ordinary day can still be kept in a way that feels like you.','A choice of covers · Everyday journaling','Paperie · Actual app screenshot: notebook cover'] }
  ]
};
const translations = { en: {skip:'Skip to content',pageTitle:'For writing, and for everyday life.',openStory:'Open a little story',deskNote:'Tap a little object for its story. Tap an icon to download.',hello:'A little hello ↗',writingPrivacy:'Writing privacy',paperiePrivacy:'Paperie privacy',closeStory:'Close the book ×',previous:'← Previous',next:'Next →',videoFallback:'Your browser does not support video.',videoError:'The video could not play. Please refresh and try again.'}, zh:{} };
document.querySelectorAll('[data-i18n]').forEach(el => { translations.zh[el.dataset.i18n] = el.textContent; });
const dialog = document.getElementById('story-dialog');
const video = document.getElementById('paperie-film');
const startButton = document.getElementById('start-film');
const errorMessage = document.getElementById('video-error');
const previousButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let language = 'zh', product = 'paperie', pageIndex = 0, origin, originalOverflow = '';
let openingTimer, pageTimer, turnTimer, closeTimer, miniTimer;
const motionStage = document.getElementById("toy-transition");
const motionObject = document.getElementById("transition-object");
let sourceToy;
function productName(key = product) { return key === 'writing' ? 'Writing' : 'Paperie'; }
function downloadLabel(key = product) { return language === 'en' ? `Download Asympta ${productName(key)} on the App Store` : `在 App Store 下載 Asympta ${productName(key)}`; }
function setLanguage(next) {
  language = next;
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-Hant';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = translations[language][el.dataset.i18n]; });
  document.querySelectorAll('.language-button').forEach(button => { button.textContent = language === 'en' ? '繁中' : 'EN'; button.setAttribute('aria-label', language === 'en' ? '切換至繁體中文' : 'Switch to English'); });
  document.querySelector('.identity').setAttribute('aria-label', language === 'en' ? 'Asympta home' : 'Asympta 首頁');
  document.querySelector('.desk').setAttribute('aria-label', language === 'en' ? 'Little stationery and app downloads' : '小文具與 App 下載');
  document.querySelector('.colophon nav').setAttribute('aria-label', language === 'en' ? 'Privacy policies' : '隱私政策');
  document.querySelectorAll('[data-download]').forEach(link => link.setAttribute('aria-label', downloadLabel(link.dataset.download)));
  document.querySelectorAll('.toy[data-open]').forEach(button => button.setAttribute('aria-label', language === 'en' ? `Open the ${productName(button.dataset.open)} story` : `打開 ${productName(button.dataset.open)} 的故事`));
  startButton.setAttribute('aria-label', language === 'en' ? 'Play the Paperie film' : '播放 Paperie 影片');
  video.setAttribute('aria-label', language === 'en' ? 'Actual Paperie app recording, silent' : 'Paperie 真實操作影片，無聲');
  document.querySelector('meta[name=description]').content = language === 'en' ? 'A little stationery desk by Ka Ho Lau. Open the stories of Writing and Paperie, or download the apps directly from the App Store.' : 'Ka Ho Lau 的小小文具桌。點開 Writing 與 Paperie 的故事，或直接到 App Store 下載。';
  try { localStorage.setItem('asympta-language', language); } catch {}
  if (dialog.open) renderPage();
}
function renderPage() {
  const page = stories[product][pageIndex], copy = page[language];
  document.getElementById('story-product').textContent = 'Asympta ' + productName();
  document.getElementById('cover-label').textContent = productName();
  document.getElementById('story-chapter').textContent = String(pageIndex + 1).padStart(2,'0') + ' · ' + productName();
  document.getElementById('story-title').textContent = copy[0];
  document.getElementById('story-body').textContent = copy[1];
  document.getElementById('story-detail').textContent = copy[2];
  document.getElementById('media-caption').textContent = copy[3];
  const image = document.getElementById('story-image');
  document.getElementById('film-wrap').hidden = !page.video;
  image.hidden = Boolean(page.video);
  if (page.image) { image.src = 'assets/' + page.image; image.alt = copy[3]; }
  if (!page.video) video.pause();
  errorMessage.hidden = true;
  const download = document.getElementById('story-download');
  download.href = stores[product]; download.setAttribute('aria-label', downloadLabel());
  document.getElementById('story-icon').src = 'assets/' + product + '-icon.webp';
  document.getElementById('page-counter').textContent = String(pageIndex + 1).padStart(2,'0') + ' / 03';
  document.getElementById('page-counter').setAttribute('aria-label', language === 'en' ? `Page ${pageIndex + 1} of 3` : `第 ${pageIndex + 1} 頁，共 3 頁`);
  previousButton.disabled = pageIndex === 0; nextButton.disabled = pageIndex === 2;
}
function clearTurns() { clearTimeout(openingTimer); clearTimeout(pageTimer); clearTimeout(turnTimer); dialog.classList.remove('turning-next','turning-back'); }
function setMotionGeometry() {
  if (!sourceToy) return;
  const model = sourceToy.querySelector('.mini-book'), rect = model.getBoundingClientRect();
  const width = model.offsetWidth, height = model.offsetHeight;
  const scale = Math.min(1.65, (innerWidth - 42) / (width * 2.1), (innerHeight - 110) / (height * 1.5));
  motionObject.style.setProperty('--book-w', width + 'px');
  motionObject.style.setProperty('--book-h', height + 'px');
  motionObject.style.setProperty('--start-x', (rect.left + rect.width / 2 - innerWidth / 2) + 'px');
  motionObject.style.setProperty('--start-y', (rect.top + rect.height / 2 - innerHeight / 2) + 'px');
  motionObject.style.setProperty('--open-scale', scale);
  motionObject.style.setProperty('--spread-offset', (width * scale * .36) + 'px');
  const clone = motionObject.querySelector('.mini-book');
  if (clone) clone.style.setProperty('--start-pose', getComputedStyle(model).transform);
}
function buildMotionStage(heldOpen = false) {
  motionObject.replaceChildren(sourceToy.querySelector('.mini-book').cloneNode(true));
  setMotionGeometry();
  motionStage.hidden = false;
  motionStage.className = heldOpen ? 'is-held-open' : 'is-unfolding';
}
function hideMotionStage() {
  motionStage.hidden = true; motionStage.className = ''; motionObject.replaceChildren();
}
function revealStory() {
  clearTimeout(miniTimer);
  if (!dialog.open || dialog.dataset.state !== 'mini-opening') return;
  dialog.dataset.state = 'opening';
  motionStage.classList.add('is-arriving');
  document.querySelector('.book-scroll').scrollTop = 0;
  openingTimer = setTimeout(() => {
    if (dialog.dataset.state === 'opening') dialog.dataset.state = 'open';
    hideMotionStage();
  }, reduceMotion.matches ? 0 : 780);
}
function foldToDesk() {
  const backdrop = getComputedStyle(dialog, '::backdrop');
  dialog.style.setProperty('--fold-backdrop', backdrop.backgroundColor);
  dialog.style.setProperty('--fold-blur', backdrop.backdropFilter);
  dialog.dataset.state = 'mini-closing';
  if (motionStage.hidden || !motionObject.firstElementChild) buildMotionStage(true);
  setMotionGeometry();
  const clone = motionObject.querySelector('.mini-book');
  const poses = [
    [motionObject, '--fold-travel', motionObject],
    [clone, '--fold-pose', clone],
    [clone, '--fold-cover', clone.querySelector('.mini-front-cover')],
    [clone, '--fold-leaf-one', clone.querySelector('.leaf-one')],
    [clone, '--fold-leaf-two', clone.querySelector('.leaf-two')]
  ];
  poses.forEach(([target, key, element]) => target.style.setProperty(key, getComputedStyle(element).transform));
  motionStage.className = 'is-folding';
  closeTimer = setTimeout(() => dialog.close(), 1120);
}
function openStory(key, trigger) {
  if (dialog.open) return;
  clearTurns(); clearTimeout(closeTimer); clearTimeout(miniTimer);
  product = key; pageIndex = 0; origin = trigger;
  sourceToy = trigger.closest('.product').querySelector('.toy');
  dialog.dataset.product = product; dialog.dataset.entry = 'mini';
  dialog.dataset.state = reduceMotion.matches ? 'open' : 'mini-opening';
  video.pause(); if (video.readyState > 0) video.currentTime = 0;
  video.controls = false; startButton.hidden = false; renderPage();
  originalOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
  dialog.showModal(); document.querySelector('.book-scroll').scrollTop = 0;
  document.getElementById('close-story').focus({preventScroll:true});
  if (!reduceMotion.matches) {
    buildMotionStage(); sourceToy.classList.add('is-in-motion');
    miniTimer = setTimeout(revealStory, 1560);
  }
}
function closeStory() {
  const state = dialog.dataset.state;
  if (!dialog.open || state === 'closing' || state === 'mini-closing') return;
  clearTurns(); clearTimeout(miniTimer); video.pause();
  if (reduceMotion.matches) { dialog.close(); return; }
  if (state === 'mini-opening') { foldToDesk(); return; }
  hideMotionStage(); dialog.dataset.state = 'closing';
  closeTimer = setTimeout(foldToDesk, 340);
}
function turnPage(direction) {
  if (!dialog.open || !['open','opening'].includes(dialog.dataset.state) || dialog.classList.contains('turning-next') || dialog.classList.contains('turning-back')) return;
  const next = pageIndex + direction;
  if (next < 0 || next > 2) return;
  clearTurns(); hideMotionStage(); dialog.dataset.state = 'open'; video.pause();
  if (reduceMotion.matches) { pageIndex = next; renderPage(); document.querySelector('.book-scroll').scrollTop = 0; return; }
  dialog.classList.add(direction > 0 ? 'turning-next' : 'turning-back');
  pageTimer = setTimeout(() => { pageIndex = next; renderPage(); document.querySelector('.book-scroll').scrollTop = 0; }, 360);
  turnTimer = setTimeout(() => { dialog.classList.remove('turning-next','turning-back'); }, 820);
}
document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => openStory(button.dataset.open, button)));
document.querySelectorAll('.language-button').forEach(button => button.addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en')));
document.getElementById('close-story').addEventListener('click', closeStory);
previousButton.addEventListener('click', () => turnPage(-1)); nextButton.addEventListener('click', () => turnPage(1));
dialog.addEventListener('cancel', event => { event.preventDefault(); closeStory(); });
dialog.addEventListener('close', () => { clearTurns(); clearTimeout(closeTimer); clearTimeout(miniTimer); hideMotionStage(); sourceToy?.classList.remove('is-in-motion'); video.pause(); document.body.style.overflow = originalOverflow; if (origin?.isConnected) origin.focus({preventScroll:true}); });
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (dialog.dataset.state === 'mini-opening' || event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeStory(); } });
dialog.addEventListener('keydown', event => { if (event.target === video || event.altKey || event.ctrlKey || event.metaKey) return; if (event.key === 'ArrowRight') { event.preventDefault(); turnPage(1); } if (event.key === 'ArrowLeft') { event.preventDefault(); turnPage(-1); } });
video.controls = false; startButton.hidden = false;
startButton.addEventListener('click', async () => { errorMessage.hidden = true; try { await video.play(); } catch (error) { if (error.name !== 'AbortError') { video.controls = true; errorMessage.hidden = false; } } });
video.addEventListener('play', () => { video.controls = true; if (document.activeElement === startButton) video.focus({preventScroll:true}); startButton.hidden = true; errorMessage.hidden = true; });
video.addEventListener('pause', () => { startButton.hidden = false; });
video.addEventListener('ended', () => { startButton.hidden = false; });
video.addEventListener('error', () => { errorMessage.hidden = false; startButton.hidden = true; });
document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
let saved; try { saved = localStorage.getItem('asympta-language'); } catch {}
setLanguage(saved === 'en' ? 'en' : 'zh');

addEventListener('resize', () => { if (!motionStage.hidden) setMotionGeometry(); });
reduceMotion.addEventListener('change', () => { if (!reduceMotion.matches || !dialog.open) return; if (dialog.dataset.state === 'mini-opening') revealStory(); else if (['closing','mini-closing'].includes(dialog.dataset.state)) dialog.close(); });
