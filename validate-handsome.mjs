import fs from 'node:fs';
import path from 'node:path';
const root=import.meta.dirname;
let errors=[];
const read=(rel)=>fs.readFileSync(path.join(root,rel),'utf8');
const file=(rel)=>fs.existsSync(path.join(root,rel));
for(const dir of ['templates','config','locales','sections']){
  for(const name of fs.readdirSync(path.join(root,dir))){
    const rel=dir+'/'+name;
    if(name.endsWith('.json')){
      try{JSON.parse(read(rel))}catch(e){errors.push(rel+': '+e.message)}
    }
    if(dir==='sections'&&name.endsWith('.liquid')){
      const code=read(rel),match=code.match(/{% schema %}([\s\S]*?){% endschema %}/);
      if(!match){if(name.startsWith('handsome-'))errors.push(rel+': missing schema');continue}
      try{
        const schema=JSON.parse(match[1]);
        if(!schema.name) errors.push(rel+': missing name');
        if(name.startsWith('handsome-')&&schema.name.length>25) errors.push(rel+': name exceeds 25 chars');
        const ids=new Set();
        for(const s of schema.settings||[]){if(!s.id)continue;if(ids.has(s.id))errors.push(rel+': duplicate setting '+s.id);ids.add(s.id)}
      }catch(e){errors.push(rel+': schema '+e.message)}
    }
  }
}
for(const name of fs.readdirSync(path.join(root,'templates')).filter(x=>x.endsWith('.json'))){
  const rel='templates/'+name,t=JSON.parse(read(rel));
  if(!t.sections||!t.order)errors.push(rel+': sections/order missing');
  for(const id of t.order||[]){
    if(!t.sections[id])errors.push(rel+': unknown ordered section '+id);
  }
  if((t.order||[]).length>25)errors.push(rel+': over 25 sections');
  for(const [id,s] of Object.entries(t.sections||{})){
    if(!file('sections/'+s.type+'.liquid'))errors.push(rel+': missing section '+s.type);
    if(s.blocks&&s.block_order){
      for(const blockId of s.block_order)if(!s.blocks[blockId])errors.push(rel+': missing block '+blockId);
    }
  }
}
for(const name of fs.readdirSync(path.join(root,'sections')).filter(x=>x.endsWith('.json'))){
  const rel='sections/'+name,g=JSON.parse(read(rel));
  for(const s of Object.values(g.sections||{}))if(!file('sections/'+s.type+'.liquid'))errors.push(rel+': missing section '+s.type);
}
const codeDirs=['sections','snippets','layout'];
for(const dir of codeDirs)for(const name of fs.readdirSync(path.join(root,dir)).filter(x=>x.endsWith('.liquid'))){
  const rel=dir+'/'+name,code=read(rel);
  for(const m of code.matchAll(/{%\s*render\s+['"]([^'"]+)['"]/g))if(!file('snippets/'+m[1]+'.liquid'))errors.push(rel+': missing snippet '+m[1]);
  for(const m of code.matchAll(/['"]([^'"]+\.(?:css|js|svg|png|webp|jpg))['"]\s*\|\s*asset_url/g))if(!file('assets/'+m[1]))errors.push(rel+': missing asset '+m[1]);
}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Local structure check passed: JSON, section schemas, section references, snippet references and asset references.');

