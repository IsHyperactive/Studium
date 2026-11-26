import test from 'node:test';
import assert from 'node:assert/strict';
import {createLocalStudyPlan} from '../src/study-plan.ts';
const source=['# Fundamentos de fotosíntesis','La fotosíntesis convierte la energía luminosa en energía química almacenada en moléculas orgánicas. Las plantas absorben luz mediante pigmentos como la clorofila, que se encuentra en los cloroplastos. El dióxido de carbono y el agua participan en el proceso y la planta utiliza los azúcares producidos para crecer y mantener sus funciones.','# Etapas del proceso','Durante las reacciones dependientes de la luz, los pigmentos absorben energía y se transforma parte de ella en energía química. El agua se divide y se libera oxígeno como producto de estas reacciones. En las reacciones que fijan carbono, la planta utiliza dióxido de carbono para formar moléculas orgánicas a partir de la energía disponible.','# Importancia y aplicaciones','La fotosíntesis contribuye al ciclo del carbono y sostiene muchas cadenas alimentarias porque produce materia orgánica. Su eficiencia depende de factores ambientales como la intensidad de la luz, la disponibilidad de agua y la concentración de dióxido de carbono. Comprender estas condiciones permite explicar por qué el crecimiento vegetal cambia según el ambiente y cómo se pueden mejorar prácticas agrícolas.'].join('\n\n');
test('ruta progresiva, objetivos vinculados al texto y tiempos exactos',()=>{const p=createLocalStudyPlan('Biología.md','Biología',source,25);assert.equal(p.minutesPerSession,25);assert.ok(p.sessionCount>=2&&p.sessionCount<=5);const sessions=p.method.split(/SESIÓN \d+ · /).slice(1);assert.equal(sessions.length,p.sessionCount);for(const s of sessions){assert.match(s,/25 min/);const mins=[...s.matchAll(/(\d+) min ·/g)].map(x=>Number(x[1]));assert.equal(mins.reduce((a,b)=>a+b,0),25);assert.match(s,/OBJETIVO OBSERVABLE:/);assert.match(s,/FOCO:/);assert.match(s,/EVIDENCIA DEL ARCHIVO/);assert.match(s,/PRODUCCIÓN ACTIVA:/);assert.match(s,/CHECKPOINT \(6 puntos\)/);assert.match(s,/Meta: 5\/6/);}assert.match(p.method,/PLAN DE ESTUDIO LOCAL — HEURÍSTICO, NO IA/);assert.match(p.method,/REPASO ESPACIADO: día 1, día 3 y día 7/);assert.match(p.method,/EVALUACIÓN FINAL: 5 preguntas/);});
test('preserva encabezados, evidencia literal y tarjetas ancladas al archivo',()=>{const p=createLocalStudyPlan('Biología.md','',source);for(const h of ['Fundamentos de fotosíntesis','Etapas del proceso','Importancia y aplicaciones'])assert.ok(p.method.includes(h));assert.ok(p.cards.length);for(const c of p.cards)assert.ok(source.includes(c.back));for(const block of p.method.split('EVIDENCIA DEL ARCHIVO (fragmentos):').slice(1)){const first=block.split('\n')[1]?.replace(/^• /,'')||'';if(first)assert.ok(source.includes(first));}assert.ok(p.questions.length>=5);});
test('preguntas de recuperación son específicas y evitan afirmaciones externas',()=>{const p=createLocalStudyPlan('Biología.md','',source);assert.ok(p.questions.some(q=>/fotosíntesis|clorofila|carbono/i.test(q)));assert.ok(p.questions.some(q=>/evidencia|frase/i.test(q)));assert.ok(p.questions.some(q=>/caso hipotético/i.test(q)));assert.ok(p.terms.some(t=>/fotosíntesis/i.test(t)));assert.ok(!p.terms.some(t=>/^la$/i.test(t)));assert.ok(!p.terms.some(t=>/^moléculas$|^orgánicas$/i.test(t)));assert.match(p.method,/no añade conocimiento externo/);});
test('texto sin encabezados se divide y recibe sesiones progresivas',()=>{const plain=source.replace(/^# .*\n/gm,'').replace(/\n\n/g,' '),p=createLocalStudyPlan('texto.txt','',plain,30);assert.ok(p.outline.length>=2);assert.ok(p.outline.every(x=>/Bloque/.test(x)));assert.match(p.method,/EVIDENCIA DEL ARCHIVO/);assert.match(p.method,/REGISTRO DE PROGRESO/);});
test('rechaza texto insuficiente o extracción sin frases legibles',()=>{assert.throws(()=>createLocalStudyPlan('empty.txt','','texto breve'),/poco texto/);assert.throws(()=>createLocalStudyPlan('scan.pdf','','x'.repeat(350)),/ideas legibles/);});
test('duración se limita a 20–60 minutos y reparte todos los minutos',()=>{for(const value of [10,20,25,30,45,60,90]){const minutes=Math.max(20,Math.min(60,value)),p=createLocalStudyPlan('x','',source,value);assert.equal(p.minutesPerSession,minutes);for(const s of p.method.split(/SESIÓN \d+ · /).slice(1)){const parts=[...s.matchAll(/(\d+) min ·/g)].map(x=>Number(x[1]));assert.equal(parts.reduce((a,b)=>a+b,0),minutes);assert.ok(parts.every(x=>x>=1));}}});
test('documentos largos se distribuyen en hasta 24 lecciones',()=>{const p=createLocalStudyPlan('largo.txt','',source.repeat(8),45);assert.ok(p.sessionCount>=8&&p.sessionCount<=24);const blocks=p.method.split(/SESIÓN \d+ · /).slice(1);assert.equal(blocks.length,p.sessionCount);for(const s of blocks){const mins=[...s.matchAll(/(\d+) min ·/g)].map(x=>Number(x[1]));assert.equal(mins.reduce((a,b)=>a+b,0),45);}assert.match(p.method,/Recuperar y evaluar/);});

test('el resumen conserva los encabezados de origen y alerta si faltan',()=>{
 const p=createLocalStudyPlan('Biología.md','Biología',source,25);
 assert.ok(p.summary.includes('Fundamentos de fotosíntesis:'));
 assert.ok(p.summary.includes('Etapas del proceso:'));
 assert.ok(p.summary.includes('Importancia y aplicaciones:'));
 assert.ok(!p.warnings?.some(x=>/No se detectaron encabezados/.test(x)));
 const plain=source.replace(/^# .*/gm,'').replace(/\n\n/g,' ');
 const unheaded=createLocalStudyPlan('texto.txt','',plain,30);
 assert.ok(unheaded.warnings?.some(x=>/No se detectaron encabezados/.test(x)));
});
test('dos sesiones incluyen comprensión inicial y aplicación antes de cierre',()=>{
 const two=source.split(/\n\n/).filter(Boolean).slice(0,2).join(' ');
 const p=createLocalStudyPlan('breve.txt','',two,20);
 assert.equal(p.sessionCount,2);
 assert.match(p.method,/SESIÓN 1 · Explorar y organizar/);
 assert.match(p.method,/SESIÓN 2 · Aplicar y contrastar/);
});
test('conceptos evitan términos genéricos de estructura documental',()=>{
 const p=createLocalStudyPlan('Biología.md','',source);
 for(const t of p.terms)assert.ok(!['documento','información','texto','sección','bloque','contenido','tema'].includes(t.toLowerCase()));
});

test('la comprobación cubre todos los bloques incluso en documentos largos',()=>{
 const five=[
  '# Mitocondrias y energía','La mitocondria participa en la respiración celular y produce energía química. Las mitocondrias tienen membranas que permiten distintas etapas de la respiración. La respiración celular depende de procesos que ocurren en la mitocondria y libera energía para las funciones de la célula.',
  '# Ribosomas y proteínas','Los ribosomas participan en la síntesis de proteínas y traducen la información genética. La síntesis de proteínas ocurre en los ribosomas y permite construir proteínas necesarias para la célula. Los ribosomas pueden encontrarse libres o asociados a membranas.',
  '# Enzimas y reacciones','Las enzimas aceleran reacciones químicas sin consumirse en ellas. Cada enzima tiene condiciones que influyen en su actividad y la actividad enzimática cambia cuando varían temperatura o pH. Las enzimas ayudan a regular reacciones del metabolismo.',
  '# Ecosistemas y energía','Los ecosistemas incluyen organismos y factores físicos que interactúan. La energía fluye entre niveles tróficos y parte se disipa en cada transferencia. Los ecosistemas dependen de intercambios de materia y energía.',
  '# Neuronas y señales','Las neuronas transmiten señales mediante cambios eléctricos y comunicación química. La transmisión neuronal conecta células y permite coordinar respuestas. Las neuronas se comunican en sinapsis y ajustan su actividad según estímulos.'
 ].join('\n\n');
 const p=createLocalStudyPlan('Unidad larga.md','Ciencias',five,45);
 assert.equal(p.sessionCount,5);
 const focuses=p.method.split('FOCO: ').slice(1).map(x=>x.split('\n')[0].match(/«([^»]+)»/)?.[1]).filter(Boolean);
 assert.equal(focuses.length,5);
 for(const term of focuses)assert.ok(p.questions.some(q=>q.toLowerCase().includes(term.toLowerCase())),'La comprobación no cubre el concepto '+term);
});

test('un libro con capítulos se divide en muchas lecciones con preguntas por capítulo',()=>{
 const chapters=Array.from({length:12},(_,i)=>'# Capítulo '+(i+1)+' · Tema '+(i+1)+'\n\n'+
  'La materia del capítulo '+(i+1)+' explica un mecanismo específico y sus características principales. '+
  'El texto describe cómo este mecanismo funciona y qué condiciones influyen en su comportamiento. '+
  'También presenta una consecuencia importante y explica por qué se relaciona con el tema estudiado. '+
  'Comprender este apartado permite reconstruir la explicación y verificarla usando las afirmaciones del material.').join('\n\n');
 const p=createLocalStudyPlan('Libro completo.epub','Curso',chapters,30);
 assert.ok(p.sessionCount>=10,'Debe dividir un libro extenso en más de cinco lecciones');
 assert.ok(p.sessionCount<=24,'La granularidad tiene un límite razonable');
 assert.ok(p.outline.length>=10,'La ruta conserva capítulos separados');
 assert.ok(p.questions.length>=20,'Debe incluir preguntas específicas por lección');
 for(let i=1;i<=10;i++)assert.ok(p.method.includes('Capítulo '+i),'La sesión debe cubrir capítulo '+i);
 const stages=p.method.match(/SESIÓN \d+ · ([^—]+) —/g)||[];
 assert.ok(stages.length>=10);
});
