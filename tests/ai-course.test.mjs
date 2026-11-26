import test from 'node:test';
import assert from 'node:assert/strict';
import {splitSourceForAI,parseAIBookMap,parseAILesson,buildAILessonPrompt,formatAICourseMethod} from '../src/ai.ts';

const chapter='La fotosíntesis convierte la energía luminosa en energía química. La clorofila absorbe luz en los cloroplastos. El agua se divide durante las reacciones dependientes de la luz y libera oxígeno. En otra etapa, el dióxido de carbono se utiliza para formar moléculas orgánicas. La disponibilidad de luz y agua modifica la velocidad del proceso. ';
const book=Array.from({length:9},(_,i)=>'# Capítulo '+(i+1)+' · '+['Energía','Pigmentos','Reacciones','Carbono','Oxígeno','Cloroplastos','Factores','Aplicación','Síntesis'][i]+'\n\n'+chapter.repeat(5)).join('\n\n');

test('segmenta un libro por encabezados, conserva contenido y aumenta profundidad',()=>{
 const normal=splitSourceForAI(book,'standard'),deep=splitSourceForAI(book,'deep'),very=splitSourceForAI(book,'very-deep');
 assert.ok(normal.length>=9);assert.ok(deep.length>=normal.length);assert.ok(very.length>=deep.length);
 assert.ok(deep.length<=48);assert.equal(deep[0].index,0);assert.equal(deep.at(-1).total,deep.length);
 const compact=(s)=>s.replace(/\s+/g,' ');for(const chunk of deep)assert.ok(compact(book).includes(compact(chunk.content)),'El segmento debe preservar texto fuente');
 assert.ok(deep.some(c=>/Capítulo 6/.test(c.title)));
});
test('el mapa de curso no acepta omitir segmentos',()=>{
 const chunks=splitSourceForAI('# Capítulo A\n\n'+chapter+'\n\n# Capítulo B\n\n'+chapter,'standard');
 assert.ok(chunks.length>=2);
 const good={bookTitle:'Curso',overview:'Una descripción del libro.',objectives:['Objetivo'],sequence:chunks.map(c=>c.id+' — '+c.title),prerequisites:['No identificados'],connections:[]};
 assert.equal(parseAIBookMap(JSON.stringify(good),chunks).sequence.length,chunks.length);
 const bad={...good,sequence:[chunks[0].id]};
 assert.throws(()=>parseAIBookMap(JSON.stringify(bad),chunks),/omitió/);
});
test('parser rechaza lecciones poco profundas y cita solo evidencia literal',()=>{
 const chunk={id:'S001',title:'Fotosíntesis',content:chapter,index:0,total:1};
 const sentences=chapter.split('. ').filter(Boolean).map(x=>x.endsWith('.')?x:x+'.');const good={id:chunk.id,title:'Transformación de energía',objective:'Explicar cómo se transforma energía luminosa en energía química y distinguir etapas.',prerequisite:'Conocer energía y moléculas.',keyIdeas:['Energía luminosa','Clorofila','Cloroplastos','Liberación de oxígeno'],explanation:'La fotosíntesis transforma energía luminosa en energía química y utiliza pigmentos como la clorofila para absorber luz. La clorofila se encuentra en los cloroplastos. Durante las reacciones dependientes de la luz, el agua se divide y se libera oxígeno. En otra etapa, el dióxido de carbono se utiliza para formar moléculas orgánicas. La disponibilidad de luz y agua modifica la velocidad del proceso. Estos pasos se relacionan como una transformación de energía y materia, según las afirmaciones del fragmento. Para estudiarlo, identifica qué entra, qué ocurre y qué se forma, sin confundir cada etapa.',workedExample:'No hay ejemplo de la fuente; se puede dibujar el proceso con entradas y productos.',evidence:[chapter.split('. ')[0]+'.',chapter.split('. ')[1]+'.'],activities:['Recupera sin consultar','Parafrasea la explicación','Subraya evidencia','Aplica a un caso hipotético','Detecta una confusión'],questions:Array.from({length:6},(_,i)=>({question:'Pregunta progresiva '+(i+1),answer:'Respuesta esperada específica '+(i+1),evidence:sentences[i%sentences.length]})),checkpoint:['Describe las etapas sin consultar','Explica el papel de la clorofila'],cards:[{front:'¿Qué absorbe la clorofila?',back:'Luz',evidence:'La clorofila absorbe luz en los cloroplastos.'}]};
 const parsed=parseAILesson(JSON.stringify(good),chunk);
 assert.equal(parsed.questions.length,6);assert.ok(parsed.evidence.length>=2);assert.equal(parsed.cards.length,1);
 const prompt=buildAILessonPrompt(chunk,{bookTitle:'Curso',overview:'',objectives:[],sequence:[],prerequisites:[],connections:[]},30);
 assert.match(prompt,/250–450 palabras/);assert.match(prompt,/cita literal/);
 assert.throws(()=>parseAILesson(JSON.stringify({...good,explanation:'resumen breve'}),chunk),/superficial/);
 assert.throws(()=>parseAILesson(JSON.stringify({...good,evidence:['frase inventada']}),chunk),/superficial/);
});
test('formato final incluye enseñanza extensa, ejercicios con solución y checkpoints',()=>{
 const chunk={id:'S001',title:'Fotosíntesis',content:chapter,index:0,total:1};
 const lesson=parseAILesson(JSON.stringify({id:'S001',title:'Transformación',objective:'Explicar la transformación energética con claridad y evidencia.',prerequisite:'Energía',keyIdeas:['Luz','Pigmentos','Oxígeno'],explanation:'La fotosíntesis transforma energía luminosa en energía química. '+chapter.repeat(2),workedExample:'No hay ejemplo.',evidence:[chapter.split('. ')[0]+'.',chapter.split('. ')[1]+'.'],activities:['Recuperación','Paráfrasis','Evidencia','Caso','Confusión'],questions:Array.from({length:4},(_,i)=>({question:'Q'+i,answer:'A'+i,evidence:chapter.split('. ')[i]+'.'})),checkpoint:['Criterio uno','Criterio dos'],cards:[]}),chunk);
 const map={bookTitle:'Libro',overview:'Resumen',objectives:['Objetivo'],sequence:['S001'],prerequisites:[],connections:[]};
 const method=formatAICourseMethod(map,[lesson],30);
 assert.match(method,/EXPLICACIÓN PROFUNDA/);assert.match(method,/Respuesta esperada/);assert.match(method,/CHECKPOINTS/);assert.match(method,/REPASO ESPACIADO/);
});
