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
 await waitFor(()=>expect(productCampaignRequest).toHaveBeenCalledWith('publish',expect.objectContaining({items:[expect.objectContaining({product})]}),4,expect.any(Function)));
 expect(save).toHaveBeenCalledOnce();expect(await screen.findByText(/Campanha publicada\./)).toBeTruthy();
});
test('a failed local save never publishes remotely',async()=>{
 productCampaignRequest.mockResolvedValue([]);render(<ProductPublication campaign={campaign} catalog={[product]} beforePublish={async()=>{throw new Error('Falha ao salvar')}}/>);
 fireEvent.click(screen.getByRole('button',{name:'Conferir estado no site'}));await screen.findByText('Estado de publicação conferido.');
 fireEvent.click(screen.getByRole('button',{name:'Publicar campanha no site'}));await screen.findByText(/Falha ao salvar/);
 expect(productCampaignRequest.mock.calls.map(c=>c[0])).toEqual(['list']);
});
test('unapproved photos cannot be published even after checking the server',async()=>{
 productCampaignRequest.mockResolvedValue([]);render(<ProductPublication campaign={campaign} catalog={[{...product,imageApproved:false}]} beforePublish={vi.fn()}/>);
 fireEvent.click(screen.getByRole('button',{name:'Conferir estado no site'}));await screen.findByText('Estado de publicação conferido.');
 expect(screen.getByRole('button',{name:'Publicar campanha no site'}).disabled).toBe(true);
});
