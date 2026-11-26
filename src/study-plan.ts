export type LocalStudyPlan={name:string,subject:string,source:string,summary:string,outline:string[],terms:string[],cards:{front:string,back:string}[],questions:string[],method:string};
const STOP=new Set('este esta estos estas para como pero porque cuando donde sobre entre desde hasta tambien puede pueden cada otra otro todos todas dicho sera hace hacer tener mas menos muy todo nada algo que quien cual como cual los las del una uno unos unas por con sin son fue ser tiene y o a el en se al lo su sus mi tu'.split(' '));
const WORD_RE=/[a-záéíóúüñ]{4,}/gi;
function words(s:string){return (s.toLowerCase().match(WORD_RE)||[]).map(w=>w.normalize('NFD').replace(/[\u0300-\u036f]/g,''));}
function keywords(text:string,limit=10){const f=new Map<string,number>();for(const w of words(text))if(!STOP.has(w))f.set(w,(f.get(w)||0)+1);return [...f.entries()].sort((a,b)=>b[1]-a[1]).slice(0,limit).map(x=>x[0]);}
function sentenceSplit(text:string){return (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[text]).map(x=>x.trim()).filter(x=>x.length>40&&x.length<650&&x.split(/\s+/).length>=8);}
export function createLocalStudyPlan(name:string,subject:string,source:string,minutes=30):LocalStudyPlan{
 const clean=source.replace(/\s+/g,' ').trim();if(clean.length<300)throw new Error('El archivo contiene poco texto extraíble. Los PDF escaneados requieren OCR, que no está disponible.');
 const terms=keywords(clean,12),sentences=sentenceSplit(clean),freq=new Map<string,number>();for(const w of words(clean))if(!STOP.has(w))freq.set(w,(freq.get(w)||0)+1);
 const totalWords=Math.max(1,words(clean).length),termSet=new Set(terms),scored=sentences.map((s,i)=>{const unique=new Set(words(s));let score=0;for(const w of unique){if(STOP.has(w))continue;const count=freq.get(w)||0;if(count)score+=1+Math.log((totalWords+1)/(count+1));if(termSet.has(w))score+=1.5;}return {s,i,score:score/Math.sqrt(Math.max(1,unique.size))};}).sort((a,b)=>b.score-a.score).slice(0,6).sort((a,b)=>a.i-b.i);
 const selected=[...sentences.slice(0,2),...scored.slice(0,5).map(x=>x.s)].filter((s,i,a)=>a.findIndex(x=>x===s)===i);const summary=selected.join(' ').slice(0,2500)||clean.slice(0,1200);
 const headings=source.split(/\n/).map(s=>s.trim().replace(/^#+\s*/,'')).filter(s=>s.length>3&&s.length<110&&(/^(cap[ií]tulo|unidad|tema|[0-9]+[.)])/i.test(s)||/^.{2,70}:$/.test(s))).slice(0,12);
 const outline=(headings.length?headings:terms.slice(0,8)).map((t,i)=>`${i+1}. ${t}`);
 const cards:{front:string,back:string}[]=[];
 for(const term of terms){const sentence=sentences.find(s=>words(s).includes(term));if(sentence)cards.push({front:`¿Qué explica el material sobre “${term}”?`,back:sentence});if(cards.length>=10)break;}
 const questions=[...cards.slice(0,5).map(c=>c.front),'Explica la relación entre dos conceptos clave del texto.','Aplica una idea del material a un ejemplo propio.','¿Qué punto necesitas volver a comprobar y qué evidencia lo aclara?'].slice(0,8);
 const topics=(headings.length?headings:terms).slice(0,5);while(topics.length<3)topics.push(['Fundamentos del tema','Relaciones y aplicación','Comprobación final'][topics.length]);
 const n=minutes,recall=Math.max(2,Math.round(n*.15)),learn=Math.max(4,Math.round(n*.4)),practice=Math.max(3,Math.round(n*.3)),review=n-recall-learn-practice;
 const sessionLines=topics.map((topic,i)=>`Sesión ${i+1} (${n} min) — ${topic}: ${recall} min recuperación inicial (escribe sin mirar); ${learn} min lectura dirigida y notas de evidencia; ${practice} min práctica (responde una pregunta y crea un ejemplo); ${review} min explicación sin mirar y corrección. Checkpoint: ${i<cards.length?cards[i].front:'explica el objetivo de esta sesión y da un ejemplo'}`);
 const method=['OBJETIVO: reconstruir los conceptos centrales, explicarlos con tus palabras y aplicarlos.','ANTES: 5 min, revisa el esquema y anota qué sabes y qué quieres descubrir.',...sessionLines,'CIERRE: responde las preguntas sin mirar. Comprueba con el documento, corrige en otro color y registra dudas.','REPASOS: día 1 (10 min), día 3 (15 min), día 7 (15 min) y día 14 (10 min). Si fallas, vuelve a repasar al día siguiente; si recuerdas fácil, amplía el intervalo.','CRITERIO DE DOMINIO: explicar sin apoyo, dar un ejemplo y responder 2 preguntas con precisión.'].join('\n');
 return {name,subject,source:clean,summary,outline,terms,cards,questions,method};
}
