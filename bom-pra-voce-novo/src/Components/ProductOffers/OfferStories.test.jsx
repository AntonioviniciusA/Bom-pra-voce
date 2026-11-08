import {act, fireEvent, render, screen} from '@testing-library/react';
import OfferStories from './OfferStories';

const campaign={title:'Ofertas da semana'};
const items=[
  {id:'1',priceCents:599,unit:'un',product:{name:'Arroz',brand:'Marca A'}},
  {id:'2',priceCents:799,unit:'kg',product:{name:'Feijão'}},
];

test('opens an offer story, explains the controls and advances after seven seconds',()=>{
  jest.useFakeTimers();
  render(<OfferStories campaign={campaign} items={items}/>);
  fireEvent.click(screen.getByRole('button',{name:'Ver oferta de Arroz'}));
  expect(screen.getByRole('dialog',{name:'Oferta de Arroz'})).toBeInTheDocument();
  expect(screen.getByText('Toque nas laterais para avançar ou voltar.')).toBeInTheDocument();
  act(()=>jest.advanceTimersByTime(7000));
  expect(screen.getByRole('dialog',{name:'Oferta de Feijão'})).toBeInTheDocument();
  expect(screen.queryByText('Toque nas laterais para avançar ou voltar.')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Fechar oferta'}));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  act(()=>jest.advanceTimersByTime(20));
  expect(screen.getByRole('button',{name:'Ver oferta de Arroz'})).toHaveFocus();
  jest.useRealTimers();
});

test('supports previous and next controls',()=>{
  render(<OfferStories campaign={campaign} items={items}/>);
  fireEvent.click(screen.getByRole('button',{name:'Ver oferta de Arroz'}));
  fireEvent.click(screen.getByRole('button',{name:'Próxima oferta'}));
  expect(screen.getByRole('dialog',{name:'Oferta de Feijão'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Oferta anterior'}));
  expect(screen.getByRole('dialog',{name:'Oferta de Arroz'})).toBeInTheDocument();
});

test('uses the Black Friday story artwork with the real product data',()=>{
  render(<OfferStories campaign={{...campaign,theme_key:'black-friday',startDate:'2026-11-23',endDate:'2026-11-27'}} items={items}/>);
  fireEvent.click(screen.getByRole('button',{name:'Ver oferta de Arroz'}));
  const dialog=screen.getByRole('dialog',{name:'Oferta de Arroz'});
  expect(dialog).toHaveClass('offer-story-viewer--black-friday');
  expect(screen.getByText('Black Friday')).toBeInTheDocument();
  expect(screen.getByText('De 23 a 27/11/2026')).toBeInTheDocument();
  expect(screen.getByRole('img',{name:'Bom pra você Supermercado'})).toBeInTheDocument();
  expect(dialog).toHaveTextContent('R$ 5,99');
});
