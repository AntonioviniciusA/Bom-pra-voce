import React from 'react';
import {afterEach,expect,test,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import ProductCampaigns from './ProductCampaigns';
import * as drafts from './services/productDrafts';
vi.mock('./services/productDrafts',()=>({loadWorkspace:vi.fn(),saveWorkspace:vi.fn(),emptyWorkspace:()=>({revision:0,catalog:[],campaigns:[]}),readProductImage:vi.fn()}));
afterEach(()=>{cleanup();vi.clearAllMocks()});
test('prepares November once and preserves an edited November draft',async()=>{
 drafts.loadWorkspace.mockResolvedValue({revision:0,catalog:[],campaigns:[]});drafts.saveWorkspace.mockImplementation(async data=>({...data,revision:1}));
 render(<ProductCampaigns/>);fireEvent.click(await screen.findByRole('button',{name:'Preparar novembro'}));
 expect(screen.getByLabelText('Nome da campanha').value).toBe('Esquenta Black Friday');
 expect(screen.getByLabelText('Primeiro dia').value).toBe('2026-11-01');
 fireEvent.change(screen.getByLabelText('Nome da campanha'),{target:{value:'Novembro da loja'}});
 fireEvent.click(screen.getByRole('button',{name:'Preparar novembro'}));
 fireEvent.click(screen.getByRole('button',{name:'Salvar rascunhos locais'}));
 await waitFor(()=>expect(drafts.saveWorkspace).toHaveBeenCalledWith(expect.objectContaining({campaigns:[expect.objectContaining({title:'Novembro da loja',theme_key:'black-friday',templateKey:'novembro-2026-esquenta',items:[]}),expect.objectContaining({title:'Semana Black Friday',startDate:'2026-11-23',endDate:'2026-11-29',items:[]})]})));
});
test('creates October draft and saves locally without a publication action',async()=>{
 drafts.loadWorkspace.mockResolvedValue({revision:0,catalog:[],campaigns:[]});drafts.saveWorkspace.mockImplementation(async data=>({...data,revision:1}));
 render(<ProductCampaigns/>);fireEvent.click(await screen.findByRole('button',{name:'Nova campanha'}));fireEvent.change(screen.getByLabelText('Nome da campanha'),{target:{value:'Outubro local'}});fireEvent.click(screen.getByRole('button',{name:'Salvar rascunhos locais'}));
 await waitFor(()=>expect(drafts.saveWorkspace).toHaveBeenCalledWith(expect.objectContaining({campaigns:[expect.objectContaining({title:'Outubro local',theme_key:'outubro-rosa',items:[]})]})));
 expect(await screen.findByText('Rascunho salvo neste computador. Não publicado no site.')).toBeTruthy();
});
test('keeps a failed save visible and preserves edited data',async()=>{
 drafts.loadWorkspace.mockResolvedValue({revision:3,catalog:[],campaigns:[]});drafts.saveWorkspace.mockRejectedValue(new Error('Conflito de revisão'));
 render(<ProductCampaigns/>);fireEvent.click(await screen.findByRole('button',{name:'Nova campanha'}));fireEvent.change(screen.getByLabelText('Nome da campanha'),{target:{value:'Não perder'}});fireEvent.click(screen.getByRole('button',{name:'Salvar rascunhos locais'}));
 expect(await screen.findByText('Conflito de revisão')).toBeTruthy();expect(screen.getByLabelText('Nome da campanha').value).toBe('Não perder');
});
test('stores two fragrances with separate GTINs and keeps the campaign dates editable',async()=>{
 drafts.loadWorkspace.mockResolvedValue({revision:0,catalog:[],campaigns:[]});drafts.saveWorkspace.mockImplementation(async data=>({...data,revision:1}));
 render(<ProductCampaigns/>);fireEvent.click(await screen.findByRole('button',{name:'Nova campanha'}));
 fireEvent.change(screen.getByLabelText('Último dia (inclusive)'),{target:{value:'2090-01-31'}});
 fireEvent.click(screen.getByRole('button',{name:'Produtos',exact:true}));fireEvent.click(screen.getByRole('button',{name:'Cadastrar produto'}));
 fireEvent.change(screen.getByLabelText('Nome do produto'),{target:{value:'Desodorante'}});
 fireEvent.change(screen.getByLabelText('Código interno'),{target:{value:'001'}});
 fireEvent.change(screen.getByLabelText('Marca'),{target:{value:'Giovanna Baby'}});
 fireEvent.change(screen.getByLabelText('Conteúdo da embalagem (ex.: 150 ml)'),{target:{value:'150 ml'}});
 fireEvent.change(screen.getByLabelText('Fragrância 1'),{target:{value:'Classic'}});
 fireEvent.change(screen.getByLabelText('Código de barras da fragrância 1'),{target:{value:'7896044949510'}});
 fireEvent.click(screen.getByRole('button',{name:'Adicionar fragrância'}));
 fireEvent.change(screen.getByLabelText('Fragrância 2'),{target:{value:'Blue'}});
 fireEvent.change(screen.getByLabelText('Código de barras da fragrância 2'),{target:{value:'00012345600012'}});
 fireEvent.click(screen.getByRole('button',{name:'Guardar no rascunho'}));
 fireEvent.click(screen.getByRole('button',{name:'Salvar rascunhos locais'}));
 await waitFor(()=>expect(drafts.saveWorkspace).toHaveBeenCalledWith(expect.objectContaining({campaigns:[expect.objectContaining({endDate:'2090-01-31'})],catalog:[expect.objectContaining({fragrances:[{name:'Classic',barcode:'7896044949510'},{name:'Blue',barcode:'00012345600012'}]})]})));
});
