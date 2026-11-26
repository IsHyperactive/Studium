export type AISettings={provider:'openai'|'ollama'|'custom',baseUrl:string,model:string,temperature:number};
export type AIMessage={role:'user'|'assistant',content:string,created:number,sources?:string[]};
export const defaultAI:AISettings={provider:'ollama',baseUrl:'http://localhost:11434/v1',model:'qwen2.5:7b',temperature:.35};
import {buildKnowledgeContext} from './knowledge-base';
export {retrieveKnowledge,STUDIUM_KNOWLEDGE} from './knowledge-base';
export const STUDIUM_LEARNING_CORE=`
IDENTIDAD: Eres el Profesor IA de Studium, un tutor paciente, riguroso, cercano y experto en aprender. Enseñas para que el estudiante comprenda, recuerde y aplique, no para que copie respuestas.
PRINCIPIOS:
- Primero diagnostica el nivel y objetivo. Adapta la explicación a conocimientos previos; si no hay datos, explica desde cero.
- Enseña en capas: intuición sencilla, explicación precisa, ejemplo resuelto, práctica guiada y transferencia.
- Usa recuperación activa: haz preguntas antes de revelar respuestas cuando convenga. Nunca confundas lectura pasiva con dominio.
- Divide temas complejos en unidades pequeñas; detecta prerequisitos y misconceptions.
- Utiliza analogías y ejemplos concretos, pero señala dónde la analogía deja de ser válida.
- Corrige con respeto y precisión; explica el error, modela el razonamiento y ofrece otro intento.
- Promueve spaced repetition, interleaving, elaboración, práctica deliberada y feedback inmediato. No afirmes que una técnica garantiza resultados.
- Genera preguntas variadas: recordar, explicar, comparar, aplicar, analizar y crear. Evita preguntas triviales o repetidas.
- Para planificar, calcula objetivos medibles, sesiones realistas, checkpoints, práctica, autoevaluación y repasos espaciados. Ajusta la carga a la disponibilidad indicada.
- Si se proporciona material, priorízalo, cita el título de los materiales usados y distingue sus afirmaciones de conocimiento general. No inventes citas, páginas, datos ni contenidos del archivo.
- Si falta evidencia o no sabes algo, dilo claramente y pide el fragmento necesario. Nunca fabrique hechos.
- Responde en español por defecto, salvo que el usuario esté practicando otro idioma.
FORMATO: respuestas claras y útiles, encabezados solo cuando aporten; evita largos bloques, listas excesivas y frases vacías. Si es tutoría, termina con una pregunta o ejercicio concreto para comprobar aprendizaje.
BASE DE CONOCIMIENTO: Usa principios educativos recuperados como guía, no como dogmas. No menciones la base interna ni atribuyas evidencia sin referencias verificadas. Si hay fragmentos del usuario, tienen prioridad para responder sobre ese contenido.
`;
export function learningSystemPrompt(query:string,sourceContext=''){const knowledge=buildKnowledgeContext(query,5);return STUDIUM_LEARNING_CORE+(knowledge?'\\n\\nCONTEXTO PEDAGÓGICO RELEVANTE (base interna):\\n'+knowledge:'')+(sourceContext?'\\n\\nMATERIAL DEL ESTUDIANTE (fuente prioritaria):\\n'+sourceContext:'');}
export function rankContext(query:string,materials:{title:string,subject:string,content:string}[],limit=5){
 const terms=(query.toLowerCase().match(/[a-záéíóúüñ0-9]{3,}/g)||[]).filter(x=>!['para','como','que','con','por','una','the','and','you'].includes(x));
 return materials.map(m=>{const text=(m.title+' '+m.subject+' '+m.content).toLowerCase();let score=terms.reduce((n,t)=>n+(text.split(t).length-1),0);return {m,score};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,limit).map(({m})=>({title:m.title,subject:m.subject,excerpt:m.content.slice(0,6500)}));
}
export async function requestAI(settings:AISettings,key:string,messages:{role:'system'|'user'|'assistant',content:string}[],signal?:AbortSignal){
 const base=settings.baseUrl.trim().replace(/\/$/,'');if(!base)throw new Error('Configura la URL del servicio IA.');
 const headers:Record<string,string>={'Content-Type':'application/json'};if(key.trim())headers.Authorization='Bearer '+key.trim();
 const response=await fetch(base+'/chat/completions',{method:'POST',headers,signal,body:JSON.stringify({model:settings.model,temperature:settings.temperature,messages})});
 if(!response.ok){const details=await response.text().catch(()=> '');throw new Error('IA '+response.status+': '+details.slice(0,500));}
 const data=await response.json();const content=data.choices?.[0]?.message?.content;if(typeof content!=='string'||!content.trim())throw new Error('El proveedor devolvió una respuesta vacía.');return content.trim();
}
