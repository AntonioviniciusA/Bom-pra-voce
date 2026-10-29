// Preserve originals; encode transparent delivery assets without retouching.
const sharp=require('C:/Users/anton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const path=require('path');
const dir=path.resolve(__dirname,'../../../bom-pra-voce-novo/src/images/offer-themes');
(async()=>{for(const name of ['black-friday-carrinho-3d','black-friday-brilhos-3d']){const info=await sharp(path.join(dir,name+'.png')).resize({width:400,withoutEnlargement:true}).webp({quality:92,alphaQuality:100}).toFile(path.join(dir,name+'.webp'));console.log(name,info.size);}})();
