import test from 'node:test';
import assert from 'node:assert/strict';
import {createLocalStudyPlan} from '../src/study-plan.ts';
const source=`# Fundamentos de fotosíntesis
La fotosíntesis convierte la energía luminosa en energía química almacenada en moléculas orgánicas. Las plantas absorben luz mediante pigmentos como la clorofila, que se encuentra en los cloroplastos. El dióxido de carbono y el agua participan en el proceso y la planta utiliza los azúcares producidos para crecer y mantener sus funciones.

# Etapas del proceso
Durante las reacciones dependientes de la luz, los pigmentos absorben energía y se transforma parte de ella en energía química. El agua se divide y se libera oxígeno como producto de estas reacciones. En las reacciones que fijan carbono, la planta utiliza dióxido de carbono para formar moléculas orgánicas a partir de la energía disponible.

# Importancia y aplicaciones
La fotosíntesis contribuye al ciclo del carbono y sostiene muchas cadenas alimentarias porque produce materia orgánica. Su eficiencia depende de factores ambientales como la intensidad de la luz, la disponibilidad de agua y la concentración de dióxido de carbono. Comprender estas condiciones permite explicar por qué el crecimiento vegetal cambia según el ambiente y cómo se pueden mejorar prácticas agrícolas.`;
test('genera un plan local, específico y progresivo con sesiones de duración exacta',()=>{const p=createLocalStudyPlan('Biología.md','Biología',source,25);assert.equal(p.minutesPerSession,25);assert.ok(p.sessionCount>=3&&p.sessionCount<=6);const sessions=p.method.split(/SESIÓN \d+ — /).slice(1);assert.equal(sessions.length,p.sessionCount);for(const s of sessions){assert.match(s,/25 min/);const parts=[...s.matchAll(/(\d+) min —/g)].map(x=>Number(x[1]));assert.equal(parts.reduce((a,b)=>a+b,0),25);}assert.match(p.method,/PLAN LOCAL \(heurístico; no usa IA\)/);assert.match(p.method,/REPASO ESPACIADO/);assert.match(p.method,/CRITERIO DE AVANCE/);assert.match(p.method,/fotosíntesis|clorofila|Etapas/i);});
test('el esquema conserva encabezados del documento y las tarjetas citan frases extraídas',()=>{const p=createLocalStudyPlan('Biología.md','',source);assert.ok(p.outline.some(x=>/Fundamentos/.test(x)));assert.ok(p.outline.some(x=>/Etapas/.test(x)));assert.ok(p.cards.length>0);for(const c of p.cards)assert.ok(source.includes(c.back));});
test('no genera una guía con texto insuficiente o sin frases',()=>{assert.throws(()=>createLocalStudyPlan('empty.txt','','texto breve'),/poco texto/);});
test('el resumen y preguntas están vinculados al contenido fuente',()=>{const p=createLocalStudyPlan('Biología.md','',source);assert.match(p.summary,/fotosíntesis|clorofila|carbono/i);assert.ok(p.questions.length>=3);assert.ok(p.questions.some(q=>/fotosíntesis|clorofila|carbono/i.test(q)));});
