export type AISettings={provider:'openai'|'ollama'|'custom',baseUrl:string,model:string,temperature:number};
export type AIMessage={role:'user'|'assistant',content:string,created:number,sources?:string[]};
export const defaultAI:AISettings={provider:'ollama',baseUrl:'http://localhost:11434/v1',model:'qwen2.5:3b',temperature:.35};
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
`;
export function rankContext(query:string,materials:{title:string,subject:string,content:string}[],limit=5){
 const terms=(query.toLowerCase().match(/[a-záéíóúüñ0-9]{3,}/g)||[]).filter(x=>!['para','como','que','con','por','una','the','and','you','los','las','del'].includes(x));
 const scored=materials.map(m=>{const text=(m.title+' '+m.subject+' '+m.content).toLowerCase();const score=terms.reduce((n,t)=>n+(text.split(t).length-1)*(m.title.toLowerCase().includes(t)?4:1),0);let best=0,bestAt=0;const size=1700;for(let i=0;i<text.length;i+=850){const part=text.slice(i,i+size);const value=terms.reduce((n,t)=>n+(part.split(t).length-1),0);if(value>best){best=value;bestAt=i;}}return {m,score,bestAt};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,limit);
 return scored.map(({m,bestAt})=>({title:m.title,subject:m.subject,excerpt:m.content.slice(Math.max(0,bestAt-100),Math.min(m.content.length,bestAt+1700))}));
}
export async function requestAI(settings:AISettings,key:string,messages:{role:'system'|'user'|'assistant',content:string}[],signal?:AbortSignal){
 const base=settings.baseUrl.trim().replace(/\/$/,'');if(!base)throw new Error('Configura la URL del servicio IA.');
 const headers:Record<string,string>={'Content-Type':'application/json'};if(key.trim())headers.Authorization='Bearer '+key.trim();
 const response=await fetch(base+'/chat/completions',{method:'POST',headers,signal,body:JSON.stringify({model:settings.model,temperature:settings.temperature,messages})});
 if(!response.ok){const details=await response.text().catch(()=> '');throw new Error('IA '+response.status+': '+details.slice(0,500));}
 const data=await response.json();const content=data.choices?.[0]?.message?.content;if(typeof content!=='string'||!content.trim())throw new Error('El proveedor devolvió una respuesta vacía.');return content.trim();
}
export async function generateStudy(settings:AISettings,key:string,name:string,subject:string,source:string){
 const prompt='Crea un método de estudio eficaz y fiel al material. Define objetivos observables, prerequisitos, bloques con tiempo y actividades concretas, recuperación activa sin mirar, ejemplos de aplicación, preguntas progresivas, errores frecuentes y repaso espaciado. No rellenes con frases genéricas ni inventes datos. Devuelve JSON puro: summary, outline (array), terms (array), cards (array {front,back}), questions (array), method.\\nArchivo: '+name+'\\nMateria: '+subject+'\\nContenido:\\n'+source.slice(0,24000);
 const raw=await requestAI(settings,key,[{role:'system',content:STUDIUM_LEARNING_CORE+'\\n'+STUDIUM_METHODS_DB+'\\nGenera JSON estricto, sin markdown.'},{role:'user',content:prompt}]);
 const start=raw.indexOf('{'),end=raw.lastIndexOf('}');if(start<0||end<=start)throw new Error('No recibí un resultado estructurado del modelo.');
 const data=JSON.parse(raw.slice(start,end+1));
 return {summary:String(data.summary||''),outline:Array.isArray(data.outline)?data.outline.map(String):[],terms:Array.isArray(data.terms)?data.terms.map(String):[],cards:Array.isArray(data.cards)?data.cards.map((x:any)=>({front:String(x.front||''),back:String(x.back||'')})).filter((x:any)=>x.front&&x.back).slice(0,20):[],questions:Array.isArray(data.questions)?data.questions.map(String).slice(0,15):[],method:String(data.method||'')};
}

export const STUDIUM_METHODS_DB="PROTOCOLOS DE ENSEÑANZA (base pedagógica interna de Studium):\n1. DIAGNÓSTICO: preguntar objetivo, tiempo disponible, experiencia y prueba breve; usar errores para detectar prerequisitos.\n2. EXPLICACIÓN: presentar una idea por bloque; empezar por intuición y vocabulario; explicar mecanismo/causa; ejemplo resuelto; pedir que el estudiante lo explique; práctica independiente.\n3. CARGA COGNITIVA: reducir elementos simultáneos; segmentar procedimientos; quitar detalles decorativos; usar ejemplos completos para novatos y retirar ayudas gradualmente.\n4. RECUERDO ACTIVO: cerrar fuente y reconstruir conceptos; preguntas cortas y abiertas; revisar respuestas después del intento; variar formatos y dificultad.\n5. ESPACIADO: revisar al día siguiente, a los 3 días, 7 días y 14 días, ajustando intervalo según acierto/fluidez. No usar fechas como garantía científica exacta.\n6. INTERCALADO: mezclar tipos de problema cuando el estudiante ya conoce las bases; alternar categorías similares para practicar discriminación.\n7. ELABORACIÓN: explicar por qué, relacionar con lo conocido, crear analogía, ejemplo propio y contraejemplo.\n8. PRÁCTICA: feedback específico; primero pista, luego solución; pedir un nuevo intento y transferencia a situación distinta.\n9. PLAN: objetivo verificable, sesiones breves con recuperación, estudio de fuente, práctica, corrección y reflexión; incluir pausas y evitar sobrecarga.\n10. EVALUACIÓN: variedad desde recuerdo literal hasta aplicación, análisis y creación; rubricar precisión, explicación, transferencia y autonomía. Identificar errores frecuentes y siguiente acción.\n11. MOTIVACIÓN: objetivos pequeños, progreso visible y elección limitada; no culpabilizar ni prometer resultados.\n12. IDIOMAS: comprensión contextual, ejemplos, práctica oral/escrita, corrección de una o dos prioridades, repetición espaciada de vocabulario y uso en contexto.";
