import test from 'node:test';
import assert from 'node:assert/strict';
import {pdfTextItemsToText,normalizeExtractedText,htmlStudyText} from '../src/extract.ts';
test('PDF items retain paragraph/heading boundaries using hasEOL',()=>{
 const text=pdfTextItemsToText([{str:'Unidad 1',hasEOL:true},{str:'La energía',hasEOL:false},{str:'se transforma.',hasEOL:true},{str:'Ejemplo',hasEOL:true}]);
 assert.equal(normalizeExtractedText(text),'Unidad 1\nLa energía se transforma.\nEjemplo');
});
test('normalization removes nulls and excess whitespace without flattening headings',()=>{
 assert.equal(normalizeExtractedText('## Título\r\n\r\n  Texto   con espacios.\u0000\r\n\r\n\r\nFin'),'## Título\n\nTexto con espacios.\n\nFin');
});
test('HTML de EPUB/DOCX conserva títulos, párrafos y listas',()=>{
 assert.equal(htmlStudyText('<h1>Unidad 2</h1><p>Una idea <strong>clave</strong>.</p><ul><li>Primer punto</li><li>Segundo punto</li></ul>'),'## Unidad 2\n\nUna idea clave.\n\nPrimer punto\n\nSegundo punto');
});
