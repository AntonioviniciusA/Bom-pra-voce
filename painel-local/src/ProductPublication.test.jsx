import React from 'react';
import {afterEach,expect,test,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import ProductPublication from './ProductPublication';
import {productCampaignRequest} from './services/adminApi';
vi.mock('./services/adminApi',()=>({productCampaignRequest:vi.fn()}));
vi.mock('./services/sensitiveAction',()=>({requireSensitiveAction:vi.fn(async()=>true)}));
afterEach(()=>{cleanup();vi.resetAllMocks();});
const product={id:'p',revision:1,name:'Maçã',code:'001',identifierType:'plu',noGtinReason:'Venda por peso',category:'hortifruti',image:'photo',imageSource:'Própria',imageAuthorized:true,imageApproved:true};
const campaign={id:'c',title:'Semana',startDate:'2090-01-01',endDate:'2090-01-02',conditions:'Enquanto durarem os estoques',items:[{id:'i',productId:'p',priceCents:599,unit:'kg',expiresOn:'2090-02-01'}]};
test('requires checking remote revision and saving before publishing a snapshot',async()=>{
 const save=vi.fn(async()=>{});productCampaignRequest.mockResolvedValueOnce([{id:'c',revision:4,state:'published',title:'Semana'}]).mockResolvedValueOnce({id:'c',revision:5,state:'published'});
 render(<ProductPublication campaign={campaign} catalog={[product]} beforePublish={save}/>);
 expect(screen.getByRole('button',{name:'Publicar campanha no site'}).disabled).toBe(true);
 fireEvent.click(screen.getByRole('button',{name:'Conferir estado no site'}));
 fireEvent.click(await screen.findByRole('button',{name:'Publicar nova revisão'}));
 expect(screen.getByRole('dialog',{name:'Confirmar lançamento no site?'})).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Confirmar lançamento'}));
 await waitFor(()=>expect(productCampaignRequest).toHaveBeenCalledWith('publish',expect.objectContaining({items:[expect.objectContaining({product:expect.objectContaining(product)})]}),4,expect.any(Function),undefined));
 expect(save).toHaveBeenCalledOnce();expect(await screen.findByText(/Campanha publicada\./)).toBeTruthy();expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('100');
});
test('a failed local save never publishes remotely',async()=>{
 productCampaignRequest.mockResolvedValue([]);render(<ProductPublication campaign={campaign} catalog={[product]} beforePublish={async()=>{throw new Error('Falha ao salvar')}}/>);
 fireEvent.click(screen.getByRole('button',{name:'Conferir estado no site'}));await screen.findByText('Estado de publicação conferido.');
 fireEvent.click(screen.getByRole('button',{name:'Publicar campanha no site'}));fireEvent.click(screen.getByRole('button',{name:'Confirmar lançamento'}));await screen.findByText(/Falha ao salvar/);
 expect(productCampaignRequest.mock.calls.map(c=>c[0])).toEqual(['list']);
});
test('unapproved photos cannot be published even after checking the server',async()=>{
 productCampaignRequest.mockResolvedValue([]);render(<ProductPublication campaign={campaign} catalog={[{...product,imageApproved:false}]} beforePublish={vi.fn()}/>);
 fireEvent.click(screen.getByRole('button',{name:'Conferir estado no site'}));await screen.findByText('Estado de publicação conferido.');
 expect(screen.getByRole('button',{name:'Publicar campanha no site'}).disabled).toBe(true);
});
test('publishes ready products and keeps incomplete products out of the snapshot',async()=>{
 const pending={...product,id:'pending',code:'002',name:'Café',imageApproved:false};
 const mixed={...campaign,items:[...campaign.items,{id:'pending-item',productId:'pending',priceCents:1299,unit:'un',expiresOn:'2090-02-01'}]};
 productCampaignRequest.mockResolvedValueOnce([]).mockResolvedValueOnce({id:'c',revision:1,state:'published'});
 render(<ProductPublication campaign={mixed} catalog={[product,pending]} beforePublish={vi.fn(async()=>{})}/>);
 expect(screen.getByText(/1 produto ficará pendente/)).toBeTruthy();
 expect(screen.getByRole('heading',{name:'Serão publicados agora'})).toBeTruthy();
 expect(screen.getByRole('heading',{name:'Não serão publicados'})).toBeTruthy();
 expect(screen.getByText('Café')).toBeTruthy();
 expect(screen.getByText(/Revise e aprove a foto/)).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Conferir estado no site'}));await screen.findByText('Estado de publicação conferido.');
 fireEvent.click(screen.getByRole('button',{name:'Publicar campanha no site'}));
 fireEvent.click(screen.getByRole('button',{name:'Confirmar lançamento'}));
 await waitFor(()=>expect(productCampaignRequest).toHaveBeenLastCalledWith('publish',expect.objectContaining({items:[expect.objectContaining({id:'i'})]}),0,expect.any(Function),undefined));
 expect(productCampaignRequest.mock.calls[1][1].items).toHaveLength(1);
});

test('reports a server rejection at 90 percent and enables checking again',async()=>{
 productCampaignRequest.mockResolvedValueOnce([{id:'c',revision:4,state:'published',title:'Semana'}]).mockImplementationOnce(async(action,snapshot,revision,progress)=>{
  progress('Pedido enviado',90);throw Object.assign(new Error('Revise os textos.'),{status:422,remoteCode:'INVALID_CAMPAIGN'});
 });
 render(<ProductPublication campaign={campaign} catalog={[product]} beforePublish={async()=>{}}/>);
 fireEvent.click(screen.getByRole('button',{name:'Conferir estado no site'}));
 fireEvent.click(await screen.findByRole('button',{name:'Publicar nova revisão'}));
 fireEvent.click(screen.getByRole('button',{name:'Confirmar lançamento'}));
 expect(await screen.findByText('Envio recusado pelo site.')).toBeTruthy();
 expect(screen.getByRole('button',{name:'Conferir estado no site'}).disabled).toBe(false);
 expect(screen.getByRole('button',{name:'Publicar campanha no site'}).disabled).toBe(true);
 expect(screen.queryByText(/Campanha publicada\./)).toBeNull();
});
