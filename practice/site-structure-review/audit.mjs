import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {parse} from 'parse5';
const out=path.dirname(new URL(import.meta.url).pathname), root=path.resolve(process.argv[2]||'_preview');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const nodes=n=>[n,...(n.childNodes||[]).flatMap(nodes)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const txt=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).map(txt).join(' ').replace(/\s+/g,' ').trim();
const ancestor=(n,tag)=>n?.tagName===tag||n?.parentNode&&ancestor(n.parentNode,tag);
const issues=[],pages=[];
for(const file of walk(root).filter(f=>f.endsWith('.html'))){
 const all=nodes(parse(fs.readFileSync(file,'utf8'))), rel=path.relative(root,file), route=rel==='index.html'?'/':rel.endsWith('/index.html')?'/'+rel.slice(0,-10):'/'+rel;
 const els=t=>all.filter(n=>n.tagName===t), main=els('main')[0], headings=nodes(main||{}).filter(n=>/^h[1-6]$/.test(n.tagName)),ids=all.map(n=>attr(n,'id')).filter(Boolean);
 const breadcrumbs=all.find(n=>n.tagName==='nav'&&/breadcrumb/i.test(attr(n,'aria-label')||''));
 const links=els('a').filter(n=>attr(n,'href')!==undefined).map(n=>({href:attr(n,'href'),text:txt(n),region:ancestor(n,'header')?'header':ancestor(n,'footer')?'footer':ancestor(n,'main')?'main':ancestor(n,'nav')?'breadcrumb':'other',current:attr(n,'aria-current')||null,ariaLabel:attr(n,'aria-label')||null}));
 const page={route,title:txt(els('title')[0]||{}),h1:els('h1').map(txt),headings:headings.map(n=>({level:+n.tagName[1],text:txt(n)})),canonical:els('link').filter(n=>attr(n,'rel')==='canonical').map(n=>attr(n,'href')),breadcrumbs:breadcrumbs?txt(breadcrumbs):'',breadcrumbLinks:breadcrumbs?nodes(breadcrumbs).filter(n=>n.tagName==='a').map(n=>({text:txt(n),href:attr(n,'href')})):[],ids,links,contentHash:crypto.createHash('sha256').update(txt(main||{})).digest('hex'),mainCount:els('main').length,lang:attr(els('html')[0],'lang'),inboundGlobal:[],inboundContextual:[]};
 if(page.h1.length!==1)issues.push({route,type:'h1-count',value:page.h1.length});
 if(page.mainCount!==1)issues.push({route,type:'main-count',value:page.mainCount});
 if(!page.lang)issues.push({route,type:'missing-lang'});
 for(const id of new Set(ids))if(ids.filter(x=>x===id).length>1)issues.push({route,type:'duplicate-id',id});
 for(let i=1;i<headings.length;i++)if(+headings[i].tagName[1]>+headings[i-1].tagName[1]+1)issues.push({route,type:'heading-skip',text:txt(headings[i])});
 for(const n of els('img'))if(attr(n,'alt')===undefined)issues.push({route,type:'missing-alt',src:attr(n,'src')});
 for(const l of links)if(!l.text&&!l.ariaLabel)issues.push({route,type:'empty-link',href:l.href});
 page.navSemantics=all.filter(n=>n.tagName==='nav').map(n=>({label:attr(n,'aria-label')||null,currentLinks:nodes(n).filter(x=>x.tagName==='a'&&attr(x,'aria-current')).map(x=>({href:attr(x,'href'),current:attr(x,'aria-current')}))}));
 page.breadcrumbCurrent=breadcrumbs?nodes(breadcrumbs).filter(n=>attr(n,'aria-current')).map(n=>({tag:n.tagName,text:txt(n),value:attr(n,'aria-current')})):[];
 page.skipLink=links.find(l=>l.href==='#maincontent')||null;
 pages.push(page);
}
const byRoute=new Map(pages.map(p=>[p.route,p])),edges=[];
for(const p of pages)for(const l of p.links){if(!l.href.startsWith('/')&&!l.href.startsWith('#'))continue;const u=new URL(l.href,'https://audit.invalid'+p.route),target=byRoute.get(u.pathname);if(!target){if(!fs.existsSync(path.join(root,decodeURIComponent(u.pathname))))issues.push({route:p.route,type:'missing-target',href:l.href,region:l.region});continue;}edges.push({from:p.route,to:target.route,region:l.region,text:l.text,fragment:u.hash});if(p.route!==target.route)(['header','footer'].includes(l.region)?target.inboundGlobal:target.inboundContextual).push(p.route);if(u.hash&&!target.ids.includes(decodeURIComponent(u.hash.slice(1))))issues.push({route:p.route,type:'missing-anchor',href:l.href,region:l.region});}
for(const p of pages){p.inboundGlobal=[...new Set(p.inboundGlobal)];p.inboundContextual=[...new Set(p.inboundContextual)];p.trueOrphan=p.route!=='/'&&!p.inboundGlobal.length&&!p.inboundContextual.length;p.globalOnly=!!p.inboundGlobal.length&&!p.inboundContextual.length;}
const duplicates=key=>[...new Set(pages.map(p=>JSON.stringify(p[key])))].map(v=>pages.filter(p=>JSON.stringify(p[key])===v).map(p=>p.route)).filter(a=>a.length>1);
const result={generatedAt:new Date().toISOString(),input:root,pageCount:pages.length,edgeCount:edges.length,issues,duplicates:{titles:duplicates('title'),h1:duplicates('h1'),mainContent:duplicates('contentHash')},trueOrphans:pages.filter(p=>p.trueOrphan).map(p=>p.route),globalOnly:pages.filter(p=>p.globalOnly).map(p=>p.route),pages,edges};
fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify(result,null,2)+'\n');
const csv=v=>'"'+String(v??'').replaceAll('"','""')+'"';
fs.writeFileSync(path.join(out,'routes.csv'),[['route','title','h1','breadcrumbs','globalInbound','contextualInbound','trueOrphan','globalOnly'],...pages.map(p=>[p.route,p.title,p.h1.join(';'),p.breadcrumbs,p.inboundGlobal.length,p.inboundContextual.length,p.trueOrphan,p.globalOnly])].map(r=>r.map(csv).join(',')).join('\n')+'\n');
console.log(JSON.stringify({pageCount:pages.length,edgeCount:edges.length,issues,duplicates:result.duplicates,trueOrphans:result.trueOrphans,globalOnly:result.globalOnly},null,2));
