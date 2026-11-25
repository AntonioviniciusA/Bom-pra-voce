import {buildPdfFromJpegs} from './flyerPdf';

function readBlob(blob){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(new Uint8Array(reader.result));reader.onerror=()=>reject(reader.error);reader.readAsArrayBuffer(blob);});}

test('builds a non-empty multipage PDF with embedded JPEG pages and a valid cross-reference',async()=>{
 const blob=buildPdfFromJpegs([new Uint8Array([0xff,0xd8,0xff,0xd9]),new Uint8Array([0xff,0xd8,1,2,0xff,0xd9])]);
 expect(blob.type).toBe('application/pdf');
 const bytes=await readBlob(blob),text=String.fromCharCode(...bytes);
 expect(text.startsWith('%PDF-1.4')).toBe(true);
 expect(text).toContain('/Count 2');
 expect(text.match(/\/Subtype \/Image/g)).toHaveLength(2);
 expect(text.match(/\/DCTDecode/g)).toHaveLength(2);
 expect(text).toMatch(/xref\n0 9\n/);
 expect(text.endsWith('%%EOF')).toBe(true);
 expect(bytes.length).toBeGreaterThan(1000);
});
