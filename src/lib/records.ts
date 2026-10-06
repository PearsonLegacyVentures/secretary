import meetings1 from '../data/meetings1.json';
import meetings2 from '../data/meetings2.json';
import meetings3 from '../data/meetings3.json';
import meetings4 from '../data/meetings4.json';
import type { Meeting, MemberRecord } from '../types';

export const meetings = ([...meetings1,...meetings2,...meetings3,...meetings4] as Meeting[]).sort((a,b)=>a.date.localeCompare(b.date));

const aliases: Record<string,string> = {
  'johnathan albury':'Jonathan Albury',
  'jonathan albury':'Jonathan Albury',
  'jamaal cooper':'Jamaal Cooper',
  'jamal cooper':'Jamaal Cooper',
  'lasalle thompson':'LaSalle Thompson',
  'amhad maycock':'Amhad Maycock',
  'ahmad maycock':'Amhad Maycock',
  'ryan carol':'Ryan Carroll',
  'ryan carrol':'Ryan Carroll',
  'ryan carroll':'Ryan Carroll',
  'dwain wallace':'Dwain Wallace',
  'dwaine wallace':'Dwain Wallace',
  'camron reckley':'Camron Reckley',
  'cameron reckley':'Camron Reckley',
  'cameron reckely':'Camron Reckley',
  'camron reckely':'Camron Reckley',
  'stefan bonimy':'Stefan Bonimy',
  'stephan bonimy':'Stefan Bonimy',
  'philip humes':'Phillip Humes',
  'phillip humes':'Phillip Humes',
  'ujamaa johnson':'Ujammaa Johnson',
  'ujammaa johnson':'Ujammaa Johnson',
  'anthony j. longley':'Anthony Longley',
  'anthony longley':'Anthony Longley',
  'azano p. major':'Azano P. Major',
  'azano major':'Azano P. Major',
  'dwight grant':'Dwight Grant Jr.',
  'dwight grant jr':'Dwight Grant Jr.',
  'edward thurston':'Edward Thurston',
  'eddie thurston':'Edward Thurston',
};

export function cleanPersonName(value: string) {
  const v = value
    .replace(/^(President|VPE|VPM|VPPR|Secretary|Treasurer|SAA|IPP|PP|TM)\s+/i,'')
    .replace(/,\s*(DTM|VC\d|PM\d|MS\d|DL\d|EH\d|PI\d|IP\d)\b.*$/i,'')
    .replace(/\s+/g,' ')
    .trim();
  const key=v.toLowerCase();
  return aliases[key] || v;
}

export const fmtDate = (date: string, short=false) => new Date(`${date}T12:00:00`).toLocaleDateString('en-BS', short
  ? {month:'short',day:'numeric'}
  : {month:'long',day:'numeric',year:'numeric'});

export const money = (value: number) => new Intl.NumberFormat('en-BS',{style:'currency',currency:'BSD',minimumFractionDigits:0,maximumFractionDigits:2}).format(value);

export const totals = {
  meetings: meetings.length,
  members: meetings.reduce((s,m)=>s+m.memberCount,0),
  guests: meetings.reduce((s,m)=>s+m.guestCount,0),
  speeches: meetings.reduce((s,m)=>s+m.speakers.length,0),
  raffle: meetings.reduce((s,m)=>s+m.collections.raffle,0),
  refreshments: meetings.reduce((s,m)=>s+m.collections.refreshments,0),
  fines: meetings.reduce((s,m)=>s+m.collections.fines,0),
};

export const avgMembers = totals.members / meetings.length;
export const avgGuests = totals.guests / meetings.length;

export const financialTrend = meetings.filter(m=>m.financialMembers != null).map(m=>({date:m.date, value:m.financialMembers as number}));

export const memberRecords: MemberRecord[] = (() => {
  const map = new Map<string,MemberRecord>();
  const ensure=(raw:string)=>{
    const name=cleanPersonName(raw);
    if(!name) return null;
    if(!map.has(name)) map.set(name,{name,meetings:[],speeches:[],awards:[],chaired:[],roles:[]});
    return map.get(name)!;
  };
  for (const m of meetings) {
    for (const raw of m.membersPresent) {
      const r=ensure(raw); if(r&&!r.meetings.includes(m.date)) r.meetings.push(m.date);
    }
    for (const s of m.speakers) {
      const r=ensure(s.name); if(r) r.speeches.push(s);
    }
    if(m.chairman){const r=ensure(m.chairman); if(r){r.chaired.push(m.date);r.roles.push({role:'Chairman',date:m.date});}}
    if(m.lexicologist){const r=ensure(m.lexicologist); if(r)r.roles.push({role:'Lexicologist',date:m.date});}
    if(m.tableTopicsMaster){const r=ensure(m.tableTopicsMaster); if(r)r.roles.push({role:'Table Topics Master',date:m.date});}
    if(m.generalEvaluator){const r=ensure(m.generalEvaluator); if(r)r.roles.push({role:'General Evaluator',date:m.date});}
    const awardPairs:[string,string|undefined][]=[['Speaker of the Night',m.awards.speaker],['Evaluator of the Night',m.awards.evaluator],['Table Topics',m.awards.tableTopics]];
    for(const [type,name] of awardPairs){if(name){const r=ensure(name); if(r)r.awards.push({type,date:m.date});}}
  }
  return [...map.values()].sort((a,b)=>b.meetings.length-a.meetings.length || b.awards.length-a.awards.length || a.name.localeCompare(b.name));
})();

export const awardLeaders = (() => {
  const map=new Map<string,{name:string,speaker:number,evaluator:number,tableTopics:number,total:number}>();
  const add=(name:string|undefined,key:'speaker'|'evaluator'|'tableTopics')=>{
    if(!name)return; const clean=cleanPersonName(name);
    const item=map.get(clean)||{name:clean,speaker:0,evaluator:0,tableTopics:0,total:0};
    item[key]++; item.total++; map.set(clean,item);
  };
  meetings.forEach(m=>{add(m.awards.speaker,'speaker');add(m.awards.evaluator,'evaluator');add(m.awards.tableTopics,'tableTopics')});
  return [...map.values()].sort((a,b)=>b.total-a.total||a.name.localeCompare(b.name));
})();

export const openActions = meetings.flatMap(m=>m.actionItems.map(item=>({date:m.date,item,theme:m.theme})));

export const uniqueGuests = (()=>{
  const map=new Map<string,{name:string,visits:number,last:string}>();
  for(const m of meetings){for(const raw of m.guestsPresent){const name=cleanPersonName(raw);if(!name)continue;const old=map.get(name)||{name,visits:0,last:m.date};old.visits++;if(m.date>old.last)old.last=m.date;map.set(name,old)}}
  return [...map.values()].sort((a,b)=>b.visits-a.visits||b.last.localeCompare(a.last));
})();