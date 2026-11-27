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
function local(path){const links=[["/","Featured"],["/library/","All guides"],["/#departments","Departments"],["/business/","Business &amp; AI"],["/business/toolkit/","Toolkit"],["/business/instruments/","Instruments"],["/editorial/","Editorial policy"]];return '<div class="ah-library-navigation" role="navigation" aria-label="Article library"><div><strong>Explore articles</strong>'+links.map(([href,label])=>'<a href="'+href+'"'+((href==="/business/"?path.startsWith(href)&&!path.startsWith("/business/toolkit/")&&!path.startsWith("/business/instruments/"):href==="/business/instruments/"?path.startsWith(href):path===href)?' aria-current="page"':'')+'>'+label+'</a>').join("")+'</div></div>'}
const HOME_BRIDGE='<section class="ah-studio-bridge" aria-labelledby="ah-bridge-title"><div><span class="ah-bridge-label">READ / THEN BUILD</span><h2 id="ah-bridge-title">Put your reading to work.</h2><p>Alongside the practical library, the AutoHustle workshop offers four free hands-on learning paths in service work, automation, digital products and software.</p></div><a class="ah-bridge-action" href="'+STUDIO+'/#/curriculum">Explore the workshop ↗</a></section>';
function readerBridge(path){const d=details[path];return d?'<aside class="ah-studio-bridge ah-studio-bridge--reader" aria-labelledby="ah-bridge-title"><div><span class="ah-bridge-label">FROM READING TO PRACTICE</span><h2 id="ah-bridge-title">'+d[0]+'</h2><p>'+d[1]+'</p></div><a class="ah-bridge-action" href="'+STUDIO+'/#/track/'+d[3]+'">'+d[2]+' ↗</a></aside>':""}

const READER_NOTES={
 "/how-i-price-a-pet-waste-cleanup-job/":{label:"FIELD NOTES / PRICING",title:"From scope to quote",steps:["Inspect the photos","Define the work","Model delivery costs","Quote the defined scope"],track:"service",guide:"find-a-business-problem-worth-solving",instrument:"service-quote-builder",action:"Model a service quote",lesson:1,resource:"client-discovery"},
 "/how-i-handle-cancellations-and-reschedules-without-losing-the-customer/":{label:"FIELD NOTES / CLIENT DELIVERY",title:"Keep the agreement clear",steps:["Receive the change","Check availability","Confirm revised terms","Record the agreement"],track:"service",guide:"find-a-business-problem-worth-solving",instrument:"service-quote-builder",action:"Review delivery economics",lesson:4,resource:"client-discovery"},
 "/how-i-automate-a-two-person-service-business-with-free-tools/":{label:"FIELD NOTES / AUTOMATION",title:"Keep a person in the loop",steps:["Receive the input","Validate details","Prepare a draft","Review before action"],track:"automation",guide:"design-a-reliable-ai-automation-workflow",instrument:"automation-roi",action:"Estimate workflow value",lesson:3,resource:"workflow-test-matrix"}
};
const fieldRoutes={
 "/business/find-a-business-problem-worth-solving/":["service","service-quote-builder","Model a service quote",0],
 "/business/design-a-reliable-ai-automation-workflow/":["automation","automation-roi","Estimate workflow value",3],
 "/business/build-a-digital-product-from-one-repeatable-task/":["digital","digital-product-pricing","Model product pricing",1],
 "/business/test-a-small-ai-assisted-app-before-launch/":["saas","software-release-evaluator","Evaluate release evidence",2]
};
function readingActions(track,instrument,label,lesson){
 return '<aside class="ah-reading-actions" aria-label="Put this reading to work"><span class="ah-reading-kicker">FROM READING TO PRACTICE</span><h2>Make the next decision.</h2><div class="ah-reading-action-grid"><a href="/business/instruments/'+instrument+'/"><span>01 / WORKBENCH</span><strong>'+label+'</strong><small>Change the assumptions and inspect the result. →</small></a><a href="'+STUDIO+'/#/lesson/'+track+'/'+lesson+'"><span>02 / WORKSHOP</span><strong>Try the practical exercise</strong><small>Keep a working artifact in your learning record. ↗</small></a></div><p><a href="/business/toolkit/">Browse free worksheets and templates</a></p></aside>';
}
function notePlate(n){
 const ink=n.track==="automation"?"#284a3b":"#603c2d",paper=n.track==="automation"?"#dce6d7":"#f0e1cf",accent=n.track==="automation"?"#416653":"#a75335";
 return '<figure class="ah-reading-plate" style="--plate-paper:'+paper+';--plate-ink:'+ink+';--plate-accent:'+accent+'"><div class="ah-plate-heading"><span>'+n.label+'</span><strong>'+n.title+'</strong></div><svg aria-hidden="true" viewBox="0 0 360 110" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="344" height="94" fill="none" stroke="'+ink+'" opacity=".25"/><path d="M23 86H337M23 24H337M23 38H337M23 62H337" stroke="'+ink+'" opacity=".12"/><path d="M65 55H295" stroke="'+ink+'" stroke-width="1.5" stroke-dasharray="4 3"/>'+n.steps.map((_,i)=>'<g transform="translate('+(23+i*85)+' 25)"><rect x="0" y="0" width="58" height="58" fill="'+(i===3?accent:"#fbf7ea")+'" stroke="'+ink+'"/><path d="M12 14H45M12 23H45M12 32H36" stroke="'+(i===3?"#fbf7ea":ink)+'" stroke-width="1.5"/><circle cx="42" cy="44" r="7" fill="'+(i===3?"#fbf7ea":paper)+'" stroke="'+ink+'"/><text x="42" y="47" text-anchor="middle" font-size="9" fill="'+ink+'">'+(i+1)+'</text></g>').join("")+'</svg><ol>'+n.steps.map(t=>'<li>'+t+'</li>').join("")+'</ol><figcaption>Illustrative process map for applying the note. It is not independent evidence of completed jobs.</figcaption></figure>';
}
const READING_CSS=`
.ah-reading-kicker,.ah-plate-heading>span,.ah-reading-action-grid a>span{font:700 10px/1.4 var(--ah-ui);letter-spacing:1px;color:#863b28}
.ah-reading-plate{margin:24px 0;background:var(--plate-paper);border:1px solid color-mix(in srgb,var(--plate-ink) 35%,transparent);padding:16px;color:var(--plate-ink);font-family:var(--ah-ui)}
.ah-plate-heading>span{display:block;color:var(--plate-ink)}.ah-plate-heading>strong{display:block;font:500 27px/1.1 var(--ah-display);margin:5px 0 8px}
.ah-reading-plate svg{display:block;width:100%;height:auto;max-height:160px}.ah-reading-plate ol{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));list-style-position:inside;gap:8px;margin:7px 0 12px;padding:0!important}.ah-reading-plate li{font:650 12px/1.4 var(--ah-ui)!important;margin:0!important;overflow-wrap:anywhere}
.ah-reading-plate figcaption{font:400 11px/1.5 var(--ah-ui);border-top:1px solid color-mix(in srgb,var(--plate-ink) 25%,transparent);padding-top:8px}
.ah-reading-actions{margin:26px 0;background:#eee9db;border:1px solid #c6c5b6;border-top:3px solid #a75335;padding:18px;color:#252b24;font-family:var(--ah-ui)}
.ah-reading-actions h2{font:500 30px/1.1 var(--ah-display)!important;margin:7px 0 12px!important}
.ah-reading-action-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ah-reading-action-grid a{display:flex;flex-direction:column;gap:7px;background:#faf7ef;border:1px solid #c6c5b6;color:#252b24!important;text-decoration:none!important;padding:12px;min-height:84px;box-sizing:border-box}.ah-reading-action-grid a strong{font:600 19px/1.2 var(--ah-display);color:#252b24}.ah-reading-action-grid a small{font:400 12px/1.4 var(--ah-ui);color:#565b51}.ah-reading-actions>p{font:400 12px/1.5 var(--ah-ui)!important;margin:10px 0 0!important}.ah-reading-actions a:focus-visible,.ah-reader-return a:focus-visible,.ah-library-jump a:focus-visible{outline:3px solid #a75335;outline-offset:3px}
body.ah-reading-edition .prose{font-size:20px;line-height:1.72;max-width:75ch}body.ah-reading-edition .prose>p,body.ah-reading-edition .prose li{line-height:1.68}body.ah-reading-edition .prose>h2,body.ah-reading-edition .bd-body section>h2{font-size:clamp(26px,3vw,35px);line-height:1.16;border-top:1px solid #d3d2c3;padding-top:20px;margin-top:36px;scroll-margin-top:90px}
body.ah-reading-edition .prose>h2[id]{scroll-margin-top:90px}body.ah-reading-edition .bd-body>section[id]{scroll-margin-top:90px}body.ah-reading-edition .prose a{overflow-wrap:anywhere}body.ah-reading-edition .prose .table-scroll{max-width:100%;overflow-x:auto}body.ah-reading-edition .prose .table-scroll:focus-visible{outline:2px solid #a75335;outline-offset:2px}
body.ah-reading-edition .bd-reader article>svg.bd-art{width:100%;height:auto;max-height:210px;object-fit:contain;background:#eae7db;margin:12px 0 20px}
body.ah-reading-edition .bd-body{font:400 20px/1.67 var(--ah-display)}body.ah-reading-edition .bd-body p{line-height:1.67}body.ah-reading-edition .bd-body .bd-template{white-space:pre-wrap;overflow-wrap:anywhere}
.ah-reader-return{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;border-top:1px solid #c6c5b6;padding:14px 0;margin-top:24px;font:650 12px/1.5 var(--ah-ui)}.ah-reader-return a{display:inline-flex;align-items:center;min-height:44px;color:#354e43}
.ah-library-jump{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:10px 0;border-top:1px solid #c6c5b6;margin:14px 0 0;font:650 12px/1.4 var(--ah-ui)}.ah-library-jump a{display:inline-flex;align-items:center;min-height:44px;color:#354e43}.ah-library-jump a:first-child{background:#354e43;color:#fff!important;text-decoration:none;padding:0 12px}
body.ah-library-edition #library{scroll-margin-top:16px}body.ah-library-edition #library .search{background:#f9f6ee;padding:12px;border:1px solid #c6c5b6}body.ah-library-edition #library input[type=search]{font-size:16px;min-width:0}body.ah-library-edition #library button{min-height:44px}body.ah-library-edition #library .filters{gap:6px}body.ah-library-edition #library .filters button[aria-pressed=true]{background:#354e43;color:#fff;border-color:#354e43}body.ah-library-edition #library .entry{border-radius:0;border-top:2px solid #b6b7a4}body.ah-library-edition #library .entry h3{line-height:1.2}body.ah-library-edition .department-card{border-radius:0;overflow:hidden}body.ah-library-edition .department-card svg{width:100%;height:auto}body.ah-library-edition .quality-grid article{border-radius:0;border-top:2px solid #a75335}
.ah-library-navigation>div{flex-wrap:nowrap!important;overflow-x:auto;scrollbar-width:thin;overscroll-behavior-x:contain}.ah-library-navigation a{flex-shrink:0;white-space:nowrap}.ah-library-navigation strong{flex-shrink:0}
@media(max-width:600px){.ah-library-navigation>div{gap:14px!important;padding-inline:16px!important}.ah-library-navigation a{min-height:44px!important}.ah-reading-edition .ah-ecosystem-nav{justify-content:space-between!important;width:100%;gap:7px!important}.ah-reading-edition header .ah-ecosystem-nav a{font-size:11px!important}.ah-reading-edition .ah-ecosystem-brand{margin:0!important}.ah-reading-edition header:has(.ah-ecosystem-nav),.ah-reading-edition header .mast-inner:has(.ah-ecosystem-nav),.ah-reading-edition header .wrap:has(.ah-ecosystem-nav){align-items:flex-start!important;gap:4px!important}.ah-reading-edition .prose,.ah-reading-edition .bd-body{font-size:18px!important;line-height:1.65}.ah-reading-edition .prose>h2,.ah-reading-edition .bd-body section>h2{font-size:27px;margin-top:27px;padding-top:16px;scroll-margin-top:18px}.ah-reading-edition .bd-body>section[id]{scroll-margin-top:18px}.ah-reading-plate,.ah-reading-actions{padding:12px;margin:20px 0}.ah-reading-plate ol{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.ah-reading-action-grid{grid-template-columns:1fr}.ah-reading-actions h2{font-size:27px!important}.ah-reading-edition .bd-reader article>svg.bd-art{max-height:135px;margin:8px 0 14px}.ah-reader-return{gap:3px}.ah-library-jump{gap:7px}.ah-library-edition #library .search{padding:9px}}
@media print{.ah-reading-actions,.ah-reader-return,.ah-library-navigation,.ah-library-jump{display:none!important}.ah-reading-plate{break-inside:avoid}.ah-reading-edition .prose,.ah-reading-edition .bd-body{font-size:12pt!important;max-width:none}}
`;

function headersFor(r){const h=new Headers(r.headers);for(const k of ["content-length","content-encoding","etag","last-modified"])h.delete(k);h.set("x-autohustle-ecosystem","editorial-reading-v2");return h}
export function integrateEditorial(base){return {...base,async fetch(request,...args){
 const u=new URL(request.url),p=u.pathname;
 const r=businessResponse(request)||await base.fetch(request,...args);
 if(request.method!=="GET"||r.status!==200)return r;
 if(p==="/sitemap.xml"||p==="/feed.xml"){const h=headersFor(r);const original=await r.text();const out=p==="/sitemap.xml"?original.replace("</urlset>",businessSitemapEntries+"</urlset>"):original.replace("</channel>",businessFeedEntries+"</channel>");return new Response(out,{status:r.status,headers:h})}
 if(p==="/release.json"){const v=await r.json();return new Response(JSON.stringify({...v,release:"business-department-v1",businessGuides:4,businessDepartment:"/business/",priorityArticles:(v.priorityArticles||0)+4,prioritySitemapUrls:(v.prioritySitemapUrls||0)+11,instruments:"/business/instruments/",interactiveInstruments:4,toolkit:"/business/toolkit/",downloadableResources:9}),{status:r.status,headers:headersFor(r)})}
 if(!(r.headers.get("content-type")||"").includes("text/html"))return r;
 let firstHeader=true,firstBrand=true,firstNav=true;
 const secondary=local(p),bridge=readerBridge(p),note=READER_NOTES[p],field=fieldRoutes[p],library=p==='/'||p==='/library/'||p.startsWith('/topics/');
 const back='<nav class="ah-reader-return" aria-label="Continue exploring"><a href="#ah-page-top">↑ Back to top</a><a href="/library/#library">Explore the archive →</a></nav>';
 const jump='<nav class="ah-library-jump" aria-label="Quick library navigation"><a href="#library">Find a guide ↓</a><a href="/business/">Business &amp; AI →</a><a href="/editorial/">Editorial standards →</a></nav>';
 return new HTMLRewriter()
 .on("body",{element(e){if(library)e.setAttribute("class",((e.getAttribute("class")||"")+" ah-library-edition").trim());else if(field||note||(!p.startsWith("/business/")&&p!=="/editorial/"))e.setAttribute("class",((e.getAttribute("class")||"")+" ah-reading-edition").trim());e.prepend('<span id="ah-page-top" aria-hidden="true"></span>',{html:true});if(p==="/editorial/")e.prepend('<header class="ah-policy-mast"><a class="brand ah-ecosystem-brand" href="'+STUDIO+'/" aria-label="AutoHustle home">'+BRAND+'</a><nav class="ah-ecosystem-nav" aria-label="Main navigation">'+PRIMARY+'</nav></header>'+secondary,{html:true})}})
 .on("head",{element(e){e.append(FONTS+"<style>"+CSS+READING_CSS+"</style>",{html:true})}})
 .on("section.archive-hero",{element(e){if(p==="/library/"){e.append(jump,{html:true});e.after(businessPromotion,{html:true})}}})
 .on("section.hero",{element(e){if(p==="/")e.after(jump,{html:true})}})
 .on("section.quality-shelf",{element(e){if(p==="/"){e.before(businessPromotion,{html:true});e.after(HOME_BRIDGE,{html:true})}}})
 .on("article#reading",{element(e){if(note){e.append(notePlate(note)+readingActions(note.track,note.instrument,note.action,note.lesson),{html:true});}else if(bridge)e.append(bridge,{html:true});e.append(back,{html:true})}})
 .on(".bd-reader article .bd-body",{element(e){if(field)e.after(readingActions(...field)+back,{html:true})}})
 .on("article#reading .table-scroll",{element(e){e.setAttribute("tabindex","0");e.setAttribute("role","region");e.setAttribute("aria-label","Article table, scroll horizontally if needed")}})
 .on("header",{element(e){if(firstHeader){firstHeader=false;e.after(secondary,{html:true})}}})
 .on("header a.brand",{element(e){if(!firstBrand)return;firstBrand=false;e.setAttribute("href",STUDIO+"/");e.setAttribute("class","brand ah-ecosystem-brand");e.setAttribute("aria-label","AutoHustle home");e.setInnerContent(BRAND,{html:true})}})
 .on('header nav[aria-label="Main navigation"]',{element(e){if(!firstNav)return;firstNav=false;e.setAttribute("class","ah-ecosystem-nav");e.setInnerContent(PRIMARY,{html:true})}})
 .transform(new Response(r.body,{status:r.status,statusText:r.statusText,headers:headersFor(r)}));
}}}
