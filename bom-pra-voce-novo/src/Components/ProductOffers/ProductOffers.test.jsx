import {fireEvent,render,screen} from '@testing-library/react';
import ProductOffers from './ProductOffers';
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


