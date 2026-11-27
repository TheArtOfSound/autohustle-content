// Independent protected evidence copies, bounded and explicitly removable.
import {open,rename,rm} from 'node:fs/promises';
import {randomUUID,createHash} from 'node:crypto';
export const ARCHIVE_LIMIT=100;
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const stamp=x=>typeof x==='string'&&Number.isFinite(Date.parse(x));
const digest=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
function event(e){return object(e)&&typeof e.eventId==='string'&&e.eventId.length<=80&&typeof e.id==='string'&&typeof e.sourceName==='string'&&stamp(e.at)&&['baseline','changed','error'].includes(e.kind)&&typeof e.read==='boolean'&&(e.note===undefined||typeof e.note==='string'&&e.note.length<=2000)&&(e.bookmark===undefined||typeof e.bookmark==='boolean');}
export function validateRecords(s){
 if(!object(s)||s.schema!==1||!Array.isArray(s.config)||s.config.length>20||!object(s.sources)||!Array.isArray(s.events)||s.events.length>200||!s.events.every(event)||new Set(s.events.map(e=>e.eventId)).size!==s.events.length)throw Error('Invalid Studio records; original file retained');
 for(const [id,v] of Object.entries(s.sources)){if(!s.config.some(c=>c.id===id)||!object(v)||!digest(v.identity)||!Number.isFinite(v.checkedAt)||v.checkedAt<0||(v.digest!==undefined&&(!digest(v.digest)||typeof v.value!=='string'||createHash('sha256').update(v.value).digest('hex')!==v.digest)))throw Error('Invalid source snapshot; original file retained');}
 if(s.delivery!==undefined&&(!Array.isArray(s.delivery)||s.delivery.length>500||!s.delivery.every(d=>object(d)&&typeof d.id==='string'&&['queued','sending','accepted','failed','unknown','skipped'].includes(d.status))))throw Error('Invalid delivery history; original file retained');
 if(s.archive===undefined)s.archive=[];
 if(!Array.isArray(s.archive)||s.archive.length>ARCHIVE_LIMIT||!s.archive.every(e=>event(e)&&stamp(e.archivedAt))||new Set(s.archive.map(e=>e.eventId)).size!==s.archive.length)throw Error('Invalid protected archive; original file retained');
 return s;
}
export function protect(s,id,now=new Date().toISOString()){const e=s.events.find(e=>e.eventId===id);if(!e)throw Error('Retained event not found');const i=s.archive.findIndex(e=>e.eventId===id);if(i<0&&s.archive.length>=ARCHIVE_LIMIT)throw Error('Archive full; export and explicitly remove a copy first');const copy={...structuredClone(e),archivedAt:now};if(i<0)s.archive.unshift(copy);else s.archive[i]=copy;}
export function unprotect(s,id){const i=s.archive.findIndex(e=>e.eventId===id);if(i<0)throw Error('Protected copy not found');s.archive.splice(i,1);}
export async function durableWrite(file,next){const tmp=file+'.'+randomUUID()+'.tmp';try{const f=await open(tmp,'wx',0o600);try{await f.writeFile(JSON.stringify(next),'utf8');await f.sync();}finally{await f.close();}await rename(tmp,file);}finally{await rm(tmp,{force:true});}}
