import test from 'node:test';
import assert from 'node:assert/strict';
import { rankContext, normalizeTerms, parseStudyResponse, parseQuizResponse, parseQuizGrade } from '../src/ai.ts';
import { createLocalStudyPlan } from '../src/study-plan.ts';

const docs=[
 {title:'Biología vegetal',subject:'Ciencias',content:'La fotosíntesis ocurre en los cloroplastos. La clorofila capta la luz y ayuda a transformar agua y dióxido de carbono en azúcares. Este proceso libera oxígeno.'},
 {title:'Historia',subject:'Sociales',content:'La Revolución Industrial transformó la producción, las ciudades y las relaciones laborales. Las máquinas aumentaron la capacidad de fabricación.'},
 {title:'Matemáticas',subject:'Álgebra',content:'Las ecuaciones lineales permiten encontrar una incógnita. Se despeja la variable con operaciones inversas y se comprueba sustituyendo el resultado.'}
];
test('normaliza tildes sin eliminar letras de los términos',()=>{
 assert.deepEqual(normalizeTerms('Revolución, biología y ecuación'),['revolucion','biologia','ecuacion']);
});
test('ranking prioriza la fuente más relacionada y su fragmento',()=>{
 const found=rankContext('fotosíntesis clorofila',docs,3);
 assert.equal(found[0].title,'Biología vegetal');
 assert.match(found[0].excerpt,/clorofila/i);
});
test('ranking funciona si la consulta no tiene tildes',()=>{
 assert.equal(rankContext('revolucion industrial',docs)[0].title,'Historia');
});
test('ranking usa título y materia como señales',()=>{
 assert.equal(rankContext('algebra',docs)[0].title,'Matemáticas');
});
test('no devuelve resultados para consulta vacía o stopwords',()=>{
 assert.deepEqual(rankContext('que para con',docs),[]);
 assert.deepEqual(rankContext('',docs),[]);
});
test('respeta límites y devuelve vacío si el límite es cero',()=>{
 assert.equal(rankContext('producción fotosíntesis',docs,1).length,1);
 assert.deepEqual(rankContext('producción fotosíntesis',docs,0),[]);
});
test('no incluye documentos sin contenido',()=>{
 assert.deepEqual(rankContext('tema',[{title:'Sin texto',subject:'',content:''}]),[]);
});
const validGuide={summary:'Este resumen contiene suficiente contenido para explicar el tema con claridad y una visión general.',outline:['Concepto principal','Aplicación y ejemplos'],terms:['concepto','aplicación'],cards:[{front:'¿Qué es?',back:'Una explicación con sentido.'}],questions:['Define el concepto','Explica la relación','Aplica a un ejemplo'],method:'Primero recuerda los conceptos sin consultar. Luego estudia la sección, explica con tus palabras, resuelve una práctica y corrige errores. Repite el recuerdo mañana y en varios días.'};
test('parsea JSON rodeado de texto y un bloque markdown',()=>{
 const parsed=parseStudyResponse('Respuesta:\n```json\n'+JSON.stringify(validGuide)+'\n```\nFin.');
 assert.equal(parsed.summary,validGuide.summary);
 assert.equal(parsed.cards.length,1);
});
test('rechaza guía incompleta o estructura JSON incorrecta',()=>{
 assert.throws(()=>parseStudyResponse(JSON.stringify({summary:'muy corto',outline:[],terms:[],cards:[],questions:[],method:''})),/incompleta/);
 assert.throws(()=>parseStudyResponse('no es json'),/JSON válido/);
});
test('limita conceptos, tarjetas y preguntas',()=>{
 const huge={...validGuide,terms:Array(20).fill('término'),cards:Array(20).fill({front:'pregunta',back:'respuesta'}),questions:Array(20).fill('pregunta')};
 const parsed=parseStudyResponse(JSON.stringify(huge));
 assert.equal(parsed.terms.length,10);
 assert.equal(parsed.cards.length,12);
 assert.equal(parsed.questions.length,10);
});

test('el plan local es específico al material y respeta la duración',()=>{
 const source='La fotosíntesis convierte energía luminosa en energía química. La clorofila absorbe la luz y se encuentra en los cloroplastos. Durante el proceso se utiliza dióxido de carbono y agua para producir azúcares. El oxígeno se libera como resultado de las reacciones. La energía química queda almacenada en moléculas orgánicas. Las plantas usan esos compuestos para crecer y mantener sus funciones.';
 const plan=createLocalStudyPlan('Biología.txt','Biología',source,25);
 assert.match(plan.summary,/fotosíntesis|clorofila/i);
 assert.ok(plan.cards.length>=2);
 assert.match(plan.method,/25 min/);\n assert.ok((plan.method.match(/Sesión \\d+/g)||[]).length>=3);\n assert.ok(plan.method.split('Sesión ').slice(1).every(s=>s.startsWith('\\d+ (25 min)')));
 assert.match(plan.method,/día 1/i);
 assert.ok(plan.questions.length>=3);
});
test('planificador local rechaza textos insuficientes',()=>{
 assert.throws(()=>createLocalStudyPlan('vacío','', 'solo palabras'),/poco texto/);
});

test('valida estructura de quiz y normaliza dificultad',()=>{
 const raw=JSON.stringify({questions:[
 {question:'Define un concepto clave',answer:'Definición válida',explanation:'Explicación con fundamento',difficulty:'basic'},
 {question:'Relaciona dos ideas principales',answer:'Relación',explanation:'Se conectan por el mecanismo descrito',difficulty:'intermediate'},
 {question:'Aplica el conocimiento a un caso',answer:'Aplicación',explanation:'Se aplica de esta manera',difficulty:'unknown'}]});
 const q=parseQuizResponse(raw);assert.equal(q.length,3);assert.equal(q[2].difficulty,'intermediate');
});
test('rechaza quiz incompleto y evalúa solo puntuación permitida',()=>{
 assert.throws(()=>parseQuizResponse(JSON.stringify({questions:[]})),/al menos 3/);
 const grade=parseQuizGrade(JSON.stringify({score:2,feedback:'Respuesta correcta y clara.',correction:'Está bien explicada.'}));
 assert.equal(grade.score,2);
 assert.throws(()=>parseQuizGrade(JSON.stringify({score:4,feedback:'x',correction:'y'})),/Puntuación inválida/);
});

test('parsea quizzes dentro de fences markdown',()=>{
 const data={questions:[
 {question:'Pregunta uno con contexto',answer:'Respuesta uno',explanation:'Explicación uno',difficulty:'basic'},
 {question:'Pregunta dos con contexto',answer:'Respuesta dos',explanation:'Explicación dos',difficulty:'intermediate'},
 {question:'Pregunta tres con contexto',answer:'Respuesta tres',explanation:'Explicación tres',difficulty:'advanced'}]};
 const result=parseQuizResponse('\\`\\`\\`json\\n'+JSON.stringify(data)+'\\n\\`\\`\\`');
 assert.equal(result.length,3);
 assert.equal(result[2].difficulty,'advanced');
});
