const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const moves=require('./image-moves.json');
for(const row of moves){
 const file=path.resolve(root,row.target);
 if(!file.startsWith(path.join(root,'bom-pra-voce-novo','src','images')+path.sep))throw Error('Image outside library');
 if(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==row.sha256)throw Error(`Image changed: ${row.target}`);
}
console.log(`PASS: ${moves.length} relocated images, original hashes preserved`);
