/** Real WebKit rendering regression for the printed folio.
 * Requires Playwright on Node's module path; optionally set WEBKIT_PATH to an
 * isolated browser launcher. Never uses an existing browser profile.
 * Usage: WEBKIT_PATH=/path/to/launcher node tests/webkit-print-check.mjs .
 */
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const {webkit}=require('playwright');
const root=path.resolve(process.argv[2]||'.');
const output=await fs.mkdtemp(path.join(os.tmpdir(),'asympta-webkit-proof-'));
const verifiedFiles=['index.html','folio.css','folio.js','assets/folio/cotton-stock.webp','assets/folio/security-weave.svg','assets/folio/letterpress-ink.svg','assets/fonts/old-standard-regular.woff2','assets/fonts/fell-english-sc.woff2','assets/fonts/noto-serif-tc-regular.woff2'];
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
async function sourceSnapshot(){return Object.fromEntries(await Promise.all(verifiedFiles.map(async file=>[file,digest(await fs.readFile(path.join(root,file)))])));}
const sourceHashes=await sourceSnapshot();
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.mp4':'video/mp4'};
const server=http.createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file=path.resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));
    if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    const bytes=await fs.readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':bytes.length,'Cache-Control':'no-store'});
    res.end(bytes);
  }catch{res.writeHead(404).end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url=`http://127.0.0.1:${server.address().port}/`;
const checks=[],errors=[],badResponses=[],fontResponses=[],renderEvidence=[],limitations=['This is a Linux WebKit engine check, not macOS Safari or physical iPad validation. Video playback is covered by the separate Chromium suite.'];
let browser,page,browserVersion,failure;
function check(name,pass,details){checks.push({name,pass:Boolean(pass),details});if(!pass)throw Error('FAIL: '+name+' '+JSON.stringify(details));}
async function settle(){
  await page.evaluate(async()=>{
    await document.fonts.ready;
    await Promise.all(document.getAnimations().filter(a=>Number.isFinite(a.effect?.getComputedTiming().endTime)).map(a=>a.finished.catch(()=>{})));
    await new Promise(requestAnimationFrame);
  });
}
async function language(lang){
  if(await page.locator('html').getAttribute('lang')!==lang)await page.locator('.running-head .language').click();
  await page.waitForFunction(expected=>document.documentElement.lang===expected,lang);
}
async function capture(name){await settle();await page.screenshot({path:path.join(output,name+'.png')});}
async function filterRendering(name){
  await settle();
  const title=page.locator('#site-title');
  const filter=await title.evaluate(e=>getComputedStyle(e).filter);
  const enabled=await title.screenshot({path:path.join(output,name+'-filter-on.png')});
  const override=await page.addStyleTag({content:'#site-title{filter:none!important}'});
  const disabled=await title.screenshot({path:path.join(output,name+'-filter-off.png')});
  await override.evaluate(e=>e.remove());
  const restored=await title.screenshot({path:path.join(output,name+'-filter-restored.png')});
  const evidence={name,filter,enabled:digest(enabled),disabled:digest(disabled),restored:digest(restored),changed:!enabled.equals(disabled),stable:enabled.equals(restored)};
  renderEvidence.push(evidence);
  check(name+' filter changes the actual rendered heading and restores deterministically',filter.includes('url(')&&evidence.changed&&evidence.stable,evidence);
}
async function plainType(){return page.evaluate(()=>{
  const type=[...document.querySelectorAll('.print-type,.index-name')].every(e=>{const s=getComputedStyle(e);return s.filter==='none'&&s.backgroundImage==='none'&&s.webkitTextFillColor!=='transparent'&&!/^rgba[(].*,[ ]*0(?:[.]0*)?[)]$/.test(s.webkitTextFillColor)});
  return type&&[document.body,document.querySelector('#viewer')].every(e=>getComputedStyle(e).backgroundImage==='none');
});}
try{
  browser=await webkit.launch({headless:true,...(process.env.WEBKIT_PATH?{executablePath:process.env.WEBKIT_PATH}:{})});
  browserVersion=browser.version();
  page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:2});
  page.on('pageerror',error=>errors.push(String(error)));
  page.on('response',response=>{
    if(response.status()>=400)badResponses.push({url:response.url(),status:response.status()});
    if(response.request().resourceType()==='font')fontResponses.push({url:response.url(),status:response.status(),mimeType:response.headers()['content-type']});
  });
  await page.goto(url,{waitUntil:'networkidle'});
  const fonts=await page.evaluate(async()=>{
    await document.fonts.ready;
    return Promise.all([['Folio Old Standard','ASYMPTA'],['Folio Fell','KA HO LAU'],['Folio Song','目錄聯絡']].map(async([family,text])=>{
      const font='16px "'+family+'"';
      try{const faces=await document.fonts.load(font,text);return {family,loaded:faces.length>0&&faces.every(face=>face.status==='loaded')&&document.fonts.check(font,text)}}
      catch(error){return {family,loaded:false,error:String(error)}}
    }));
  });
  check('All three self-hosted print fonts load in WebKit',fonts.every(font=>font.loaded),fonts);
  check('Font responses use successful WOFF2 MIME',fontResponses.length>=3&&fontResponses.every(r=>r.status<400&&r.mimeType==='font/woff2'),fontResponses);
  check('Live title remains selectable HTML text',await page.locator('#site-title').evaluate(e=>e.tagName==='H1'&&e.textContent==='ASYMPTA'&&getComputedStyle(e).userSelect!=='none'));
  check('Paper stock and engraved underprint are present without a global filter',await page.locator('body').evaluate(e=>{const s=getComputedStyle(e);return s.backgroundImage.includes('cotton-stock.webp')&&s.backgroundImage.includes('security-weave.svg')&&s.filter==='none'}));
  check('Small controls remain unfiltered',await page.evaluate(()=>[...document.querySelectorAll('.running-head,.running-head a,.language,.plate figcaption,.work-links,.email,.contact-note,.index-name')].every(e=>getComputedStyle(e).filter==='none')));
  await capture('01-desktop-zh');
  await filterRendering('desktop');
  for(const lang of ['zh-Hant','en']){
    await language(lang);
    for(const width of [320,390,1440]){
      await page.setViewportSize({width,height:width<600?844:1000});
      const layout=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
      check(`${lang} layout at ${width}px`,layout.scroll<=layout.viewport+1,layout);
    }
  }
  await capture('02-desktop-en');
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await capture('03-mobile-en');
  await language('zh-Hant');
  await capture('04-mobile-zh');
  await filterRendering('mobile');
  await page.emulateMedia({media:'print'});
  check('Print removes text filters and decorative paper',await plainType());
  await page.emulateMedia({media:'screen'});
  let forcedColorsSupported=false;
  try{
    await page.emulateMedia({forcedColors:'active'});
    forcedColorsSupported=await page.evaluate(()=>matchMedia('(forced-colors: active)').matches);
  }catch(error){limitations.push('WebKit cannot emulate forced colors: '+String(error));}
  if(forcedColorsSupported)check('Forced colors remove text filters and decorative paper',await plainType());
  else limitations.push('Forced-colors emulation unavailable in this WebKit build; the Chromium suite checks that fallback.');
  await page.emulateMedia({forcedColors:'none'});
  await page.setViewportSize({width:1280,height:900});
  await page.locator('.plate-link[data-open="writing"]').click();
  await page.waitForFunction(()=>document.querySelector('#viewer').open&&document.querySelector('#viewer-image').naturalWidth>0);
  check('Native image reader opens with close-button focus',await page.evaluate(()=>document.querySelector('#viewer').open&&document.activeElement.matches('[data-close]')));
  await capture('05-writing-reader');
  await page.keyboard.press('ArrowRight');
  check('Keyboard advances the image reader',await page.locator('#viewer-counter').evaluate(e=>e.value.startsWith('02')));
  await page.locator('#viewer .language').click();
  check('Reader and page translate together',await page.evaluate(()=>document.documentElement.lang==='en'&&document.querySelector('[data-close]').textContent==='Close ×'));
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>!document.querySelector('#viewer').open);
  check('Escape restores trigger focus and scrolling',await page.evaluate(()=>document.activeElement.matches('[data-open="writing"]')&&!document.body.classList.contains('has-viewer')));
  await page.locator('.plate-link[data-open="paperie"]').click();
  await page.waitForFunction(()=>document.querySelector('#viewer').open&&document.querySelector('#viewer-image').src.endsWith('paperie-ipad-2.webp')&&document.querySelector('#viewer-image').complete&&document.querySelector('#viewer-image').naturalWidth>0);
  await capture('06-paperie-reader');
  check('Paperie real image decodes',await page.locator('#viewer-image').evaluate(e=>e.complete&&e.naturalWidth>0));
  await page.locator('[data-close]').click();
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.reload({waitUntil:'networkidle'});
  await page.locator('.plate-link[data-open="writing"]').click();
  check('Reduced motion suppresses animated print passes',await page.evaluate(()=>document.getAnimations().length===0));
  check('No WebKit page errors',errors.length===0,errors);
  check('No missing runtime resources',badResponses.length===0,badResponses);
  check('Verified source remained unchanged during rendering',JSON.stringify(sourceHashes)===JSON.stringify(await sourceSnapshot()));
}catch(error){failure=error.stack||String(error);process.exitCode=1}
finally{
  const report={root,output,browser:'Playwright WebKit / isolated profile',browserVersion,deviceScaleFactor:2,sourceHashes,checks,renderEvidence,errors,badResponses,fontResponses,limitations,failure:failure||null,at:new Date().toISOString()};
  await fs.writeFile(path.join(output,'acceptance.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({output,browserVersion,passed:checks.filter(c=>c.pass).length,total:checks.length,failure:failure||null,limitations}));
  await browser?.close();
  server.closeAllConnections();
  await new Promise(resolve=>server.close(resolve));
}
