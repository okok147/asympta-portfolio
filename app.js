'use strict';
const translations = {
  en: {
    skip: 'Skip to content', pageTitle: 'Small apps for writing and everyday life, by Asympta.',
    writingLine: 'Room for your thoughts.', paperieLine: 'A page for your day.', peek: 'A little look inside',
    paperieCaption: 'Paperie · Actual app recording', filmLength: '1:30 · Silent',
    writingCaption: 'Writing · Actual app screenshot', seeMore: 'More screens ↗',
    hello: 'A little hello ↗', writingPrivacy: 'Writing privacy', paperiePrivacy: 'Paperie privacy',
    videoFallback: 'Your browser does not support video.', videoError: 'The video could not play. Please refresh and try again.'
  },
  zh: {}
};
document.querySelectorAll('[data-i18n]').forEach(el => { translations.zh[el.dataset.i18n] = el.textContent; });
const languageButton = document.getElementById('language');
const video = document.getElementById('paperie-film');
const startButton = document.getElementById('start-film');
const errorMessage = document.getElementById('video-error');
const tabs = [...document.querySelectorAll('[role=tab]')];
let language = 'zh';
function setLanguage(next) {
  language = next;
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-Hant';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = translations[language][el.dataset.i18n]; });
  languageButton.textContent = language === 'en' ? '繁中' : 'EN';
  languageButton.setAttribute('aria-label', language === 'en' ? '切換至繁體中文' : 'Switch to English');
  document.querySelector('.identity').setAttribute('aria-label', language === 'en' ? 'Asympta home' : 'Asympta 首頁');
  document.querySelector('.apps').setAttribute('aria-label', language === 'en' ? 'Download the apps' : '下載 App');
  document.querySelector('[role=tablist]').setAttribute('aria-label', language === 'en' ? 'App preview' : 'App 展示');
  document.querySelector('.colophon nav').setAttribute('aria-label', language === 'en' ? 'Privacy policies' : '隱私政策');
  document.querySelectorAll('.store-link').forEach((link, index) => link.setAttribute('aria-label', language === 'en' ? `Download Asympta ${index ? 'Paperie' : 'Writing'} on the App Store` : `在 App Store 下載 Asympta ${index ? 'Paperie' : 'Writing'}`));
  startButton.setAttribute('aria-label', language === 'en' ? 'Play the Paperie film' : '播放 Paperie 影片');
  video.setAttribute('aria-label', language === 'en' ? 'Actual Paperie app recording, silent' : 'Paperie 真實操作影片，無聲');
  document.querySelector('.writing-screen img').alt = language === 'en' ? 'Actual Asympta Writing app screenshot: handwriting on the paper canvas' : 'Asympta Writing 真實 App 畫面：紙張畫布上的「光落在紙上」';
  document.querySelector('meta[name=description]').content = language === 'en' ? 'Two small apps by Ka Ho Lau: Asympta Writing and Asympta Paperie. Download the apps and take a little look inside.' : 'Ka Ho Lau 的兩個小作品：Asympta Writing 與 Asympta Paperie。下載 App，翻開看看真實的書寫日常。';
  try { localStorage.setItem('asympta-language', language); } catch {}
}
languageButton.addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en'));
function selectTab(tab, focus = false) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  if (tab.id !== 'paperie-tab') video.pause();
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
    if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
    if (event.key === 'Home') next = tabs[0];
    if (event.key === 'End') next = tabs[tabs.length - 1];
    if (next) { event.preventDefault(); selectTab(next, true); }
  });
});
video.controls = false;
startButton.hidden = false;
startButton.addEventListener('click', async () => {
  errorMessage.hidden = true;
  try { await video.play(); } catch (error) {
    if (error.name !== 'AbortError') { video.controls = true; errorMessage.hidden = false; }
  }
});
video.addEventListener('play', () => {
  video.controls = true;
  if (document.activeElement === startButton) video.focus({ preventScroll: true });
  startButton.hidden = true;
  errorMessage.hidden = true;
});
video.addEventListener('pause', () => { startButton.hidden = false; });
video.addEventListener('ended', () => { startButton.hidden = false; });
video.addEventListener('error', () => { errorMessage.hidden = false; startButton.hidden = true; });
document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
let saved;
try { saved = localStorage.getItem('asympta-language'); } catch {}
setLanguage(saved === 'en' ? 'en' : 'zh');
