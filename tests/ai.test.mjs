import test from 'node:test';
import assert from 'node:assert/strict';
import { rankContext } from '../src/ai.ts';

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
