import {readFile, appendFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {setTimeout as sleep} from 'node:timers/promises';
export async function inspect(target, timeoutMs=10000) {
  const start=Date.now(), base={name:target.name,url:target.url,at:new Date().toISOString(),expected:target.status??200};
  try {
    const url=new URL(target.url);
    if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw Error('Expected HTTP(S) URL without credentials');
    const r=await fetch(url,{signal:AbortSignal.timeout(timeoutMs),redirect:'follow',headers:{'User-Agent':'BotAutoHustle-Sentinel/0.1'}});
    await r.body?.cancel();
    return {...base,status:r.status,ok:r.status===base.expected,latencyMs:Date.now()-start};
  }catch(e){return {...base,ok:false,error:e.message,latencyMs:Date.now()-start};}
}
async function selfTest(){
  const server=createServer((req,res)=>{if(req.url==='/slow')return setTimeout(()=>res.end('slow'),500);if(req.url==='/redirect'){res.writeHead(302,{Location:'/'});return res.end();}res.statusCode=req.url==='/bad'?503:200;res.end('test');});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const b='http://127.0.0.1:'+server.address().port;
  try{
    const cases=[['200 detected',await inspect({name:'good',url:b}),true],['503 rejected',await inspect({name:'bad',url:b+'/bad'}),false],['custom status',await inspect({name:'expected',url:b+'/bad',status:503}),true],['redirect',await inspect({name:'redirect',url:b+'/redirect'}),true],['timeout',await inspect({name:'slow',url:b+'/slow'},100),false],['invalid protocol',await inspect({name:'invalid',url:'file:///test'}),false]];
    for(const [name,result,expected] of cases){if(result.ok!==expected)throw Error('FAIL: '+name);console.log('PASS: '+name);}
  }finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
}
async function main(){
  if(process.argv.includes('--self-test'))return selfTest();
  const config=JSON.parse(await readFile(process.argv[2]||'sentinel.json','utf8'));
  if(!Array.isArray(config.targets)||!config.targets.length||config.targets.length>100)throw Error('Configure 1–100 targets');
  for(const t of config.targets){if(typeof t.name!=='string'||!t.name.trim()||typeof t.url!=='string'||(t.status!==undefined&&(!Number.isInteger(t.status)||t.status<100||t.status>599)))throw Error('Invalid target');}
  const interval=Number(config.intervalSeconds??300),timeout=Number(config.timeoutMs??10000);
  if(!Number.isInteger(interval)||interval<60||!Number.isInteger(timeout)||timeout<100||timeout>60000)throw Error('Interval >=60 seconds; timeout 100–60000 ms');
  let stopping=false;process.on('SIGINT',()=>{stopping=true;});process.on('SIGTERM',()=>{stopping=true;});
  do{
    let failed=false;
    for(const target of config.targets){if(stopping)break;const result=await inspect(target,timeout);const line=JSON.stringify(result);console.log(line);await appendFile(config.logFile||'sentinel.jsonl',line+'\n');failed||=!result.ok;}
    if(process.argv.includes('--once')||stopping){process.exitCode=failed?1:0;break;}
    for(let remaining=interval;remaining>0&&!stopping;remaining--)await sleep(1000);
  }while(!stopping);
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});