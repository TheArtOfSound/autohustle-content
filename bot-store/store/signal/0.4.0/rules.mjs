// Deterministic relevance rules for the local Signal Desk workspace.
const TYPES=new Set(['any','appears','disappears','crosses-above','crosses-below']);
export function normalizeRule(raw,mode){
  if(raw==null)return {type:'any'};
  if(typeof raw!=='object'||Array.isArray(raw)||!TYPES.has(raw.type))throw Error('Invalid relevance rule');
  if(raw.type==='any')return {type:'any'};
  if(raw.type==='appears'||raw.type==='disappears'){
    if(typeof raw.keyword!=='string'||!raw.keyword.trim()||raw.keyword.trim().length>120)throw Error('Keyword must contain 1–120 characters');
    if(typeof raw.caseSensitive!=='boolean')throw Error('Invalid case preference');
    return {type:raw.type,keyword:raw.keyword.trim(),caseSensitive:raw.caseSensitive};
  }
  if(mode!=='json'||typeof raw.threshold!=='number'||!Number.isFinite(raw.threshold))throw Error('Numeric crossing requires JSON and a finite threshold');
  return {type:raw.type,threshold:raw.threshold};
}
export function numericValue(value){const n=JSON.parse(value);if(typeof n!=='number'||!Number.isFinite(n))throw Error('Selected JSON value must be a finite number');return n;}
export function matchChange(rule,before,after){
  if(rule.type==='any')return {matched:true,reason:'Any content change'};
  if(rule.type==='appears'||rule.type==='disappears'){
    const norm=v=>rule.caseSensitive?v:v.toLowerCase(),k=norm(rule.keyword),a=norm(before).includes(k),b=norm(after).includes(k);
    return {matched:rule.type==='appears'?!a&&b:a&&!b,reason:(rule.type==='appears'?'Keyword appearance: ':'Keyword disappearance: ')+rule.keyword};
  }
  const a=numericValue(before),b=numericValue(after),t=rule.threshold;
  return {matched:rule.type==='crosses-above'?a<=t&&b>t:a>=t&&b<t,reason:(rule.type==='crosses-above'?'Cross above ':'Cross below ')+t,previous:a,current:b};
}
// Complete line comparison for small snapshots only. Bound time and retained size.
export function compareLines(before,after){
  if(before.length+after.length>8192)return {complete:false,reason:'Combined snapshots exceed 8,192 characters'};
  const a=before.split('\n'),b=after.split('\n');
  if(a.length>120||b.length>120)return {complete:false,reason:'Snapshot exceeds 120 lines'};
  const dp=Array.from({length:a.length+1},()=>new Uint16Array(b.length+1));
  for(let i=a.length-1;i>=0;i--)for(let j=b.length-1;j>=0;j--)dp[i][j]=a[i]===b[j]?1+dp[i+1][j+1]:Math.max(dp[i+1][j],dp[i][j+1]);
  let i=0,j=0;const lines=[];
  while(i<a.length||j<b.length){if(i<a.length&&j<b.length&&a[i]===b[j]){lines.push({kind:'same',text:a[i++]});j++;}else if(i<a.length&&(j===b.length||dp[i+1][j]>=dp[i][j+1]))lines.push({kind:'removed',text:a[i++]});else lines.push({kind:'added',text:b[j++]});}
  return {complete:true,lines,added:lines.filter(x=>x.kind==='added').length,removed:lines.filter(x=>x.kind==='removed').length};
}
