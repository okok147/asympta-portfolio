// Original app screenshots -> archival monochrome reproductions. Originals are never overwritten.
import AppKit
import Foundation
import CryptoKit
let root=URL(fileURLWithPath:CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : FileManager.default.currentDirectoryPath,isDirectory:true)
let out=root.appendingPathComponent("assets/folio",isDirectory:true)
try FileManager.default.createDirectory(at:out,withIntermediateDirectories:true)
let jobs=[("writing-ipad-2.webp","writing-plate.png",960),("writing-ipad-1.webp","writing-paper.png",960),("writing-ipad-3.webp","writing-spaces.png",960),("paperie-ipad-2.webp","paperie-plate.png",1200),("paperie-ipad-1.webp","paperie-cover.png",960)]
func noise(_ x:Int,_ y:Int)->Double {
 var v=UInt32(truncatingIfNeeded:x &* 374761393 &+ y &* 668265263)
 v=(v ^ (v >> 13)) &* 1274126177
 return Double((v ^ (v >> 16)) & 1023)/1023
}
var receipts:[[String:Any]]=[]
for (input,output,width) in jobs {
 let url=root.appendingPathComponent("assets/"+input)
 guard let ns=NSImage(contentsOf:url) else {fatalError("Missing source: "+input)}
 var rect=NSRect(origin:.zero,size:ns.size)
 guard let cg=ns.cgImage(forProposedRect:&rect,context:nil,hints:nil) else {fatalError("Cannot decode "+input)}
 let w=min(width,cg.width),h=Int(Double(w)*Double(cg.height)/Double(cg.width))
 var rgba=[UInt8](repeating:255,count:w*h*4)
 let cs=CGColorSpaceCreateDeviceRGB()
 rgba.withUnsafeMutableBytes {buffer in
   guard let c=CGContext(data:buffer.baseAddress,width:w,height:h,bitsPerComponent:8,bytesPerRow:w*4,space:cs,bitmapInfo:CGImageAlphaInfo.premultipliedLast.rawValue) else {fatalError("RGBA context")}
   c.setFillColor(CGColor(gray:1,alpha:1));c.fill(CGRect(x:0,y:0,width:w,height:h));c.interpolationQuality = .high
   c.draw(cg,in:CGRect(x:0,y:0,width:w,height:h))
 }
 var lum=[Double](repeating:0,count:w*h),hist=[Int](repeating:0,count:256)
 for i in 0..<w*h {
  let j=i*4;let y=(0.2126*Double(rgba[j]) + 0.7152*Double(rgba[j+1]) + 0.0722*Double(rgba[j+2]))/255
  lum[i]=y;hist[min(255,max(0,Int(y*255)))]+=1
 }
 func quantile(_ q:Double)->Double {var sum=0;for i in 0...255{sum+=hist[i];if Double(sum)>=Double(w*h)*q{return Double(i)/255}};return 1}
 let lo=quantile(0.006),hi=max(lo+0.18,quantile(0.997))
 var gray=[UInt8](repeating:255,count:w*h)
 let angle=Double.pi/12,ca=cos(angle),sa=sin(angle),cell=5.2
 for y in 0..<h {for x in 0..<w {
  let i=y*w+x
  let l=min(1,max(0,(lum[i]-lo)/(hi-lo)))
  let tone=pow(l,0.90)
  let n=noise(x,y)
  let u=(Double(x)*ca+Double(y)*sa)/cell
  let v=(-Double(x)*sa+Double(y)*ca)/cell
  let dx=(u-floor(u)-0.5)*cell,dy=(v-floor(v)-0.5)*cell
  let d=sqrt(dx*dx+dy*dy)
  let darkness=min(1,max(0,(1-tone)*0.96))
  var coverage=0.0
  if darkness<0.5 {
    let r=sqrt(darkness/Double.pi)*cell
    coverage=min(1,max(0,(r-d)+0.5))
  }else{
    let r=sqrt((1-darkness)/Double.pi)*cell
    coverage=1-min(1,max(0,(r-d)+0.5))
  }
  // Preserve small type: blend screened tone with a small continuous-tone ink component.
  let mixed=coverage*0.76+darkness*0.24
  let ink=24+16*n
  let paper=254-1.5*n
  gray[i]=UInt8(min(255,max(0,paper*(1-mixed)+ink*mixed)))
 }}
 let rep=NSBitmapImageRep(bitmapDataPlanes:nil,pixelsWide:w,pixelsHigh:h,bitsPerSample:8,samplesPerPixel:1,hasAlpha:false,isPlanar:false,colorSpaceName:.deviceWhite,bytesPerRow:w,bitsPerPixel:8)!
 gray.withUnsafeBytes{bytes in memcpy(rep.bitmapData!,bytes.baseAddress!,w*h)}
 guard let data=rep.representation(using:.png,properties:[:]) else{fatalError("PNG encode")}
 try data.write(to:out.appendingPathComponent(output))
 receipts.append(["source":input,"output":output,"width":w,"height":h,"bytes":data.count,"sha256":SHA256.hash(data:data).map{String(format:"%02x",$0)}.joined()])
}
// Link preview is a typeset cover, not a screenshot of an unrelated older design.
let preview=NSBitmapImageRep(bitmapDataPlanes:nil,pixelsWide:1200,pixelsHigh:630,bitsPerSample:8,samplesPerPixel:4,hasAlpha:true,isPlanar:false,colorSpaceName:.deviceRGB,bytesPerRow:0,bitsPerPixel:0)!
let ctx=NSGraphicsContext(bitmapImageRep:preview)!
NSGraphicsContext.saveGraphicsState();NSGraphicsContext.current=ctx
NSColor(calibratedWhite:0.98,alpha:1).setFill();NSBezierPath(rect:NSRect(x:0,y:0,width:1200,height:630)).fill()
let paragraph=NSMutableParagraphStyle();paragraph.alignment = .center
let title:NSAttributedString=NSAttributedString(string:"ASYMPTA",attributes:[.font:NSFont(name:"Baskerville",size:78) ?? NSFont(name:"Times New Roman",size:78)!, .kern:12, .foregroundColor:NSColor(calibratedWhite:0.14,alpha:1), .paragraphStyle:paragraph])
title.draw(in:NSRect(x:90,y:320,width:1020,height:110))
NSColor(calibratedWhite:0.2,alpha:1).setStroke();let line=NSBezierPath();line.move(to:NSPoint(x:580,y:285));line.line(to:NSPoint(x:620,y:285));line.lineWidth=1;line.stroke()
("KA HO LAU" as NSString).draw(in:NSRect(x:100,y:225,width:1000,height:35),withAttributes:[.font:NSFont(name:"Baskerville",size:18) ?? NSFont.systemFont(ofSize:18),.kern:3,.foregroundColor:NSColor(calibratedWhite:0.18,alpha:1),.paragraphStyle:paragraph])
NSGraphicsContext.restoreGraphicsState()
try preview.representation(using:.png,properties:[:])!.write(to:out.appendingPathComponent("social.png"))
let report=try JSONSerialization.data(withJSONObject:receipts,options:[.prettyPrinted,.sortedKeys]);try report.write(to:out.appendingPathComponent("provenance.json"));print(String(data:report,encoding:.utf8)!)
