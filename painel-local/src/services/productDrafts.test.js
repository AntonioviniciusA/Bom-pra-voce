import {describe,expect,test} from 'vitest';
import {mergeProductChanges} from './productDrafts';

describe('conciliação do catálogo de produtos',()=>{
 test('preserva a categoria editada localmente quando outro campo mudou no servidor',()=>{
  const base={id:'p1',revision:2,remoteRevision:4,name:'Produto',category:'mercearia',brand:'Marca antiga'};
  const local={...base,revision:3,category:'higiene'};
  const remote={...base,remoteRevision:5,brand:'Marca atualizada'};
  const result=mergeProductChanges(base,local,remote);
  expect(result).toMatchObject({category:'higiene',brand:'Marca atualizada',revision:3,remoteRevision:5,conflicts:[]});
 });

 test('não sobrescreve quando o mesmo campo mudou de formas diferentes',()=>{
  const base={id:'p1',revision:2,remoteRevision:4,category:'mercearia'};
  const result=mergeProductChanges(base,{...base,revision:3,category:'higiene'},{...base,remoteRevision:5,category:'limpeza'});
  expect(result.conflicts).toEqual(['category']);
 });
});
