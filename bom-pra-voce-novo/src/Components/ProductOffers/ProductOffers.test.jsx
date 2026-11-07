import {act,fireEvent,render,screen} from '@testing-library/react';
import ProductOffers from './ProductOffers';
jest.mock('./StoryButton',()=>({item,preview})=><button type="button" disabled={preview} aria-label={`Compartilhar ${item.product.name}`}>Compartilhar</button>);
const campaign={id:'c',title:'Semana',theme_key:'outubro-rosa',startDate:'2026-10-01',endDate:'2026-10-31',items:[{id:'i1',priceCents:599,unit:'kg',product:{id:'p1',name:'Produto A',code:'001',category:'hortifruti'}},{id:'i2',priceCents:1399,unit:'un',product:{id:'p2',name:'Produto B',code:'002',category:'limpeza'}}]};
test('filters by category and code without replacing item identity',()=>{render(<ProductOffers campaign={campaign} preview/>);fireEvent.click(screen.getByRole('button',{name:'Limpeza e beleza',exact:true}));expect(screen.queryByText('Produto A')).not.toBeInTheDocument();expect(screen.getByText('Produto B')).toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:'Limpar filtros'}));fireEvent.change(screen.getByRole('textbox',{name:'Buscar produto ou código'}),{target:{value:'001'}});expect(screen.getByText('Produto A')).toBeInTheDocument();expect(screen.queryByText('Produto B')).not.toBeInTheDocument();expect(screen.getByRole('complementary',{name:'Comunicação institucional: Outubro Rosa'})).toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:'Compartilhar ofertas'}));expect(screen.getByText(/Esta é uma prévia/)).toBeInTheDocument();});
test('shows brand, both fragrances, package content and lot expiry without mixing it with the offer period',()=>{
 const product={id:'p',name:'Desodorante Aerossol',brand:'Giovanna Baby',content:'150 ml',code:'001',category:'higiene',fragrances:[{name:'Classic',barcode:'7896044949510'},{name:'Blue',barcode:'00012345600012'}]};
 const offer={...campaign,items:[{id:'i',priceCents:1999,unit:'un',expiresOn:'2026-12-15',product}]};
 render(<ProductOffers campaign={offer} preview/>);
 expect(screen.getByText('Giovanna Baby')).toBeInTheDocument();
 expect(screen.getByText('Fragrâncias: Classic / Blue')).toBeInTheDocument();
 expect(screen.getByText('Embalagem: 150 ml')).toBeInTheDocument();
 fireEvent.click(screen.getByText('Detalhes'));
 expect(screen.getByText('GTIN Classic: 7896044949510')).toBeInTheDocument();
 expect(screen.getByText('GTIN Blue: 00012345600012')).toBeInTheDocument();
 expect(screen.getByText('Vencimento do lote: 15/12/2026')).toBeInTheDocument();
 expect(screen.getByText('Oferta: De 01 a 31/10/2026')).toBeInTheDocument();
});
test('shows eight products per page and resets pagination after a search',()=>{
 const items=Array.from({length:9},(_,index)=>({id:`i${index+1}`,priceCents:100,unit:'un',product:{id:`p${index+1}`,name:`Produto ${index+1}`,code:`00${index+1}`,category:'mercearia'}}));
 render(<ProductOffers campaign={{...campaign,items}} preview/>);
 expect(screen.getByText('Produto 8')).toBeInTheDocument();
 expect(screen.queryByText('Produto 9')).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'Próxima'}));
 expect(screen.getByText('Página 2 de 2')).toBeInTheDocument();
 expect(screen.getByText('Produto 9')).toBeInTheDocument();
 fireEvent.change(screen.getByRole('textbox',{name:'Buscar produto ou código'}),{target:{value:'Produto 1'}});
 expect(screen.getByText('Produto 1')).toBeInTheDocument();
 expect(screen.queryByText('Página 2 de 2')).not.toBeInTheDocument();
});



test('shows four products on mobile, navigates and adjusts when the viewport changes',()=>{
 const original=window.matchMedia;
 let change;
 const media={matches:true,addEventListener:jest.fn((event,listener)=>{change=listener}),removeEventListener:jest.fn()};
 window.matchMedia=jest.fn(()=>media);
 const items=Array.from({length:9},(_,index)=>({id:`mobile-${index}`,priceCents:100,unit:'un',product:{id:`p${index}`,name:`Oferta ${index+1}`,code:`00${index+1}`,category:'mercearia'}}));
 let view;
 try{
  view=render(<ProductOffers campaign={{...campaign,items}} preview/>);
  expect(screen.getAllByRole('article')).toHaveLength(4);
  expect(screen.getByText('Página 1 de 3')).toBeInTheDocument();
  expect(screen.queryByText('Oferta 5')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Próxima'}));
  expect(screen.getByText('Oferta 5')).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(4);
  fireEvent.click(screen.getByRole('button',{name:'Próxima'}));
  expect(screen.getByText('Oferta 9')).toBeInTheDocument();
  expect(screen.getByRole('button',{name:'Próxima'})).toBeDisabled();
  act(()=>{media.matches=false;change();});
  expect(screen.getByText('Página 1 de 2')).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(8);
  act(()=>{media.matches=true;change();});
  expect(screen.getAllByRole('article')).toHaveLength(4);
  fireEvent.change(screen.getByRole('textbox',{name:'Buscar produto ou código'}),{target:{value:'009'}});
  expect(screen.getByText('Oferta 9')).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(1);
 }finally{view?.unmount();window.matchMedia=original;}
 expect(media.removeEventListener).toHaveBeenCalledWith('change',change);
});

test('shared product link opens the requested product and can clear the filter',()=>{
 window.history.replaceState({},'', '/?campanha=c&produto=p2#promocoes-c');
 try{render(<ProductOffers campaign={campaign}/>);expect(screen.getByText('Produto B')).toBeInTheDocument();expect(screen.queryByText('Produto A')).not.toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:'Limpar filtros'}));expect(screen.getByText('Produto A')).toBeInTheDocument();}
 finally{window.history.replaceState({},'', '/');}
});
test('keeps the artwork share action in the top product control',()=>{
 render(<ProductOffers campaign={campaign}/>);
 expect(screen.getByRole('button',{name:'Compartilhar Produto B'})).toBeEnabled();
 expect(screen.queryByText('Preparar arte para compartilhar')).not.toBeInTheDocument();
});
