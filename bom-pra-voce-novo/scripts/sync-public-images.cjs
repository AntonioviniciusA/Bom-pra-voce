const fs=require('node:fs');
const path=require('node:path');
const source=path.resolve(__dirname,'../src/images/library/bom-pra-voce-novo/public');
for(const name of fs.readdirSync(source))fs.copyFileSync(path.join(source,name),path.resolve(__dirname,'../public',name));
