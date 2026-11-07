import React from 'react';
import {afterEach,expect,test,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import OfferCampaignPanel from './OfferCampaignPanel';
import * as drafts from './services/productDrafts';
import * as sensitive from './services/sensitiveAction';
vi.mock('./services/sensitiveAction',()=>({requireSensitiveAction:vi.fn(async()=>true)}));

vi.mock('./services/productDrafts',()=>({
  loadWorkspace:vi.fn(),
  saveWorkspace:vi.fn(),
  emptyWorkspace:()=>({revision:0,catalog:[],campaigns:[]}),
  readProductImage:vi.fn()
}));

afterEach(()=>{cleanup();vi.clearAllMocks();localStorage.clear()});

test('prepares November, opens the campaign and saves it automatically',async()=>{
  drafts.loadWorkspace.mockResolvedValue({revision:0,catalog:[],campaigns:[]});
  drafts.saveWorkspace.mockImplementation(async data=>({...data,revision:data.revision+1}));
  render(<OfferCampaignPanel/>);
  fireEvent.click(await screen.findByRole('button',{name:'Preparar novembro'}));
  expect(await screen.findByRole('heading',{name:'Esquenta Black Friday'})).toBeTruthy();
  await waitFor(()=>expect(drafts.saveWorkspace).toHaveBeenCalledWith(expect.objectContaining({campaigns:expect.arrayContaining([expect.objectContaining({templateKey:'novembro-2026-esquenta'}),expect.objectContaining({templateKey:'novembro-2026-semana'})])})));
});

test('keeps catalogue and campaign navigation as separate pages',async()=>{
  drafts.loadWorkspace.mockResolvedValue({revision:0,catalog:[],campaigns:[{id:'campaign',title:'Esquenta Black Friday',theme_key:'black-friday',startDate:'2026-11-01',endDate:'2026-11-22',conditions:'Enquanto durarem os estoques.',items:[]}]});
  drafts.saveWorkspace.mockImplementation(async data=>({...data,revision:data.revision+1}));
  render(<OfferCampaignPanel/>);
  fireEvent.click(await screen.findByRole('button',{name:/Abrir campanha/}));
  expect(screen.getByRole('heading',{name:'Produtos da campanha'})).toBeTruthy();
  fireEvent.click(screen.getAllByRole('button',{name:/Escolher produtos do catálogo/})[0]);
  expect(screen.getByRole('heading',{name:'Produtos'})).toBeTruthy();
  expect(screen.getByText('Adicionando produtos ao')).toBeTruthy();
});

test('imports eligible campaign products from an exact GTIN list',async()=>{
  const ready={id:'product',revision:1,name:'Produto pronto',code:'P-1',barcode:'7897534800212',fragrances:[],identifierType:'gtin',brand:'Marca',content:'500 ml',category:'limpeza',image:'data:image/png;base64,x',imageSource:'Inteligência artificial',imageAuthorized:true,imageApproved:true};
  drafts.loadWorkspace.mockResolvedValue({revision:0,catalog:[ready],campaigns:[{id:'campaign',title:'Campanha',theme_key:'padrao',startDate:'2026-11-01',endDate:'2026-11-30',conditions:'Condições',items:[]}]});
  drafts.saveWorkspace.mockImplementation(async data=>({...data,revision:data.revision+1}));
  render(<OfferCampaignPanel/>);
  fireEvent.click(await screen.findByRole('button',{name:/Abrir campanha/}));
  fireEvent.click(screen.getAllByRole('button',{name:/Escolher produtos do catálogo/})[0]);
  fireEvent.click(screen.getByText('Incluir produtos por lista'));
  fireEvent.change(screen.getByLabelText('Lista de produtos'),{target:{value:'7897534800212\n0000000000000'}});
  expect(screen.getByText('Pronto')).toBeTruthy();
  expect(screen.getByText('Não encontrado')).toBeTruthy();
  fireEvent.click(screen.getByRole('button',{name:/Incluir 1 produto da lista/}));
  expect(await screen.findByRole('heading',{name:'Produtos da campanha'})).toBeTruthy();
});

test('blocks product saving while the selected image is processing',async()=>{
  let finishImage;
  drafts.readProductImage.mockImplementation(()=>new Promise(resolve=>{finishImage=resolve}));
  drafts.loadWorkspace.mockResolvedValue({revision:0,catalog:[],campaigns:[]});
  drafts.saveWorkspace.mockImplementation(async data=>({...data,revision:data.revision+1}));
  render(<OfferCampaignPanel/>);
  fireEvent.click(await screen.findByRole('button',{name:'Produtos'}));
  fireEvent.click(screen.getByRole('button',{name:'Cadastrar produto'}));
  const input=document.querySelector('input[type="file"]');
  fireEvent.change(input,{target:{files:[new File(['image'],'produto.png',{type:'image/png'})]}});
  expect(await screen.findByText('Processando imagem…')).toBeTruthy();
  expect(screen.getByRole('button',{name:'Aguardando imagem…'}).disabled).toBe(true);
  finishImage({image:'data:image/png;base64,x',imageWidth:1200,imageHeight:1200});
  await waitFor(()=>expect(screen.getByRole('button',{name:'Salvar produto'}).disabled).toBe(false));
});

test('preserves a product draft when leaving and discards it only with Cancel',async()=>{
  drafts.loadWorkspace.mockResolvedValue({revision:0,catalog:[],campaigns:[]});
  drafts.saveWorkspace.mockImplementation(async data=>({...data,revision:data.revision+1}));
  render(<OfferCampaignPanel/>);
  fireEvent.click(await screen.findByRole('button',{name:'Produtos'}));
  fireEvent.click(screen.getByRole('button',{name:'Cadastrar produto'}));
  fireEvent.change(screen.getByLabelText('Nome do produto'),{target:{value:'Rascunho preservado'}});
  fireEvent.click(document.querySelector('.offer-back'));
  expect(localStorage.getItem('bpv-product-form-draft-v1')).toContain('Rascunho preservado');
  fireEvent.click(screen.getByRole('button',{name:'Cadastrar produto'}));
  expect(screen.getByLabelText('Nome do produto').value).toBe('Rascunho preservado');
  fireEvent.click(screen.getByRole('button',{name:'Cancelar'}));
  expect(localStorage.getItem('bpv-product-form-draft-v1')).toBeNull();
});

test('shows campaigns and conflicts in the calendar',async()=>{
  drafts.loadWorkspace.mockResolvedValue({revision:0,catalog:[],campaigns:[
    {id:'one',title:'Primeira',theme_key:'padrao',startDate:'2026-11-01',endDate:'2026-11-10',conditions:'Condições',items:[]},
    {id:'two',title:'Segunda',theme_key:'natal',startDate:'2026-11-08',endDate:'2026-11-15',conditions:'Condições',items:[]}
  ]});
  drafts.saveWorkspace.mockImplementation(async data=>({...data,revision:data.revision+1}));
  render(<OfferCampaignPanel/>);
  fireEvent.click(await screen.findByRole('button',{name:'Calendário'}));
  expect(screen.getByRole('heading',{name:'Calendário de campanhas'})).toBeTruthy();
  expect(screen.getAllByText(/Conflito com/)).toHaveLength(2);
});

test('uses one product GTIN without requiring a variant',async()=>{
  drafts.loadWorkspace.mockResolvedValue({revision:0,catalog:[],campaigns:[]});
  drafts.saveWorkspace.mockImplementation(async data=>({...data,revision:data.revision+1}));
  render(<OfferCampaignPanel/>);
  fireEvent.click(await screen.findByRole('button',{name:'Produtos'}));
  fireEvent.click(screen.getByRole('button',{name:/Cadastrar produto/}));
  expect(screen.getByLabelText('GTIN do produto')).toBeTruthy();
  expect(screen.queryByLabelText('Variante 1')).toBeNull();
  expect(screen.getByText(/Variantes e códigos de barras/).textContent).toContain('Opcional');
  const source=screen.getByPlaceholderText('Selecione ou escreva outra origem');
  expect(source.getAttribute('list')).toBe('image-source-options');
  expect(document.querySelector('option[value="Inteligência artificial"]')).toBeTruthy();
});

test('saves a product pending photo review but blocks it from campaign selection',async()=>{
  const pendingProduct={
    id:'pending-product',revision:1,name:'Molho de tomate',code:'7896102503661',
    identifierType:'gtin',barcode:'7896102503661',fragrances:[],brand:'Quero',
    content:'240 g',category:'mercearia',image:'data:image/png;base64,photo',
    imageSource:'Inteligência artificial',imageAuthorized:true,imageApproved:false
  };
  drafts.loadWorkspace.mockResolvedValue({
    revision:0,
    catalog:[pendingProduct],
    campaigns:[{id:'campaign',title:'Campanha',theme_key:'padrao',startDate:'2026-11-04',endDate:'2026-11-10',conditions:'Enquanto durarem os estoques.',items:[]}]
  });
  drafts.saveWorkspace.mockImplementation(async data=>({...data,revision:data.revision+1}));
  render(<OfferCampaignPanel/>);

  fireEvent.click(await screen.findByRole('button',{name:'Produtos'}));
  fireEvent.click(screen.getByRole('button',{name:'Editar'}));
  fireEvent.click(screen.getByRole('button',{name:'Salvar produto'}));

  expect(await screen.findByRole('heading',{name:'Produtos'})).toBeTruthy();
  fireEvent.click(screen.getByRole('button',{name:/Campanhas/}));
  fireEvent.click(screen.getByRole('button',{name:/Abrir campanha/}));
  fireEvent.click(screen.getAllByRole('button',{name:/Escolher produtos do catálogo/})[0]);
  expect(screen.getByRole('checkbox',{name:'Selecionar Molho de tomate'}).disabled).toBe(true);
  expect(screen.getByText('Revisar cadastro')).toBeTruthy();
});

test('keeps the photo checked after a delayed authenticator confirmation',async()=>{
  let confirm;
  sensitive.requireSensitiveAction.mockImplementationOnce(()=>new Promise(resolve=>{confirm=resolve}));
  const pending={id:'pending',revision:1,name:'Produto teste',code:'P-1',barcode:'7897534800212',fragrances:[],identifierType:'gtin',brand:'Marca',content:'500 ml',category:'limpeza',image:'data:image/png;base64,x',imageSource:'Foto própria',imageAuthorized:true,imageApproved:false};
  drafts.loadWorkspace.mockResolvedValue({revision:0,catalog:[pending],campaigns:[]});drafts.saveWorkspace.mockImplementation(async data=>data);
  render(<OfferCampaignPanel/>);fireEvent.click(await screen.findByRole('button',{name:'Produtos'}));fireEvent.click(screen.getByRole('button',{name:'Editar'}));
  const checkbox=screen.getByLabelText('Conferi a foto deste produto');
  fireEvent.click(checkbox);expect(sensitive.requireSensitiveAction).toHaveBeenCalledTimes(1);
  confirm(true);
  await waitFor(()=>expect(checkbox.checked).toBe(true));
  expect(sensitive.requireSensitiveAction).toHaveBeenCalledTimes(1);
});

test('marks a product already in the campaign and prevents adding it twice',async()=>{
  const ready={id:'product',revision:1,name:'Produto pronto',code:'P-1',barcode:'7897534800212',fragrances:[],identifierType:'gtin',brand:'Marca',content:'500 ml',category:'limpeza',image:'data:image/png;base64,x',imageSource:'Foto própria',imageAuthorized:true,imageApproved:true};
  drafts.loadWorkspace.mockResolvedValue({revision:0,catalog:[ready],campaigns:[{id:'campaign',title:'Campanha',theme_key:'padrao',startDate:'2026-11-01',endDate:'2026-11-30',conditions:'Condições',items:[{id:'item',productId:'product',priceCents:100,unit:'un',expiresOn:'2026-12-01'}]}]});
  drafts.saveWorkspace.mockImplementation(async data=>({...data,revision:data.revision+1}));
  render(<OfferCampaignPanel/>);
  fireEvent.click(await screen.findByRole('button',{name:/Abrir campanha/}));
  fireEvent.click(screen.getAllByRole('button',{name:/Adicionar produtos/})[0]);
  expect(screen.getByText('Já adicionado')).toBeTruthy();
  expect(screen.getByRole('checkbox',{name:'Selecionar Produto pronto'}).disabled).toBe(true);
});

test('reviews one image and persists its approval immediately',async()=>{
  const pending={id:'pending',revision:1,name:'Produto pendente',code:'P-2',barcode:'7897534800213',fragrances:[],identifierType:'gtin',brand:'Marca',content:'500 ml',category:'limpeza',image:'data:image/png;base64,x',imageSource:'Foto própria',imageAuthorized:true,imageApproved:false};
  const second={...pending,id:'pending-2',name:'Segundo produto',code:'P-3',barcode:'7897534800214'};
  drafts.loadWorkspace.mockResolvedValue({revision:0,catalog:[pending,second],campaigns:[]});
  drafts.saveWorkspace.mockImplementation(async data=>({...data,revision:data.revision+1}));
  render(<OfferCampaignPanel/>);
  fireEvent.click(await screen.findByRole('button',{name:'Produtos'}));
  fireEvent.click(screen.getAllByRole('button',{name:'Conferir imagem'})[0]);
  expect(await screen.findByRole('heading',{name:'Conferir imagem'})).toBeTruthy();
  expect(screen.getByText(/Produto 1 de 2/)).toBeTruthy();
  expect(screen.getByRole('button',{name:/Próxima imagem/}).disabled).toBe(true);
  fireEvent.click(screen.getByRole('button',{name:'Aprovar esta imagem'}));
  await waitFor(()=>expect(drafts.saveWorkspace).toHaveBeenCalledWith(expect.objectContaining({catalog:expect.arrayContaining([expect.objectContaining({id:'pending',imageApproved:true})])})));
  expect(await screen.findByText('Imagem conferida e salva neste computador.')).toBeTruthy();
  expect(screen.getByText('Conferida')).toBeTruthy();
  fireEvent.click(screen.getByRole('button',{name:/Próxima imagem/}));
  expect(screen.getByRole('heading',{name:/Segundo produto/})).toBeTruthy();
  expect(screen.getByText(/Produto 2 de 2/)).toBeTruthy();
});

test('paginates the product catalogue eight at a time',async()=>{
  const catalog=Array.from({length:9},(_,index)=>({id:`p${index+1}`,revision:1,name:`Produto ${index+1}`,code:`00${index+1}`,identifierType:'plu',noGtinReason:'Produto interno',fragrances:[],brand:'Marca',content:'1 un',category:'mercearia',image:'',imageSource:'',imageAuthorized:false,imageApproved:false}));
  drafts.loadWorkspace.mockResolvedValue({revision:0,catalog,campaigns:[]});drafts.saveWorkspace.mockImplementation(async data=>data);
  render(<OfferCampaignPanel/>);fireEvent.click(await screen.findByRole('button',{name:'Produtos'}));
  expect(screen.getByText(/Produto 8/)).toBeTruthy();expect(screen.queryByText(/Produto 9/)).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'Próxima'}));
  expect(screen.getByText(/Produto 9/)).toBeTruthy();expect(screen.getByText('Página 2 de 2')).toBeTruthy();
});

test('reopens edited prices and creates another campaign reusing the same catalogue product',async()=>{
 const product={id:'p',revision:1,name:'Produto reutilizável',code:'P-1',barcode:'7897534800212',fragrances:[],identifierType:'gtin',brand:'Marca',content:'500 ml',category:'limpeza',image:'data:image/png;base64,x',imageSmall:'data:image/png;base64,x',imageSource:'Foto própria',imageAuthorized:true,imageApproved:true};
 let stored={revision:3,catalog:[product],campaigns:[{id:'c',title:'Campanha existente',theme_key:'padrao',startDate:'2090-01-01',endDate:'2090-01-02',conditions:'Condições',items:[{id:'i',productId:'p',priceCents:500,unit:'un',noExpiry:true,expiresOn:''}]}]};
 drafts.loadWorkspace.mockImplementation(async()=>structuredClone(stored));
 drafts.saveWorkspace.mockImplementation(async data=>{stored=structuredClone({...data,revision:data.revision+1});return stored;});
 const first=render(<OfferCampaignPanel/>);
 fireEvent.click(await screen.findByRole('button',{name:/Abrir campanha/}));
 fireEvent.change(screen.getByLabelText('Nome operacional'),{target:{value:'Campanha editada'}});
 fireEvent.change(screen.getByLabelText('Preço de Produto reutilizável'),{target:{value:'1299'}});
 await waitFor(()=>expect(stored.campaigns[0]).toMatchObject({title:'Campanha editada',items:[{id:'i',productId:'p',priceCents:1299,noExpiry:true}]}));
 first.unmount();render(<OfferCampaignPanel/>);
 fireEvent.click(await screen.findByRole('button',{name:/Abrir campanha/}));
 expect(screen.getByLabelText('Preço de Produto reutilizável').value).toBe('12,99');
 expect(screen.getByLabelText('Produto sem vencimento').checked).toBe(true);
 fireEvent.click(screen.getAllByRole('button',{name:/^Campanhas$/})[0]);
 fireEvent.click(screen.getByRole('button',{name:/Ver catálogo de temas prontos/}));
 fireEvent.click(screen.getByRole('button',{name:'Adicionar produtos'}));
 fireEvent.click(screen.getByRole('checkbox',{name:'Selecionar Produto reutilizável'}));
 fireEvent.click(screen.getByRole('button',{name:/Incluir selecionados/}));
 await waitFor(()=>expect(stored.campaigns).toHaveLength(2));
 await waitFor(()=>expect(stored.campaigns[1].items).toHaveLength(1));
 expect(stored.catalog).toEqual([product]);
 expect(stored.campaigns[0].items[0].priceCents).toBe(1299);
 expect(stored.campaigns[1].items[0]).toMatchObject({productId:'p',priceCents:0});
});
