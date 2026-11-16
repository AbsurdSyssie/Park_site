import fs from 'node:fs';
const dir='practice/site-structure-review/',a=JSON.parse(fs.readFileSync(dir+'audit.json'));
const groups={
'/appointments/':['fit-notes','update-your-details','urgent-help'],
'/prescriptions/':['prescription-fees'],
'/services/':['register','test-results','self-referrals','nhs-app','private-services','health-information','carers','homeless-friendly-practice','minor-ailments-scheme','podiatry-referral-options','cervical-screening','contraception','bowel-cancer-screening'],
'/health-information/':['pregnancy','advanced-care-planning','bereavement'],
'/about/':['our-team','research','training','artificial-intelligence','gp-earnings','news','practice-policies'],
'/practice-policies/':['chaperone-policy','confidentiality','data-protection','it-policy','personal-data','summary-care-record','violence-zero-tolerance-policy','privacy-notice'],
'/feedback/':['complaints','patient-participation-group'],
'/contact/':['opening-times']};
const parents=new Map();for(const [parent,slugs]of Object.entries(groups))for(const s of slugs)parents.set('/'+s+'/',parent);
const titles={'/services/':'Services and support','/news/':'Past news and reports','/complaints/':'Make a complaint','/accessibility-statement/':'Accessibility statement','/minor-ailments-scheme/':'Pharmacy services','/training/':'Training at the practice'};
const extra={
'/register/':['/','/appointments/','/homeless-friendly-practice/'], '/test-results/':['/','/appointments/','/nhs-app/'], '/fit-notes/':['/','/services/'], '/update-your-details/':['/contact/','/register/','/nhs-app/'],
'/feedback/':['/about/','/contact/'], '/contact/':['/','/about/','/appointments/'], '/opening-times/':['/','/appointments/'], '/about/':['/','/services/'], '/news/':['/feedback/','/patient-participation-group/'],
'/cookies/':['/privacy-notice/','/accessibility-statement/'], '/accessibility-statement/':['/contact/','/about/'], '/privacy-notice/':['/register/','/personal-data/'], '/find-your-nhs-number/':['/register/','/nhs-app/'],
'/private-services/':['/appointments/'], '/prescription-fees/':['/services/'], '/health-information/':['/'], '/bereavement/':['/services/'], '/advanced-care-planning/':['/services/'], '/pregnancy/':['/services/'],
'/patient-participation-group/':['/about/'], '/training/':['/practice-policies/'], '/artificial-intelligence/':['/appointments/','/privacy-notice/'], '/gp-earnings/':['/practice-policies/']};
parents.set('/find-your-nhs-number/','/register/');
const primary=['/','/appointments/','/register/','/feedback/','/test-results/','/prescriptions/'];
const overflow=['/fit-notes/','/opening-times/','/contact/','/services/','/about/'];
const footer=['/appointments/','/prescriptions/','/test-results/','/urgent-help/','/opening-times/','/contact/','/register/','/our-team/','/about/','/feedback/','/practice-policies/','/complaints/','/privacy-notice/','/accessibility-statement/','/cookies/'];
const matrix=fs.readFileSync('practice/SOURCE-TO-LOCAL-MATRIX.md','utf8').split('\n');
const mapping=a.pages.map(p=>{
 const parent=p.route==='/'?null:parents.get(p.route)||'/';
 const sources=matrix.filter(l=>l.startsWith('|')&&l.includes(p.route)&&p.route!=='/').map(l=>l.match(/https:\/\/[^\s)]+/)?.[0]).filter(Boolean);
 return {route:p.route,currentTitle:p.h1[0],currentParent:p.breadcrumbLinks.at(-1)?.href||null,proposedTitle:titles[p.route]||p.h1[0],proposedParent:parent,navigation:[primary.includes(p.route)?'primary':overflow.includes(p.route)?'Browse More':null,footer.includes(p.route)?'footer':null].filter(Boolean),requiredContextualInbound:[...new Set([...(parent&&parent!=='/'?[parent]:[]),...(extra[p.route]||[]),...(primary.includes(p.route)&&p.route!=='/'?['/']:[])])],action:p.route==='/404.html'?'keep-system-page':'keep-page; change grouping/links where specified',url:'retain',redirect:'none',rationale:p.route==='/404.html'?'Expected unlinked system page; not a navigation orphan.':p.route==='/training/'?'Training describes the organisation; retain policy-index cross-link for source parity.':p.route==='/news/'?'Expose historical documents from About and feedback; remove misleading general-information role.':parent==='/practice-policies/'?'Preserve full policy and original references; list on policy index.':parent==='/'?'Top-level entry or site utility, no forced nesting.':'One canonical semantic parent, plus task-relevant cross-links; keep flat address.',sourceUrls:sources};
});
fs.writeFileSync(dir+'proposed-routes.json',JSON.stringify(mapping,null,2)+'\n');
const csv=v=>'"'+String(Array.isArray(v)?v.join('; '):v??'').replaceAll('"','""')+'"';const keys=Object.keys(mapping[0]);fs.writeFileSync(dir+'proposed-routes.csv',[keys,...mapping.map(r=>keys.map(k=>r[k]))].map(r=>r.map(csv).join(',')).join('\n')+'\n');
const nav=a.pages.find(p=>p.route==='/').links.filter(l=>l.region==='header'&&a.pages.some(p=>p.route===l.href));
const metrics={routes:a.pageCount,links:a.edgeCount,headerLocalLinkOccurrences:nav.length,headerDistinctRoutes:new Set(nav.map(l=>l.href)).size,headerLabelH1Differences:nav.filter(l=>l.text!==a.pages.find(p=>p.route===l.href)?.h1[0]).map(l=>({href:l.href,label:l.text,h1:a.pages.find(p=>p.route===l.href)?.h1[0]})),explicitNonHomeBreadcrumbParents:a.pages.filter(p=>p.breadcrumbLinks.some(l=>l.href!=='/')).map(p=>p.route),homeOnlyContextual:a.pages.filter(p=>p.route!=='/'&&p.inboundContextual.length===1&&p.inboundContextual[0]==='/').map(p=>p.route),globalOnly:a.globalOnly,staticIssues:a.issues.length};fs.writeFileSync(dir+'metrics.json',JSON.stringify(metrics,null,2)+'\n');
console.log(JSON.stringify(metrics,null,2));
