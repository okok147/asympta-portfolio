import AppKit
import Foundation
import WebKit
final class LoadProbe:NSObject,WKNavigationDelegate{
 var finished=false
 var problem:String?
 func webView(_ view:WKWebView,didFinish nav:WKNavigation!){finished=true}
 func webView(_ view:WKWebView,didFail nav:WKNavigation!,withError e:Error){problem=e.localizedDescription;finished=true}
}
let root=URL(fileURLWithPath:CommandLine.arguments.count>1 ? CommandLine.arguments[1]:FileManager.default.currentDirectoryPath,isDirectory:true)
let app=NSApplication.shared;app.setActivationPolicy(.prohibited)
let win=NSWindow(contentRect:NSRect(x:-5000,y:-5000,width:1280,height:900),styleMask:.borderless,backing:.buffered,defer:false)
let config=WKWebViewConfiguration();config.websiteDataStore = .nonPersistent()
let view=WKWebView(frame:NSRect(x:0,y:0,width:1280,height:900),configuration:config)
win.contentView=view;win.orderOut(nil)
let probe=LoadProbe();view.navigationDelegate=probe
let deadline=Date().addingTimeInterval(50)
func spin(_ fn:()->Bool){while !fn() && Date()<deadline{RunLoop.current.run(until:Date().addingTimeInterval(0.05))}}
var failures=[String]();var rows=[[String:Any]]()
func evaluate(_ code:String)->Any?{
 var done=false;var result:Any?
 view.evaluateJavaScript(code){value,error in
 if let e=error{failures.append(e.localizedDescription)}else{result=value};done=true
 };spin{done};if !done{failures.append("JavaScript timed out")};return result
}
func check(_ name:String,_ expression:String){
 let value=evaluate(expression);let passed=(value as? Bool)==true
 rows.append(["name":name,"pass":passed]);if !passed{failures.append(name)}
}
view.loadFileURL(root.appendingPathComponent("index.html"),allowingReadAccessTo:root)
spin{probe.finished};if !probe.finished{fatalError("WebKit load timeout")};if let e=probe.problem{fatalError(e)}
check("Chinese initial language","document.documentElement.lang==='zh-Hant'")
check("No marketing hero","!document.querySelector('.hero-description') && !document.body.innerText.includes('書寫。繪畫。記錄。')")
check("No decorative cover illustration","!document.querySelector('.title-page figure,.title-page img')")
check("Title and navigation intact","document.querySelector('#site-title')?.textContent.trim()==='ASYMPTA' && document.querySelector('.cover-index')?.getAttribute('href')==='#contents'")
check("Correct social routes","!!document.querySelector('a[href=\"https://www.threads.com/@oklauuuuu\"]') && !!document.querySelector('a[href=\"https://x.com/oklauuuuu\"]')")
for lang in ["zh-Hant","en"]{
 if (evaluate("document.documentElement.lang") as? String) != lang{_ = evaluate("document.querySelector('.language').click();true")}
 for width in [320,375,390,540,768,1024,1440]{
 view.frame=NSRect(x:0,y:0,width:width,height:900);win.setContentSize(NSSize(width:width,height:900))
 RunLoop.current.run(until:Date().addingTimeInterval(0.06))
 check("\(lang) / \(width)","document.documentElement.scrollWidth<=innerWidth+1")
 }
 check("\(lang) authored labels","[...document.querySelectorAll('[data-i18n]')].every(e=>!!e.textContent.trim()) && [...document.querySelectorAll('[data-i18n-aria]')].every(e=>!!e.getAttribute('aria-label'))")
}
check("Modal open","(document.querySelector('.plate-link').click(),document.querySelector('#viewer').open)")
RunLoop.current.run(until:Date().addingTimeInterval(0.4))
check("Printed image decoded","document.querySelector('#viewer-image').complete && document.querySelector('#viewer-image').naturalWidth>0")
check("Print-only mode","document.querySelectorAll('[data-mode]').length === 0 && !document.querySelector('.reproduction-switch') && document.querySelector('#viewer-image').classList.contains('is-print')")
check("Next sheet","(document.querySelector('[data-next]').click(),document.querySelector('#viewer-counter').value.startsWith('02'))")
check("Live dialog language","(document.querySelector('#viewer .language').click(),document.documentElement.lang==='zh-Hant' && document.querySelector('[data-close]').textContent==='關閉 ×')")
_ = evaluate("document.querySelector('[data-close]').click();true")
RunLoop.current.run(until:Date().addingTimeInterval(0.2))
check("Close restores focus","!document.querySelector('#viewer').open&&document.activeElement.matches('[data-open=writing]')")
check("Paperie true recording","(document.querySelector('.plate-link[data-open=paperie]').click(),document.querySelector('[data-next]').click(),document.querySelector('[data-next]').click(),!document.querySelector('#viewer-video').hidden&&document.querySelector('#viewer-video').paused)")
check("Video pause on close","(document.querySelector('[data-close]').click(),document.querySelector('#viewer-video').paused)")
let result:[String:Any]=["browser":"native WKWebView","checks":rows,"failures":failures,"passed":failures.isEmpty]
let data=try JSONSerialization.data(withJSONObject:result,options:[.prettyPrinted,.sortedKeys]);try data.write(to:URL(fileURLWithPath:"/private/tmp/asympta-folio-webkit-acceptance.json"))
print(String(data:data,encoding:.utf8)!);win.close();if !failures.isEmpty{exit(1)}
