import test from 'node:test';
import assert from 'node:assert/strict';
import { rankContext, parseStudyResponse } from '../src/ai.ts';

const docs=[
 {title:'Biología vegetal',subject:'Ciencias',content:'La fotosíntesis ocurre en los cloroplastos. La clorofila capta la luz y ayuda a transformar agua y dióxido de carbono en azúcares. Este proceso libera oxígeno.'},
 {title:'Historia',subject:'Sociales',content:'La Revolución Industrial transformó la producción, las ciudades y las relaciones laborales. Las máquinas aumentaron la capacidad de fabricación.'}
];

test('recupera el material con mayor relación a la consulta',()=>{
 const found=rankContext('fotosíntesis clorofila',docs,2);
 assert.equal(found[0].title,'Biología vegetal');
 assert.match(found[0].excerpt,/clorofila/i);
});
test('la búsqueda ignora diferencias de acentos',()=>{
 const found=rankContext('revolucion industrial',docs,2);
 assert.equal(found[0].title,'Historia');
});
test('no recupera documentos con una consulta formada solo por stopwords',()=>{
 assert.deepEqual(rankContext('que para con',docs),[]);
});
test('respeta el límite solicitado de resultados',()=>{
 assert.equal(rankContext('producción fotosíntesis',docs,1).length,1);
});

const validGuide={summary:'Este resumen contiene suficiente contenido para explicar el tema con claridad y una visión general.',outline:['Concepto principal','Aplicación y ejemplos'],terms:['concepto','aplicación'],cards:[{front:'¿Qué es?',back:'Una explicación con sentido.'}],questions:['Define el concepto','Explica la relación','Aplica a un ejemplo'],method:'Primero recuerda los conceptos sin consultar. Luego estudia la sección, explica con tus palabras, resuelve una práctica y corrige errores. Repite el recuerdo mañana y en varios días.'};
test('parsea JSON del modelo incluso cuando viene en bloque markdown',()=>{
 const parsed=parseStudyResponse('Aquí está:\\n```json\\n'+JSON.stringify(validGuide)+'\\n```');
 assert.equal(parsed.summary,validGuide.summary);
 assert.equal(parsed.cards.length,1);
});
test('rechaza una guía demasiado incompleta',()=>{
 assert.throws(()=>parseStudyResponse(JSON.stringify({summary:'muy corto',outline:[],terms:[],cards:[],questions:[],method:''})),/incompleta/);
});
test('limita cantidad de tarjetas, preguntas y conceptos',()=>{
 const huge={...validGuide,terms:Array(20).fill('término'),cards:Array(20).fill({front:'pregunta',back:'respuesta'}),questions:Array(20).fill('pregunta')};
 const parsed=parseStudyResponse(JSON.stringify(huge));
 assert.equal(parsed.terms.length,10);
 assert.equal(parsed.cards.length,12);
 assert.equal(parsed.questions.length,10);
});
