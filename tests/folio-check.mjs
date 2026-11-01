/** Zero-dependency acceptance suite. Only an isolated headless Chrome process is launched. */
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import os from 'node:os';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=path.resolve(process.argv[2]||'.');
const verifiedFiles=['index.html','folio.css','folio.js','assets/folio/paper.svg','assets/folio/letterpress-ink.svg','assets/fonts/old-standard-regular.woff2','assets/fonts/fell-english-sc.woff2','assets/fonts/noto-serif-tc-regular.woff2'];
const sourceHashes=Object.fromEntries(await Promise.all(verifiedFiles.map(async file=>[file,createHash('sha256').update(await fs.readFile(path.join(root,file))).digest('hex')])));
const output=await fs.mkdtemp(path.join(os.tmpdir(),'asympta-folio-proof-'));
const profile=path.join(output,'chrome-profile');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.mp4':'video/mp4','.json':'application/json','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{
 try{
  let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  const bytes=await fs.readFile(file);const type=types[path.extname(file)]||'application/octet-stream';
  const range=/bytes=(\d+)-(\d*)/.exec(req.headers.range||'');
  if(range){const start=Number(range[1]),end=Math.min(bytes.length-1,range[2]?Number(range[2]):bytes.length-1);res.writeHead(206,{'Content-Type':type,'Content-Range':`bytes ${start}-${end}/${bytes.length}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});res.end(bytes.subarray(start,end+1));}
  else{res.writeHead(200,{'Content-Type':type,'Content-Length':bytes.length,'Cache-Control':'no-store'});res.end(bytes);}
 }catch{res.writeHead(404).end('Not found');}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}/`;
const executable=process.env.CHROME_PATH||(process.platform==='darwin'?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':'google-chrome');
// The isolated Linux test container runs as root. Keep Chrome's sandbox elsewhere.
const sandboxArgs=process.platform==='linux'&&process.getuid?.()===0?['--no-sandbox']:[];
const chrome=spawn(executable,['--headless=new',...sandboxArgs,'--remote-debugging-port=0','--user-data-dir='+profile,'--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-gpu','about:blank'],{stdio:['ignore','ignore','pipe']});
let stderr='';
const endpoint=await new Promise((resolve,reject)=>{
 const timer=setTimeout(()=>reject(Error('Chrome launch timed out: '+stderr.slice(-800))),15000);
 chrome.stderr.on('data',b=>{stderr+=b;const m=stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(m){clearTimeout(timer);resolve(m[1]);}});
 chrome.on('error',e=>{clearTimeout(timer);reject(e)});
});
const port=new URL(endpoint).port;
const target=await(await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(base)}`,{method:'PUT'})).json();
const socket=new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject});
let seq=0;const pending=new Map(),errors=[],badResponses=[],fontResponses=[],fontErrors=[],fontRequests=new Map();
socket.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(!p)return;pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}else{
 if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text+' '+(m.params.exceptionDetails.exception?.description||''));
 if(m.method==='Network.responseReceived'&&m.params.response.status>=400)badResponses.push({url:m.params.response.url,status:m.params.response.status});
 if(m.method==='Network.requestWillBeSent'&&(m.params.type==='Font'||/\.woff2(?:[?#]|$)/.test(m.params.request.url)))fontRequests.set(m.params.requestId,m.params.request.url);
 if(m.method==='Network.responseReceived'&&fontRequests.has(m.params.requestId))fontResponses.push({url:m.params.response.url,status:m.params.response.status,mimeType:m.params.response.mimeType});
 if(m.method==='Network.loadingFailed'&&fontRequests.has(m.params.requestId)&&!m.params.canceled)fontErrors.push({url:fontRequests.get(m.params.requestId),error:m.params.errorText});
}};
function send(method,params={}){return new Promise((resolve,reject)=>{const id=++seq;const timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout '+method))},18000);pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params}));})}
async function evaluate(expression){const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true,userGesture:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function until(expression){for(let i=0;i<70;i++){if(await evaluate(expression))return;await delay(70)}throw Error('Condition timed out: '+expression)}
const checks=[];
function check(name,value,details){checks.push({name,pass:Boolean(value),details});if(!value)throw Error('FAIL: '+name+' '+JSON.stringify(details));}
async function dimensions(width,height=900){await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await delay(50)}
async function screenshot(name,full=false){await delay(90);const params={format:'png',captureBeyondViewport:full};if(full){const m=await send('Page.getLayoutMetrics');params.clip={x:0,y:0,width:m.cssContentSize.width,height:m.cssContentSize.height,scale:1}}const r=await send('Page.captureScreenshot',params);await fs.writeFile(path.join(output,name+'.png'),Buffer.from(r.data,'base64'));}
async function language(lang){if(await evaluate('document.documentElement.lang')!==(lang==='zh'?'zh-Hant':'en'))await evaluate("document.querySelector('.language').click()");}
let failure;
try{
 await send('Runtime.enable');await send('Network.enable');await send('Page.enable');
 await dimensions(1440,1000);await send('Page.navigate',{url:base});
 await until("document.readyState==='complete'&&!document.querySelector('.language').hidden");
 await evaluate("document.querySelectorAll('img[loading]').forEach(i=>i.loading='eager')");
 await until("[...document.querySelectorAll('main img')].every(i=>i.complete&&i.naturalWidth>0)");
 check('Title leaf has no decorative illustration',await evaluate("!document.querySelector('.title-page figure,.title-page img')"));
 check('Title and contents navigation retained',await evaluate("document.querySelector('#site-title')?.textContent.trim()==='ASYMPTA'&&document.querySelector('.cover-index')?.getAttribute('href')==='#contents'"));
 check('No unwanted slogan or fixed product introduction',await evaluate("!document.body.innerText.includes('書寫。繪畫。記錄。')&&!document.querySelector('.hero-description')"));
 check('No-JavaScript image fallback preserved',await evaluate("document.querySelector('.plate-link').href.includes('writing-ipad-2.webp')"));
 const loadedFonts=await evaluate(`(async()=>{
  await document.fonts.ready;
  return Promise.all([['Folio Old Standard','ASYMPTA'],['Folio Fell','KA HO LAU'],['Folio Song','目錄聯絡']].map(async([family,text])=>{
   const font='16px "'+family+'"';
   try{const faces=await document.fonts.load(font,text);return {family,loaded:faces.length>0&&faces.every(face=>face.status==='loaded')&&document.fonts.check(font,text)}}
   catch(error){return {family,loaded:false,error:String(error)}}
  }));
 })()`);
 check('Self-hosted Latin, small-cap and Chinese fonts actually load',loadedFonts.every(font=>font.loaded),loadedFonts);
 check('Printed serif faces selected for Latin and Chinese',await evaluate("getComputedStyle(document.querySelector('#site-title')).fontFamily.includes('Folio Old Standard')&&getComputedStyle(document.querySelector('#contact-title')).fontFamily.includes('Folio Song')"));
 check('Pigment texture is clipped inside real selectable lettering',await evaluate("getComputedStyle(document.querySelector('#site-title')).backgroundImage.includes('letterpress-ink.svg')&&getComputedStyle(document.querySelector('.index-name')).backgroundImage.includes('letterpress-ink.svg')&&document.querySelector('#site-title').textContent==='ASYMPTA'"));
 check('Body still has paper stock, not global ink noise',await evaluate("getComputedStyle(document.body).backgroundImage.includes('paper.svg')&&!getComputedStyle(document.querySelector('.running-head a')).backgroundImage.includes('letterpress-ink.svg')"));
 await send('Emulation.setEmulatedMedia',{media:'print'});
 check('Print stylesheet restores solid black glyphs',await evaluate("getComputedStyle(document.querySelector('#site-title')).backgroundImage==='none'&&getComputedStyle(document.querySelector('#site-title')).webkitTextFillColor!=='transparent'"));
 await send('Emulation.setEmulatedMedia',{media:'screen'});
 await send('Emulation.setEmulatedMedia',{features:[{name:'forced-colors',value:'active'}]});
 check('Forced colors retain opaque readable lettering',await evaluate("[...document.querySelectorAll('.print-type,.index-name')].every(element=>{const style=getComputedStyle(element);const fill=style.webkitTextFillColor;return fill!=='transparent'&&!/,[ ]*0(?:[.]0*)?[)]$/.test(fill)&&style.opacity!=='0'&&style.backgroundImage==='none'})"));
 await send('Emulation.setEmulatedMedia',{features:[]});
 check('Thumbnail preserves color',await evaluate("document.querySelector('.plate-link>img').src.endsWith('writing-ipad-2.webp')&&getComputedStyle(document.querySelector('.plate-link>img')).filter.includes('saturate(0.79)')"));
 check('X and exact requested Threads route',await evaluate("!!document.querySelector('a[href=\"https://www.threads.com/@oklauuuuu\"]')&&!!document.querySelector('a[href=\"https://x.com/oklauuuuu\"]')"));
 await language('zh');await delay(2100);await screenshot('01-cover-zh');
 for(const lang of ['zh','en']){
  await language(lang);
  for(const width of [320,375,390,540,768,1024,1440]){
   await dimensions(width,844);
   const size=await evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})');
   check(`${lang} layout ${width}`,size.scroll<=size.width+1,size);
  }
  check(lang+' all authored labels present',await evaluate("[...document.querySelectorAll('[data-i18n]')].every(e=>!!e.textContent.trim())&&[...document.querySelectorAll('[data-i18n-aria]')].every(e=>!!e.getAttribute('aria-label'))"));
 }
 await dimensions(1440,1000);await language('en');await evaluate("scrollTo({top:0,behavior:'instant'})");await screenshot('02-cover-en');
 await screenshot('03-full-en',true);
 await dimensions(390,844);await screenshot('04-mobile-en');
 await language('zh');await screenshot('05-mobile-zh');
 await dimensions(1280,900);
 await evaluate("document.querySelector('.plate-link[data-open=writing]').click()");
 check('Native modal opens with close focus',await evaluate("document.querySelector('#viewer').open&&document.activeElement.matches('[data-close]')"));
 await until("document.querySelector('#viewer-image').complete&&document.querySelector('#viewer-image').naturalWidth>0");
 check('Printed view retains color and grain',await evaluate("document.querySelector('#viewer-image').src.endsWith('writing-ipad-2.webp')&&document.querySelector('#viewer-image').classList.contains('is-print')&&document.querySelector('.viewer-media').classList.contains('is-print-reproduction')&&getComputedStyle(document.querySelector('#viewer-image')).filter.includes('saturate(0.79)')"));
 await screenshot('06-writing-print');
 check('Printed reproduction is the only display mode',await evaluate("!document.querySelector('.reproduction-switch')&&!document.querySelector('[data-mode]')&&document.querySelector('#viewer-image').classList.contains('is-print')"));
 await evaluate("document.querySelector('#viewer .language').click()");
 check('Dialog and page change language together',await evaluate("document.documentElement.lang==='en'&&document.querySelector('[data-close]').textContent==='Close ×'&&document.querySelector('#viewer-caption').textContent.includes('Printed reproduction')"));
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight'});
 check('Keyboard pagination',await evaluate("document.querySelector('#viewer-counter').value.startsWith('02')"));
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape'});
 await until("!document.querySelector('#viewer').open&&document.activeElement.matches('[data-open=writing]')&&!document.body.classList.contains('has-viewer')");
 check('Escape restores focus and scroll',await evaluate("!document.querySelector('#viewer').open&&document.activeElement.matches('[data-open=writing]')&&!document.body.classList.contains('has-viewer')"));
 await evaluate("document.querySelector('.plate-link[data-open=paperie]').click()");await until("document.querySelector('#viewer-image').complete&&document.querySelector('#viewer-image').naturalWidth>0");await screenshot('08-paperie-print');
 await evaluate("document.querySelector('[data-next]').click();document.querySelector('[data-next]').click()");
 check('Video never autoplays',await evaluate("!document.querySelector('#viewer-video').hidden&&document.querySelector('#viewer-video').paused&&!document.querySelector('#viewer-video').autoplay"));
 check('Film retains color and paper overlay',await evaluate("document.querySelector('.viewer-media').classList.contains('is-film-reproduction')&&getComputedStyle(document.querySelector('#viewer-video')).filter.includes('saturate(0.81)')&&getComputedStyle(document.querySelector('.viewer-media'),'::after').opacity==='0.13'"));
 const playback=await evaluate("(async()=>{const v=document.querySelector('#viewer-video');await v.play();await new Promise(r=>setTimeout(r,650));const result={time:v.currentTime,width:v.videoWidth,paused:v.paused};v.pause();return result})()");
 check('Actual video decodes and plays',playback.width>0&&playback.time>0,playback);
 await evaluate("document.querySelector('[data-close]').click()");
 check('Video pauses on close',await evaluate("document.querySelector('#viewer-video').paused"));
 await evaluate("document.querySelector('#contact').scrollIntoView({behavior:'instant',block:'start'})");await screenshot('09-contact-en');
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await send('Page.reload');await until("document.readyState==='complete'&&!document.querySelector('.language').hidden");
 check('Language preference persists',await evaluate("document.documentElement.lang==='en'"));
 await evaluate("document.querySelector('#writing').scrollIntoView({behavior:'instant'});document.querySelector('.plate-link').click()");await delay(100);
 check('Reduced motion removes all animations',await evaluate('document.getAnimations().length===0'));
 await evaluate("document.querySelector('[data-close]').click()");
 await send('Emulation.setScriptExecutionDisabled',{value:true});await send('Page.reload');await delay(600);
 // DOM inspection resumes only after loading without scripts; no page script has run.
 await send('Emulation.setScriptExecutionDisabled',{value:false});
 check('No-JavaScript fallback is complete',await evaluate("document.querySelector('.language').hidden&&document.querySelectorAll('main .plate-link[href]').length===2&&document.querySelector('[data-email]').href.startsWith('mailto:')&&document.querySelectorAll('#contents a[href^=\"#\"]').length===3"));
 check('No runtime exceptions',errors.length===0,errors);
 check('Font requests succeed with the correct MIME type',fontResponses.length>0&&fontResponses.every(response=>response.status<400&&response.mimeType==='font/woff2')&&fontErrors.length===0,{responses:fontResponses,errors:fontErrors});
 check('No missing assets',badResponses.length===0,badResponses);
}catch(e){failure=e.stack||String(e)}finally{
 const report={root,output,sourceHashes,checks,errors,badResponses,fontResponses,fontErrors,failure:failure||null,browser:'Headless Google Chrome / isolated profile',at:new Date().toISOString()};
 await fs.writeFile(path.join(output,'acceptance.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({output,passed:checks.filter(x=>x.pass).length,total:checks.length,failure:failure||null,errors,badResponses}));
 socket.close();chrome.kill('SIGTERM');chrome.unref();server.closeAllConnections();server.close();
 setTimeout(()=>process.exit(failure?1:0),500);
 if(failure)process.exitCode=1;
}
