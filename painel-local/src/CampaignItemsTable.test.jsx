import React from 'react';
import {afterEach,expect,test,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import CampaignItemsTable from './CampaignItemsTable';
afterEach(cleanup);
const catalog=[{id:'a',name:'Arroz',code:'001',imageApproved:false},{id:'b',name:'Café',code:'002',imageApproved:false}];
const campaign={items:[{id:'ia',productId:'a',priceCents:1999,unit:'un'},{id:'ib',productId:'b',priceCents:0,unit:'un'}]};
function setup(){const onChange=vi.fn(),onMove=vi.fn();render(<CampaignItemsTable campaign={campaign} catalog={catalog} onChange={onChange} onMove={onMove} onEdit={vi.fn()} onAdd={vi.fn()}/>);return {onChange,onMove};}
test('filters missing prices and selects only the visible products',()=>{
 setup();fireEvent.click(screen.getByRole('button',{name:/Sem preço/}));expect(screen.queryByText('Arroz')).toBeNull();expect(screen.getByText('Café')).toBeTruthy();fireEvent.click(screen.getByLabelText('Selecionar produtos visíveis'));expect(screen.getByText('1 selecionados')).toBeTruthy();fireEvent.click(screen.getByRole('button',{name:/Todos/}));expect(screen.getByLabelText('Selecionar Arroz').checked).toBe(false);
});
test('finds exact code and updates cents without changing other products',()=>{
 const {onChange}=setup();fireEvent.change(screen.getByPlaceholderText('Buscar por nome, marca, fragrância ou código'),{target:{value:'001'}});expect(screen.queryByText('Café')).toBeNull();fireEvent.change(screen.getByLabelText('Preço de Arroz'),{target:{value:'20.49'}});expect(onChange).toHaveBeenCalledWith({items:[{...campaign.items[0],priceCents:2049},campaign.items[1]]});
});
test('reordering and removal target the original item after filtering',()=>{
 const {onChange,onMove}=setup();fireEvent.change(screen.getByPlaceholderText('Buscar por nome, marca, fragrância ou código'),{target:{value:'002'}});fireEvent.click(screen.getByLabelText('Subir Café'));expect(onMove).toHaveBeenCalledWith(1,-1);fireEvent.click(screen.getByLabelText('Remover Café'));expect(onChange).toHaveBeenCalledWith({items:[campaign.items[0]]});
});
test('edits the lot expiry separately from the campaign period',()=>{
 const {onChange}=setup();fireEvent.change(screen.getByLabelText('Vencimento do lote de Arroz'),{target:{value:'2090-01-31'}});
 expect(onChange).toHaveBeenCalledWith({items:[{...campaign.items[0],expiresOn:'2090-01-31'},campaign.items[1]]});
});
