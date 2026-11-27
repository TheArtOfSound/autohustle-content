// Shared editorial navigation and business department integration.
import {businessResponse,businessPromotion,businessSitemapEntries,businessFeedEntries} from "./business-department.mjs";

const STUDIO="https://autohustle.online";
const CSS=`
:root{--ah-paper:#f5f3ed;--ah-ink:#252b24;--ah-rust:#a75335;--ah-line:#d9d8cd;--ah-muted:#575950;--ah-display:Newsreader,Georgia,serif;--ah-ui:"DM Sans","Segoe UI",system-ui,sans-serif}
body{font-family:var(--ah-ui);color:var(--ah-ink)}
h1,h2,h3{font-family:var(--ah-display)!important;letter-spacing:-.025em}
.ah-ecosystem-brand{display:inline-flex!important;align-items:center;gap:9px;color:var(--ah-ink)!important;text-decoration:none!important;font:800 17px/1.05 var(--ah-ui)!important;letter-spacing:-.7px}
.ah-ecosystem-brand .ah-mark{display:grid!important;place-items:center;width:34px;height:34px;background:var(--ah-rust);color:#fffefb!important;font:700 17px/1 var(--ah-ui)!important;letter-spacing:-1px}
.ah-ecosystem-brand .ah-name{display:block!important;color:var(--ah-ink)!important;font:800 17px/1 var(--ah-ui)!important;letter-spacing:-.7px}
.ah-ecosystem-brand .ah-name b{color:var(--ah-rust)}
.ah-ecosystem-brand .ah-name small{display:block!important;margin-top:4px;color:var(--ah-muted)!important;font:700 9px/1.1 var(--ah-ui)!important;letter-spacing:1.1px}
header .ah-ecosystem-nav{display:flex;gap:20px;align-items:center;flex-wrap:wrap;font:650 13px/1.3 var(--ah-ui)}
header .ah-ecosystem-nav a{display:inline-flex!important;min-height:44px;align-items:center;color:#45473e;text-decoration:none!important;white-space:nowrap}
header .ah-ecosystem-nav a[aria-current=page]{color:#99452e;border-bottom:2px solid var(--ah-rust)}
header .ah-ecosystem-nav a:last-child{padding:0 14px;background:var(--ah-rust);color:#fffefb;border:1px solid var(--ah-rust)}
.ah-library-navigation{background:#efede3;border-bottom:1px solid var(--ah-line);color:#45473e;font:600 12px/1.5 var(--ah-ui)}
.ah-library-navigation>div{max-width:1200px;margin:auto;padding:0 24px;display:flex;gap:20px;align-items:center;flex-wrap:wrap}
.ah-library-navigation strong{font-size:10px;letter-spacing:1.3px;text-transform:uppercase;color:#665f52}
.ah-library-navigation a{min-height:44px;display:inline-flex;align-items:center;color:#45473e;text-decoration:none}
.ah-library-navigation a[aria-current=page]{color:#99452e;text-decoration:underline;text-underline-offset:4px}
.ah-ecosystem-brand:focus-visible,.ah-ecosystem-nav a:focus-visible,.ah-library-navigation a:focus-visible{outline:2px solid var(--ah-rust);outline-offset:3px}
.ah-policy-mast{max-width:1200px;margin:auto;padding:16px 24px;display:flex;justify-content:space-between;align-items:center;gap:16px;border-bottom:1px solid var(--ah-line)}
.prose{font-family:var(--ah-display)!important}.prose p,.prose li{line-height:1.7}
.ah-studio-bridge{box-sizing:border-box;margin:28px 0 36px;padding:25px;border:1px solid #c6c5b6;background:#eae7db;color:var(--ah-ink);display:grid;grid-template-columns:minmax(0,1fr) auto;gap:18px;align-items:center}
.ah-studio-bridge h2{font:500 clamp(27px,3.2vw,39px)/1.1 var(--ah-display)!important;margin:8px 0}
.ah-studio-bridge p{font:400 14px/1.6 var(--ah-ui)!important;color:var(--ah-muted);margin:0;max-width:62ch}
.ah-studio-bridge .ah-bridge-label{font:700 10px/1.3 var(--ah-ui)!important;letter-spacing:1.5px;color:#863b28}
.ah-studio-bridge .ah-bridge-action{display:inline-flex;align-items:center;min-height:44px;padding:10px 15px;background:var(--ah-rust);color:#fffefb!important;font:700 13px/1.4 var(--ah-ui);text-decoration:none!important;max-width:100%;box-sizing:border-box}
.ah-studio-bridge .ah-bridge-action:hover{background:#863b28}
.ah-studio-bridge .ah-bridge-action:focus-visible{outline:3px solid #863b28;outline-offset:4px}
.ah-studio-bridge--reader{margin:30px 0 16px;grid-template-columns:1fr}.ah-studio-bridge--reader .ah-bridge-action{justify-self:start}
@media(max-width:780px){header .ah-ecosystem-nav{gap:12px;flex-wrap:wrap}header .ah-ecosystem-nav a{font-size:12px;min-height:44px}header .ah-ecosystem-nav a:last-child{padding-inline:10px}.ah-library-navigation>div{padding-inline:16px;gap:12px}.ah-library-navigation strong{display:none}.ah-ecosystem-brand .ah-name small{font-size:8px}}
@media(max-width:600px){.ah-studio-bridge{grid-template-columns:1fr;padding:18px;margin:20px 0 26px;gap:12px}.ah-studio-bridge .ah-bridge-action{justify-self:start}}
@media(max-width:480px){header:has(.ah-ecosystem-nav),header .mast-inner:has(.ah-ecosystem-nav),header .wrap:has(.ah-ecosystem-nav){display:flex!important;flex-direction:column;align-items:flex-start!important;gap:8px!important}header .ah-ecosystem-nav{width:100%;justify-content:space-between;gap:4px}header .ah-ecosystem-nav a{font-size:11px}.ah-library-navigation>div{justify-content:flex-start;gap:0 13px}.ah-library-navigation a{font-size:11px;min-height:38px}.ah-policy-mast{padding:12px 16px}}
`;
const FONTS='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap">';
const BRAND='<span class="ah-mark" aria-hidden="true">A↗</span><span class="ah-name">AUTOHUSTLE<b>.</b><small>THE PRACTICAL LIBRARY</small></span>';
const PRIMARY='<a href="'+STUDIO+'/">Home</a><a href="'+STUDIO+'/#/curriculum">Paths</a><a href="/" aria-current="page">Articles</a><a href="'+STUDIO+'/#/curriculum?work=1">Your work</a><a href="'+STUDIO+'/#/start">Start</a>';
const details={
"/how-i-automate-a-two-person-service-business-with-free-tools/":["Turn a repeated task into a workflow.","Practice defining triggers, checking inputs and deciding where a person needs to approve the output.","Explore the automation path","automation"],
"/how-i-handle-cancellations-and-reschedules-without-losing-the-customer/":["Practice a real client workflow.","Learn to identify a business problem, draft a useful offer and check how it would work for a customer.","Explore the service path","service"],
"/how-i-price-a-pet-waste-cleanup-job/":["Practice scoping and pricing a service.","Use the workshop to turn a service idea into a clear offer with explicit assumptions and limits.","Explore the service path","service"]
};
function local(path){const links=[["/","Featured"],["/library/","All guides"],["/#departments","Departments"],["/business/","Business &amp; AI"],["/business/toolkit/","Toolkit"],["/editorial/","Editorial policy"]];return '<div class="ah-library-navigation" role="navigation" aria-label="Article library"><div><strong>Explore articles</strong>'+links.map(([href,label])=>'<a href="'+href+'"'+((href==="/business/"?path.startsWith(href)&&!path.startsWith("/business/toolkit/"):path===href)?' aria-current="page"':'')+'>'+label+'</a>').join("")+'</div></div>'}
const HOME_BRIDGE='<section class="ah-studio-bridge" aria-labelledby="ah-bridge-title"><div><span class="ah-bridge-label">READ / THEN BUILD</span><h2 id="ah-bridge-title">Put your reading to work.</h2><p>Alongside the practical library, the AutoHustle workshop offers four free hands-on learning paths in service work, automation, digital products and software.</p></div><a class="ah-bridge-action" href="'+STUDIO+'/#/curriculum">Explore the workshop ↗</a></section>';
function readerBridge(path){const d=details[path];return d?'<aside class="ah-studio-bridge ah-studio-bridge--reader" aria-labelledby="ah-bridge-title"><div><span class="ah-bridge-label">FROM READING TO PRACTICE</span><h2 id="ah-bridge-title">'+d[0]+'</h2><p>'+d[1]+'</p></div><a class="ah-bridge-action" href="'+STUDIO+'/#/track/'+d[3]+'">'+d[2]+' ↗</a></aside>':""}
function headersFor(r){const h=new Headers(r.headers);for(const k of ["content-length","content-encoding","etag","last-modified"])h.delete(k);h.set("x-autohustle-ecosystem","business-department-v1");return h}
export function integrateEditorial(base){return {...base,async fetch(request,...args){
 const u=new URL(request.url),p=u.pathname;
 const r=businessResponse(request)||await base.fetch(request,...args);
 if(request.method!=="GET"||r.status!==200)return r;
 if(p==="/sitemap.xml"||p==="/feed.xml"){const h=headersFor(r);const original=await r.text();const out=p==="/sitemap.xml"?original.replace("</urlset>",businessSitemapEntries+"</urlset>"):original.replace("</channel>",businessFeedEntries+"</channel>");return new Response(out,{status:r.status,headers:h})}
 if(p==="/release.json"){const v=await r.json();return new Response(JSON.stringify({...v,release:"business-department-v1",businessGuides:4,businessDepartment:"/business/",priorityArticles:(v.priorityArticles||0)+4,prioritySitemapUrls:(v.prioritySitemapUrls||0)+6,toolkit:"/business/toolkit/",downloadableResources:9}),{status:r.status,headers:headersFor(r)})}
 if(!(r.headers.get("content-type")||"").includes("text/html"))return r;
 let firstHeader=true,firstBrand=true,firstNav=true;
 const secondary=local(p),bridge=readerBridge(p);
 return new HTMLRewriter()
 .on("body",{element(e){if(p==="/editorial/")e.prepend('<header class="ah-policy-mast"><a class="brand ah-ecosystem-brand" href="'+STUDIO+'/" aria-label="AutoHustle home">'+BRAND+'</a><nav class="ah-ecosystem-nav" aria-label="Main navigation">'+PRIMARY+'</nav></header>'+secondary,{html:true})}})
 .on("head",{element(e){e.append(FONTS+"<style>"+CSS+"</style>",{html:true})}})
 .on("section.archive-hero",{element(e){if(p==="/library/")e.after(businessPromotion,{html:true})}})
 .on("section.quality-shelf",{element(e){if(p==="/"){e.before(businessPromotion,{html:true});e.after(HOME_BRIDGE,{html:true})}}})
 .on("article#reading",{element(e){if(bridge)e.append(bridge,{html:true})}})
 .on("header",{element(e){if(firstHeader){firstHeader=false;e.after(secondary,{html:true})}}})
 .on("header a.brand",{element(e){if(!firstBrand)return;firstBrand=false;e.setAttribute("href",STUDIO+"/");e.setAttribute("class","brand ah-ecosystem-brand");e.setAttribute("aria-label","AutoHustle home");e.setInnerContent(BRAND,{html:true})}})
 .on('header nav[aria-label="Main navigation"]',{element(e){if(!firstNav)return;firstNav=false;e.setAttribute("class","ah-ecosystem-nav");e.setInnerContent(PRIMARY,{html:true})}})
 .transform(new Response(r.body,{status:r.status,statusText:r.statusText,headers:headersFor(r)}));
}}}
