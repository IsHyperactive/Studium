import {retrieveKnowledge} from './knowledge-base.ts';
export type LocalStudyPlan={name:string,subject:string,source:string,summary:string,outline:string[],terms:string[],cards:{front:string,back:string}[],questions:string[],method:string,sessionCount:number,minutesPerSession:number,warnings?:string[]};
type Section={title:string,body:string,parts?:Section[]};
const TOKEN=/[a-záéíóúüñ]{2,}/gi;
const norm=(s:string)=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const STOP=new Set(('este esta estos estas aquel aquella para como pero porque cuando donde sobre entre desde hasta tambien puede pueden cada otra otro todos todas dicho sera hace hacer tener mas menos muy todo nada algo que quien cual la el las los del una uno unos unas por con sin son fue ser tiene y o a en se al lo su sus mi tu es esta de que what with from this that those which their there then also more most have has had into during than about after before while where when who whom whose how why and or as it is are be been being this these those an the utiliza utilizar utilizo utilizan produce producir produced producing convierte convertir convierten participa participan participante contribuye contribuyen sostiene sostener absorbe absorben depende depender permite permiten formar forman formado formas crece crecer mantener mantiene mejoran mejora cambia cambian explica explican describe describen comprenden comprender almacenada almacenado almacenadas almacenados producidos producida disponible disponibles proceso procesos funciones fundamentos etapa etapas importancia aplicaciones introduccion conclusion capitulo unidad leccion seccion apartado').split(/\s+/).map(norm));
STOP.add('documento');STOP.add('informacion');STOP.add('texto');STOP.add('seccion');STOP.add('bloque');STOP.add('contenido');STOP.add('tema');STOP.add('ejemplo');STOP.add('proceso');STOP.add('concepto');STOP.add('idea');STOP.add('parte');STOP.add('forma');STOP.add('manera');STOP.add('actividad');STOP.add('estudio');STOP.add('aprendizaje');STOP.add('dato');STOP.add('datos');STOP.add('resultado');STOP.add('resultados');STOP.add('general');STOP.add('principal');STOP.add('objetivo');STOP.add('importante');STOP.add('fundamental');STOP.add('desarrollo');STOP.add('contexto');STOP.add('sistema');STOP.add('elemento');STOP.add('elementos');STOP.add('varios');STOP.add('aspecto');STOP.add('aspectos');STOP.add('relacion');STOP.add('relaciones');STOP.add('incluye');STOP.add('incluyen');STOP.add('partes');STOP.add('contenidos');
const VERBS=new Set('utiliza utilizan produce producir convierte convierten participa participan contribuye contribuyen sostiene absorbe absorben depende permite permiten formar forman crece crecer mantener mantiene mejora mejoran cambia cambian explica explican describe describen comprende comprender'.split(' ').map(norm));
function words(s:string){return(s.match(TOKEN)||[]).map(norm).filter(w=>w&&!STOP.has(w));}
function sentences(s:string){return(s.replace(/\s+/g,' ').match(/[^.!?…]+(?:[.!?…]+|$)/g)||[]).map(x=>x.trim()).filter(x=>x.length>=32&&x.split(/\s+/).length>=6);}
function isHeading(s:string){s=s.trim();return /^#{1,6}\s+\S/.test(s)||/^(cap[ií]tulo|unidad|tema|lecci[oó]n|secci[oó]n|apartado)\s*(\d+|[ivxlcdm]+)?\s*[:.-]?\s+\S/i.test(s)||/^\d{1,2}[.)]\s+\S/.test(s)||(/^[A-ZÁÉÍÓÚÜÑ0-9][A-ZÁÉÍÓÚÜÑ0-9\s:.-]{4,85}$/.test(s)&&s.split(/\s+/).length<=10)||(/^[A-ZÁÉÍÓÚÜÑ][^.!?;:]{3,72}$/.test(s)&&s.split(/\s+/).length<=9);}
function headingText(s:string){return s.trim().replace(/^#{1,6}\s*/,'').replace(/^\d{1,2}[.)]\s*/,'').trim();}
function wc(s:string){return s.trim().split(/\s+/).filter(Boolean).length;}
function termsFrom(text:string,limit=6){const raw=text.match(TOKEN)||[],clean=raw.map(norm),m=new Map<string,{display:string,n:number}>();for(let i=0;i<clean.length;i++){const a=clean[i];if(!a||STOP.has(a))continue;const v=m.get(a)||{display:raw[i],n:0};v.n++;m.set(a,v);const b=clean[i+1];if(b&&!STOP.has(b)&&!VERBS.has(b)&&a.length>=3&&b.length>=3){const k=a+' '+b,p=m.get(k)||{display:raw[i]+' '+raw[i+1],n:0};p.n++;m.set(k,p);}const mid=clean[i+1],c=clean[i+2];if(mid&&STOP.has(mid)&&c&&!STOP.has(c)&&!VERBS.has(c)&&a.length>=3&&c.length>=3){const k=a+' '+mid+' '+c,p=m.get(k)||{display:raw[i]+' '+raw[i+1]+' '+raw[i+2],n:0};p.n++;m.set(k,p);}}
 return [...m.entries()].map(([k,v])=>({k,...v,score:v.n*(k.includes(' ')?1.35:1)})).filter(x=>!STOP.has(x.k)&&x.k.split(' ').every(t=>t.length>=3&&!VERBS.has(t))&&(!x.k.includes(' ')||x.n>=2)).sort((a,b)=>b.score-a.score||b.k.length-a.k.length).slice(0,limit).map(x=>x.display).filter((x,i,a)=>a.findIndex(y=>norm(y)===norm(x))===i);}
function makeTitle(body:string,i:number){const t=extractTerms([{title:'',body}],3);return t.length?'Bloque '+(i+1)+' · '+t.slice(0,2).join(' / '):'Bloque '+(i+1);}
function chunk(title:string,body:string,target=430):Section[]{const ss=sentences(body);if(ss.length<4)return[{title,body:ss.join(' ').trim()||body.trim()}];const out:string[]=[];let cur:string[]=[],n=0;for(const s of ss){const w=wc(s);if(cur.length>=2&&n+w>target){out.push(cur.join(' '));cur=[];n=0;}cur.push(s);n+=w;}if(cur.length)out.push(cur.join(' '));return out.map((b,i)=>({title:out.length===1?title:title+' · parte '+(i+1),body:b}));}
function parseSections(raw:string):Section[]{const parsed:Section[]=[];let title='',buf:string[]=[];const flush=()=>{const body=buf.join(' ').replace(/\s+/g,' ').trim();if(body.length>=65)parsed.push({title:title||'Sección '+(parsed.length+1),body});buf=[];};for(const line of raw.split(/\r?\n/)){const l=line.trim();if(!l)continue;if(isHeading(l)){flush();title=headingText(l);}else buf.push(l.replace(/^[-*•]\s*/,''));}flush();if(parsed.length>=2)return parsed.flatMap(s=>chunk(s.title,s.body,340));if(parsed.length===1){const c=chunk(parsed[0].title,parsed[0].body,340);if(c.length>=2)return c;return parsed;}const paragraphs=raw.split(/\n\s*\n|\r\n\s*\r\n/).map(p=>p.replace(/\s+/g,' ').trim()).filter(p=>p.length>=70),source=paragraphs.length?paragraphs:sentences(raw),out:string[]=[];let cur='',n=0;for(const p of source){const w=wc(p);if(cur&&n+w>340){out.push(cur.trim());cur='';n=0;}cur+=' '+p;n+=w;}if(cur.trim())out.push(cur.trim());return out.length?out.map((b,i)=>({title:makeTitle(b,i),body:b})): [{title:'Material completo',body:raw.replace(/\s+/g,' ').trim()}];}
function extractTerms(sections:Section[],limit=12){
 const m=new Map<string,{display:string,n:number,df:number,heading:number}>();
 sections.forEach(s=>{
  const titleRaw=s.title.match(TOKEN)||[],titleClean=titleRaw.map(norm),titleTerms=new Set(titleClean.filter(t=>t&&!STOP.has(t)));
  const raw=(s.title+' '+s.body).match(TOKEN)||[],clean=raw.map(norm),seen=new Set<string>();
  for(let j=0;j<clean.length;j++){
   const a=clean[j];if(!a||STOP.has(a)||a.length<3)continue;
   const keys=[a],b=clean[j+1],mid=clean[j+1],c=clean[j+2];
   if(b&&!STOP.has(b)&&!VERBS.has(b)&&a.length>=3&&b.length>=3)keys.push(a+' '+b);
   if(mid&&STOP.has(mid)&&c&&!STOP.has(c)&&!VERBS.has(c)&&a.length>=3&&c.length>=3)keys.push(a+' '+mid+' '+c);
   for(const k of keys){
    const display=k.includes(' ')?k.split(' ').length===3?raw[j]+' '+raw[j+1]+' '+raw[j+2]:raw[j]+' '+raw[j+1]:raw[j];
    const v=m.get(k)||{display,n:0,df:0,heading:0};v.n++;
    if(!seen.has(k)){v.df++;seen.add(k);}
    if(k.split(' ').some(t=>titleTerms.has(t)))v.heading++;
    if(display.length>v.display.length)v.display=display;m.set(k,v);
   }
  }
 });
 const total=Math.max(1,sections.length);
 const ranked=[...m.entries()].map(([k,v])=>({k,...v,score:v.n*(1+Math.log(1+total/v.df))*(k.includes(' ')?1.55:1)*(1+v.heading*.7)}))
  .filter(x=>!STOP.has(x.k)&&x.k.split(' ').every(t=>t.length>=3&&!VERBS.has(t))&&(!x.k.includes(' ')||x.n>=2||x.heading>0)&&(x.k.split(' ').length>1||x.n>=2||x.heading>0))
  .sort((a,b)=>b.score-a.score||b.k.length-a.k.length);
 const selected:string[]=[];
 for(const item of ranked){
  const k=norm(item.display);
  if(selected.some(t=>norm(t)===k))continue;
  if(k.split(' ').length===1&&selected.some(t=>norm(t).split(' ').includes(k)))continue;
  selected.push(item.display);
  if(selected.length>=limit)break;
 }
 return selected;
}
function scoreSentences(ss:string[],terms:string[]){const termSet=new Set(terms.flatMap(t=>norm(t).split(' '))),freq=new Map<string,number>();for(const s of ss)for(const t of words(s))freq.set(t,(freq.get(t)||0)+1);const total=Math.max(1,[...freq.values()].reduce((a,b)=>a+b,0));return ss.map((sentence,i)=>{const t=words(sentence),u=new Set(t);let score=0;for(const w of u)score+=(1+Math.log(total/(freq.get(w)||1)))*(termSet.has(w)?1.5:1);return{sentence,index:i,tokens:u,score:score/Math.sqrt(Math.max(1,u.size))+t.filter(w=>termSet.has(w)).length*.35+(i<2?.08:0)};});}
function similarity(a:Set<string>,b:Set<string>){const i=[...a].filter(x=>b.has(x)).length,u=new Set([...a,...b]).size;return u?i/u:0;}
function distinct(ss:string[],terms:string[],n:number){const unique=ss.filter((s,i,a)=>a.findIndex(x=>norm(x)===norm(s))===i),rank=scoreSentences(unique,terms),chosen:typeof rank=[];while(chosen.length<n&&rank.length){let best=0,value=-Infinity;rank.forEach((x,i)=>{const r=chosen.reduce((m,y)=>Math.max(m,similarity(x.tokens,y.tokens)),0),v=x.score-r*1.25;if(v>value){value=v;best=i;}});chosen.push(rank.splice(best,1)[0]);}return chosen.sort((a,b)=>a.index-b.index).map(x=>x.sentence);}
function adjust(input:Section[],count:number){let a=[...input];while(a.length<count){const i=a.reduce((best,x,j)=>wc(x.body)>wc(a[best].body)?j:best,0),s=a[i],ss=sentences(s.body);if(ss.length<3)break;const mid=Math.ceil(ss.length/2),l=ss.slice(0,mid).join(' '),r=ss.slice(mid).join(' '),generic=/^(sección|material completo|bloque)\b/i.test(s.title);a.splice(i,1,{title:generic?makeTitle(l,i):s.title+' · parte A',body:l},{title:generic?makeTitle(r,i+1):s.title+' · parte B',body:r});}while(a.length>count){let i=0,min=Infinity;for(let j=0;j<a.length-1;j++){const w=wc(a[j].body)+wc(a[j+1].body);if(w<min){min=w;i=j;}}const x=a[i],y=a[i+1];a.splice(i,2,{title:x.title+' + '+y.title,body:x.body+' '+y.body,parts:[...(x.parts||[x]),...(y.parts||[y])]});}return a;}
function minuteSplit(n:number){const m=[.15,.25,.3,.2,.1].map(x=>Math.max(1,Math.round(n*x)));let d=n-m.reduce((a,b)=>a+b,0);m[1]+=d;if(m[1]<1){d=1-m[1];m[1]=1;m[0]=Math.max(1,m[0]-d);}return m;}
const stages=[
 {name:'Explorar y organizar',activity:'Haz un mapa con la idea central y 3–5 subideas del bloque. Distingue lo que el texto afirma de tus propias inferencias.'},
 {name:'Comprender y explicar',activity:'Cierra el archivo y explica los conceptos con palabras sencillas. Reabre solo para corregir definiciones; añade un ejemplo propio y marca si es una inferencia.'},
 {name:'Reconstruir relaciones',activity:'Dibuja el proceso, causa–efecto o relación que describe el texto. Si no hay una secuencia explícita, organiza las ideas por relación y señala qué vínculo propone el documento.'},
 {name:'Aplicar y contrastar',activity:'Resuelve un caso hipotético nuevo con los conceptos del bloque. Compara dos ideas solo cuando el texto permita hacerlo; justifica cada conclusión con evidencia.'},
 {name:'Recuperar y evaluar',activity:'Haz una prueba sin consultar: definición, idea central, relación, aplicación y evidencia. Corrige cada respuesta y vuelve a explicar los errores sin mirar.'}
];
function stageIndex(i:number,n:number){const seq:Record<number,number[]>={2:[0,3],3:[0,2,4],4:[0,1,3,4],5:[0,1,2,3,4]};return n<=5?(seq[n]||seq[5])[i]??4:[0,1,2,3,4][i%5];}
export function createLocalStudyPlan(name:string,subject:string,source:string,minutes=30):LocalStudyPlan{
 const raw=source.trim();
 if(raw.length<300)throw new Error('El archivo contiene poco texto extraíble. Los PDF escaneados requieren OCR, que no está disponible.');
 const sections=parseSections(raw),all=sections.flatMap(s=>sentences(s.body));
 if(all.length<3)throw new Error('No se pudo separar el contenido en ideas legibles. Comprueba que el documento tenga texto y no sea una imagen escaneada.');
 const terms=extractTerms(sections,24),rawWords=wc(raw),duration=Math.max(20,Math.min(60,Math.round(minutes||30)));
 const desired=Math.min(24,Math.max(2,Math.ceil(rawWords/350),Math.min(sections.length,24))),topics=adjust(sections,desired),sessionCount=topics.length;
 const sumParts=sections.map(s=>{const sentence=distinct(sentences(s.body),extractTerms([s],5),1)[0];return sentence?s.title+': '+sentence:''}).filter(Boolean);
 const summary=[...sumParts,...distinct(all,terms,4)].filter((s,i,a)=>a.findIndex(x=>norm(x)===norm(s))===i).slice(0,8).join(' ').slice(0,2200);
 const outline=topics.map(s=>s.title).filter((x,i,a)=>a.findIndex(y=>norm(y)===norm(x))===i).slice(0,24);
 const cards:{front:string,back:string}[]=[];
 for(const term of terms){
  const k=norm(term).split(' '),s=all.find(x=>k.every(t=>words(x).includes(t)))||all.find(x=>k.some(t=>words(x).includes(t)));
  if(s&&!cards.some(c=>c.back===s))cards.push({front:'Explica «'+term+'» con tus palabras y cita una frase que lo respalde.',back:s});
  if(cards.length>=24)break;
 }
 const questionGroups:string[][]=[];
 for(const topic of topics){
  const focus=extractTerms([topic],4),evidence=distinct(sentences(topic.body),focus,1)[0],group:string[]=[];
  if(focus[0])group.push('Define «'+focus[0]+'» con tus palabras. Después verifica tu explicación en el fragmento del bloque.');
  if(focus.length>=2)group.push('¿Cómo se relacionan «'+focus[0]+'» y «'+focus[1]+'» según el archivo? Si no hay relación explícita, explica por separado y señala tu inferencia.');
  if(evidence)group.push('¿Qué idea central expresa este fragmento y qué evidencia aporta? Reescríbelo sin copiar: «'+evidence+'»');
  questionGroups.push(group);
 }
 // Primero una pregunta anclada a cada bloque, después rellenar en rondas.
 // Así las últimas secciones no desaparecen cuando el documento es largo.
 const selectedQuestions=questionGroups.flatMap(group=>group.slice(0,2));
 for(let depth=2;selectedQuestions.length<60;depth++){
  let added=false;
  for(const group of questionGroups){
   if(group[depth]){
    selectedQuestions.push(group[depth]);added=true;
    if(selectedQuestions.length>=60)break;
   }
  }
  if(!added)break;
 }
 const questions=[...selectedQuestions.slice(0,8),
  'Aplica una idea del material a un caso hipotético: explica el razonamiento y qué fragmento respalda el concepto (no inventes hechos).',
  'Sin consultar, reconstruye el esquema y resume el documento en 5–7 frases; compara después y anota lo que omitiste'
 ].slice(0,60);
 const [recall,studyTime,practice,check,log]=minuteSplit(duration);
 const lines=topics.map((topic,i)=>{
  const stage=stages[stageIndex(i,sessionCount)],local=extractTerms([topic],5),focus=local.length?local.slice(0,4):terms.slice(0,3),parts=topic.parts||[topic];
  let evidence=parts.flatMap(p=>distinct(sentences(p.body),extractTerms([p],5),1)).filter(Boolean);
  if(evidence.length<2)evidence=[...evidence,...distinct(sentences(topic.body),focus,2-evidence.length)];
  evidence=[...new Set(evidence)].slice(0,2);
  const focusText=focus.length?focus.map(t=>'«'+t+'»').join(', '):'las ideas principales';
  const first=focus[0]||topic.title,second=focus[1];
  const objectives=[
   'Explica la idea central de «'+topic.title+'» y define '+focusText+' con palabras propias; distingue la evidencia del documento de tus ejemplos.',
   'Parafrasea '+focusText+' y aclara qué afirma el texto, qué ejemplo aporta y qué duda te queda.',
   'Reconstruye la relación o secuencia descrita en «'+topic.title+'»; conecta '+focusText+' con evidencia y señala si el vínculo es explícito o inferido.',
   'Aplica '+focusText+' a un caso hipotético y contrasta tu conclusión con el fragmento; no añadas hechos que el documento no respalde.',
   'Recupera sin consultar las ideas de «'+topic.title+'», conecta '+focusText+' y responde una mini-prueba usando evidencia.'
  ][stageIndex(i,sessionCount)];
  const checkItems=[
   'Explica '+(first?'«'+first+'»':'la idea principal')+' sin leer (0–2 puntos).',
   second?'Describe la relación entre «'+first+'» y «'+second+'»; si el texto no la establece, marca tu inferencia (0–2).':'Reconstruye una idea o paso clave y evita añadir información no presente (0–2).',
   'Localiza una frase exacta que respalde tu explicación y di por qué es relevante (0–2).'
  ];
  const evidenceText=evidence.length?evidence.map(x=>'• '+x).join('\n'):'• No se detectó una frase fiable; vuelve al bloque y selecciona una evidencia manual.';
  return 'SESIÓN '+(i+1)+' · '+stage.name+' — '+topic.title+' ('+duration+' min)\n'+
   'OBJETIVO OBSERVABLE: '+objectives+'\n'+
   'FOCO: '+focusText+'\n'+
   'EVIDENCIA DEL ARCHIVO (fragmentos):\n'+evidenceText+'\n\n'+
   recall+' min · RECUPERACIÓN: antes de leer, escribe lo que recuerdas de '+(focus.slice(0,2).join(' y ')||topic.title)+' y una pregunta que no puedas responder.\n'+
   studyTime+' min · LECTURA SELECTIVA: lee este bloque; marca definición, idea principal, relación/proceso y la frase que respalda cada una. No subrayes todo.\n'+
   practice+' min · PRODUCCIÓN ACTIVA: '+stage.activity+'\n'+
   check+' min · CHECKPOINT (6 puntos):\n'+checkItems.map(x=>'□ '+x).join('\n')+'\nMeta: 5/6. Si obtienes menos, reestudia el criterio fallado y vuelve a responder sin consultar.\n'+
   log+' min · CORRECCIÓN: compara tus respuestas con la evidencia; registra el error y escribe una pregunta para el siguiente repaso.';
 });
 const warnings:string[]=[];
 if(!sections.some(s=>! /^(Bloque|Sección|Material completo)\b/i.test(s.title)))warnings.push('No se detectaron encabezados fiables; la ruta se dividió por longitud y términos frecuentes. Revisa el orden de los bloques.');
 if(rawWords<500)warnings.push('El material es breve; la guía puede necesitar ejemplos o ejercicios adicionales que tu profesor haya indicado');
 if(terms.length<4)warnings.push('Se encontraron pocos conceptos distintivos. Comprueba la extracción y añade manualmente los términos importantes');
 const review=Math.max(10,Math.round(duration*.4)),ped=retrieveKnowledge(name+' '+subject+' '+terms.slice(0,6).join(' '),3),pedText=ped.length?ped.map(e=>'• '+e.title+': '+e.practice).join('\n'):'• Recupera primero sin mirar, comprueba y corrige.\n• Distribuye el repaso; vuelve antes a lo que fallaste.';
 const method=[
  'PLAN DE ESTUDIO LOCAL — HEURÍSTICO, NO IA',
  'ANTES DE CADA SESIÓN: prepara el material, aparta distracciones y ten una hoja para responder sin consultar. Descansa 3–5 minutos entre sesiones.',
  'Material: '+name+(subject?' · '+subject:'')+' · '+rawWords.toLocaleString('es')+' palabras',
  'Estructura detectada: '+sections.length+' bloque(s) de origen; ruta de '+sessionCount+' sesiones de '+duration+' minutos.',
  'OBJETIVO FINAL: explicar las ideas centrales con tus palabras, relacionarlas sin inventar conexiones, aplicar al menos una a un caso y respaldar respuestas con frases del documento.',
  'ORDEN PEDAGÓGICO: '+topics.map((t,i)=>(i+1)+'. '+t.title+' → '+stages[stageIndex(i,sessionCount)].name).join(' | '),
  'Principios para estudiar: '+pedText,
  '',
  ...lines,
  '',
  'REPASO ESPACIADO: día 1, día 3 y día 7 ('+review+' min). Empieza con una hoja en blanco o preguntas; consulta después y repasa los errores, no releas todo.',
  'EVALUACIÓN FINAL: 5 preguntas — definición/idea, relación entre conceptos, reconstrucción del proceso o esquema, aplicación a un caso y evidencia textual. Meta: 4/5 correctas y dos respuestas respaldadas por una frase. Si no llegas, repite la sesión correspondiente.',
  'REGISTRO DE PROGRESO: por sesión anota puntuación /6, concepto que fallaste y si ya puedes explicarlo sin mirar. Marca dominio solo con 5/6 o más en dos intentos separados.',
  'CONTROL DE CALIDAD: la extracción, segmentación y selección de conceptos son heurísticas locales. Revisa títulos, fragmentos y preguntas. Si el archivo es escaneado, tiene tablas complejas o la extracción pierde el orden, la guía puede ser incompleta; Studium no añade conocimiento externo.'
 ].join('\n');
 return{name,subject,source:raw,summary,outline,terms,cards,questions:[...new Set([...questions.slice(0,8),...questions.slice(-2)])].slice(0,10),method,sessionCount,minutesPerSession:duration,warnings};
}
