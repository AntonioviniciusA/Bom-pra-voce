const fs = require('node:fs');
const path = require('node:path');
for (const name of ['preparar.cjs', 'galeria.html']) {
 const file = path.join(__dirname, name);
 if (!fs.existsSync(file)) continue;
 let text = fs.readFileSync(file, 'utf8');
 text = text.replace('padding:26px 110px', 'padding:26px 180px');
 text = text.replace("safe.className='safe';const title", "safe.className='safe';if(inst&&f==='story')safe.style.paddingRight='48px';const title");
 text = text.replace("stage.append(img);if(f==='notebook'", "stage.append(img);if(f==='story'){const r=(stage.clientWidth-2)/1080;stage.style.height=(1920*r+2)+'px';stage.style.padding=(250*r)+'px '+(60*r)+'px';safe.style.height=(1420*r)+'px';img.style.width=img.style.height=((inst?150:240)*r)+'px';img.style.right=((inst?100:20)*r)+'px';img.style.top=((inst?270:0)*r)+'px'}else{stage.style.height='';stage.style.padding=''}if(f==='notebook'");
 text = text.replace("selector.focus()}));render();", "selector.focus()}));window.addEventListener('resize',render);render();");
 fs.writeFileSync(file, text);
}
