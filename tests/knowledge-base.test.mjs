import test from 'node:test';
import assert from 'node:assert/strict';
import {STUDIUM_KNOWLEDGE,retrieveKnowledge,buildKnowledgeContext} from '../src/knowledge-base.ts';

test('base de conocimiento contiene artículos diversos y práctica concreta',()=>{
 assert.ok(STUDIUM_KNOWLEDGE.length>=25);
 for(const entry of STUDIUM_KNOWLEDGE){assert.ok(entry.title);assert.ok(entry.content.length>100);assert.ok(entry.practice.length>20);}
});
test('recupera técnicas de memoria para consulta sobre tarjetas y repasos',()=>{
 const results=retrieveKnowledge('flashcards, memoria y repaso espaciado');
 assert.ok(results.some(x=>x.id==='retrieval'));
 assert.ok(results.some(x=>x.id==='spacing'));
});
test('recupera orientación para tutoría socrática y errores',()=>{
 const results=retrieveKnowledge('tutor, pistas y corregir un error de estudiante');
 assert.ok(results.some(x=>x.id==='tutoring'));
 assert.ok(results.some(x=>x.id==='feedback'));
});
test('contexto recuperado es útil y acotado',()=>{
 const context=buildKnowledgeContext('plan adaptativo y objetivos de examen',3);
 assert.ok(context.includes('Práctica:'));
 assert.ok(context.length>100&&context.length<10000);
});
test('consulta sin palabras útiles devuelve vacío',()=>assert.equal(retrieveKnowledge(''),[].length));
