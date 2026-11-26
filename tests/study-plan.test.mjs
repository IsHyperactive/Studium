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
test('documentos largos crean una ruta de hasta cinco sesiones',()=>{const p=createLocalStudyPlan('largo.txt','',source.repeat(8),45);assert.ok(p.sessionCount>=3&&p.sessionCount<=5);const blocks=p.method.split(/SESIÓN \d+ · /).slice(1);assert.equal(blocks.length,p.sessionCount);for(const s of blocks){const mins=[...s.matchAll(/(\d+) min ·/g)].map(x=>Number(x[1]));assert.equal(mins.reduce((a,b)=>a+b,0),45);}assert.match(p.method,/Recuperar y evaluar/);});

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
