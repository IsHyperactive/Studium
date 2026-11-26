import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMaterialContext,rankContext,learningSystemPrompt,defaultAI} from '../src/ai.ts';
const materials=[
 {title:'Biología celular',subject:'Biología',content:'La mitocondria participa en la respiración celular y en la producción de energía. La membrana interna contiene complejos que intervienen en el proceso. La célula usa ATP para diferentes funciones.'},
 {title:'Historia dominicana',subject:'Historia',content:'La independencia dominicana se proclamó en 1844. El proceso histórico incluyó distintos actores y condiciones políticas. La Primera República tuvo conflictos y desafíos.'},
 {title:'Inglés básico',subject:'Idioma',content:'Past simple is used for completed actions in the past. Regular verbs often take an ed ending. Irregular verbs have distinct forms such as went and saw.'}
];
test('recuperación contextual ordena material relacionado con consulta',()=>{
 const r=rankContext('¿Cómo se produce ATP en la mitocondria?',materials,3);
 assert.equal(r[0].title,'Biología celular');
 assert.ok(r[0].excerpt.includes('mitocondria'));
});
test('recuperación de contexto entrega fragmentos relevantes y etiqueta fuente',()=>{
 const c=buildMaterialContext('independencia y proclamación 1844',materials,3,2000);
 assert.ok(c.includes('FUENTE: Historia dominicana'));
 assert.ok(c.includes('1844'));
 assert.ok(!c.includes('FUENTE: Inglés básico'));
});
test('el prompt impone límites y grounding de documentos',()=>{
 const p=learningSystemPrompt('explica la fuente','FUENTE: Manual\nFragmento del material.');
 assert.match(p,/No inventes definiciones/);
 assert.match(p,/MATERIAL DEL ESTUDIANTE/);
 assert.match(p,/no necesariamente documento completo/);
 assert.match(p,/Inferencia/);
});
test('modelo local por defecto se declara como proveedor compatible Ollama',()=>{
 assert.equal(defaultAI.provider,'ollama');
 assert.equal(defaultAI.baseUrl,'http://localhost:11434/v1');
 assert.ok(defaultAI.model);
});
