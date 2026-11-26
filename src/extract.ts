export type PdfTextItem={str?:string,hasEOL?:boolean};
export function pdfTextItemsToText(items:readonly PdfTextItem[]):string{
 return items.map(item=>(item.str||'')+(item.hasEOL?'\n':' ')).join('');
}
export function normalizeExtractedText(value:string):string{
 return value.replace(/\u0000/g,'').replace(/\r\n?/g,'\n')
  .split('\n').map(line=>line.replace(/[ \t]+/g,' ').trim()).join('\n')
  .replace(/\n{3,}/g,'\n\n').trim();
}
function decodeHtmlEntities(text:string):string{
 return text.replace(/&#x([0-9a-f]+);/gi,(_,hex)=>String.fromCodePoint(parseInt(hex,16)))
  .replace(/&#([0-9]+);/g,(_,num)=>String.fromCodePoint(parseInt(num,10)))
  .replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>')
  .replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'");
}
export function htmlStudyText(html:string):string{
 let source=html.replace(/<(script|style|nav|header|footer)[^>]*>[\s\S]*?<\/\1>/gi,' ');
 source=source.replace(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi,(_,tag,inner)=>'\n## '+inner.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()+'\n\n');
 source=source.replace(/<(p|li|blockquote|tr)\b[^>]*>/gi,'\n').replace(/<\/(p|li|blockquote|tr)>/gi,'\n')
  .replace(/<br\s*\/?>/gi,'\n').replace(/<\/(div|section|article)>/gi,'\n').replace(/<[^>]+>/g,' ');
 return normalizeExtractedText(decodeHtmlEntities(source));
}
