import { readFile,writeFile,rename,unlink,lstat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createPublicKey,randomUUID } from 'node:crypto';
import { open, editions, keyId } from './sentinel-release.mjs';
const EVAL=5;
export async function createActivation(dir,trustPath,clock=Date.now){
  const path=resolve(dir,'license.v1.json');let trusted=null,record=null,problem='',busy=false;
  async function readBounded(p,max){const stat=await lstat(p);if(!stat.isFile()||stat.size>max)throw Error('Invalid file');return readFile(p,'utf8');}
  if(trustPath){trusted=createPublicKey(await readBounded(trustPath,4096));keyId(trusted);}
  try{record=JSON.parse(await readBounded(path,16000));}catch(e){if(e.code!=='ENOENT')problem='Saved license unreadable';}
  function decode(value){if(!trusted)throw Error('No trusted evaluation public key configured');return open(value,trusted,{kind:'license',now:clock()});}
  function status(count=0){let p=null,reason=problem; if(record){try{p=decode(record);}catch(e){reason=e.message;}}const limit=p?editions[p.edition].endpoints:EVAL;return {mode:p?'licensed':'evaluation',edition:p?.edition||'evaluation',licenseId:p?.licenseId||null,expiresAt:p?.expiresAt||null,limit,configured:count,overLimit:count>limit,canAdd:count<limit,trustConfigured:!!trusted,reason:reason||null};}
  function assertCapacity(count,add){if(add>0&&count+add>status(count).limit)throw Error('Edition endpoint limit reached. Existing monitors remain active.');}
  async function install(value,count){if(busy)throw Error('License operation in progress');busy=true;let tmp;try{const p=decode(value);if(count>editions[p.edition].endpoints)throw Error('Remove excess endpoints before activating this edition.');tmp=path+'.'+randomUUID()+'.tmp';await writeFile(tmp,JSON.stringify(value),{flag:'wx',mode:0o600});await rename(tmp,path);record=value;problem='';return status(count);}finally{if(tmp)await unlink(tmp).catch(()=>{});busy=false;}}
  async function remove(count){if(busy)throw Error('License operation in progress');busy=true;try{await unlink(path).catch(e=>{if(e.code!=='ENOENT')throw e;});record=null;problem='';return status(count);}finally{busy=false;}}
  return {status,assertCapacity,install,remove,get busy(){return busy;}};
}
