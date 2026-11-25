const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../docs');let checked=0;const broken=[];
function visit(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
 const file=path.join(dir,e.name);if(e.isDirectory()){visit(file);continue;}
 if(!/\.(md|html|json)$/.test(e.name))continue;
 const content=fs.readFileSync(file,'utf8');
 for(const match of content.matchAll(/(?:\]\(|(?:src|href)=["']|"file"\s*:\s*")([^\s"'<>)]*\.(?:png|webp|jpe?g|svg|ico))/g)){
  if(/^(https?:|data:)/.test(match[1]))continue;checked++;
  if(!fs.existsSync(path.resolve(dir,match[1])))broken.push(`${file}: ${match[1]}`);
 }
}}
visit(root);if(broken.length)throw Error(broken.join('\n'));console.log(`PASS: ${checked} document image references resolve`);
