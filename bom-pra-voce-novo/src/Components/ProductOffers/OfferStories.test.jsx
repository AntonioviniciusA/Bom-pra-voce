import {act, fireEvent, render, screen} from '@testing-library/react';
import OfferStories from './OfferStories';

const campaign={id:'campaign',title:'Ofertas da semana'};
const items=[
  {id:'1',priceCents:599,unit:'un',product:{name:'Arroz',brand:'Marca A',category:'mercearia'}},
  {id:'2',priceCents:799,unit:'kg',product:{name:'Feijão',category:'mercearia'}},
];

function openGrocery() {
  fireEvent.click(screen.getByRole('button',{name:'Ver stories de Mercearia'}));
}

function finishTour() {
  fireEvent.click(screen.getByRole('button',{name:'Começar stories'}));
}

afterEach(()=>{
  document.body.classList.remove('offer-story-open');
  jest.useRealTimers();
});

test('renders one external story per category, not one per product',()=>{
  const categorized=[...items,{id:'3',priceCents:999,unit:'un',product:{name:'Sabão',category:'limpeza'}}];
  render(<OfferStories campaign={campaign} items={categorized}/>);
  expect(screen.getByRole('button',{name:'Ver stories de Mercearia'})).toHaveTextContent('2 ofertas');
  expect(screen.getByRole('button',{name:'Ver stories de Limpeza'})).toHaveTextContent('1 oferta');
  expect(screen.queryByRole('button',{name:/Ver oferta de/})).not.toBeInTheDocument();
  expect(screen.queryByText('Arroz')).not.toBeInTheDocument();
});

test('maps every category id to its matching story cover',()=>{
  const categories=[
    ['hortifruti','Hortifruti','stories-hortifruti.webp'],
    ['acougue','Açougue','stories-acougue-carnes.webp'],
    ['mercearia','Mercearia','stories-mercearia.webp'],
    ['bebidas','Bebidas','stories-bebidas.webp'],
    ['limpeza','Limpeza','stories-limpeza.webp'],
    ['higiene','Higiene e beleza','stories-higiene-pessoal.webp'],
    ['padaria','Padaria','stories-padaria.webp'],
    ['frios','Frios e congelados','stories-frios-laticinios.webp'],
    ['utilidades','Utilidades','stories-utilidades-domesticas.webp'],
  ];
  const categorized=categories.map(([category],index)=>({
    id:String(index + 1),priceCents:999,unit:'un',product:{name:'Produto '+index,category},
  }));

  render(<OfferStories campaign={campaign} items={categorized}/>);

  categories.forEach(([,label,cover])=>{
    const button=screen.getByRole('button',{name:'Ver stories de '+label});
    expect(button.querySelector('.offer-stories__ring img')).toHaveAttribute('src',cover);
  });
});

test('runs Guided Tour once and loops back to the first category after the last offer',()=>{
  jest.useFakeTimers();
  const categorized=[...items,{id:'3',priceCents:999,unit:'un',product:{name:'Sabão',category:'limpeza'}}];
  render(<OfferStories campaign={campaign} items={categorized}/>);
  openGrocery();
  const dialog=screen.getByRole('dialog',{name:'Oferta de Arroz em Mercearia'});
  expect(dialog).toBeInTheDocument();
  expect(dialog.parentElement).toBe(document.body);
  expect(screen.getByRole('heading',{name:'Navegue como nos stories'})).toBeInTheDocument();
  expect(screen.getByRole('button',{name:'Começar stories'})).toHaveFocus();
  expect(screen.getByRole('button',{name:'Pular tour e começar stories'})).toBeInTheDocument();
  act(()=>jest.advanceTimersByTime(7000));
  expect(screen.getByRole('dialog',{name:'Oferta de Arroz em Mercearia'})).toBeInTheDocument();
  finishTour();
  expect(screen.getByRole('progressbar',{name:'1 de 2: Arroz'})).toBeInTheDocument();
  act(()=>jest.advanceTimersByTime(7000));
  expect(screen.getByRole('dialog',{name:'Oferta de Feijão em Mercearia'})).toBeInTheDocument();
  act(()=>jest.advanceTimersByTime(7000));
  expect(screen.getByRole('dialog',{name:'Oferta de Sabão em Limpeza'})).toBeInTheDocument();
  act(()=>jest.advanceTimersByTime(7000));
  expect(screen.getByRole('dialog',{name:'Oferta de Arroz em Mercearia'})).toBeInTheDocument();
  expect(screen.getByRole('progressbar',{name:'1 de 2: Arroz'})).toBeInTheDocument();
});

test('lets the user skip the tour and moves focus back to the story controls',()=>{
  render(<OfferStories campaign={campaign} items={items}/>);
  openGrocery();
  fireEvent.click(screen.getByRole('button',{name:'Pular tour e começar stories'}));
  expect(screen.queryByRole('heading',{name:'Navegue como nos stories'})).not.toBeInTheDocument();
  expect(screen.getByRole('button',{name:'Fechar stories'})).toHaveFocus();
  expect(screen.getByRole('button',{name:'Pausar story'})).toBeInTheDocument();
});

test('pauses and resumes without losing the remaining story time',()=>{
  jest.useFakeTimers();
  render(<OfferStories campaign={campaign} items={items}/>);
  openGrocery();
  finishTour();
  act(()=>jest.advanceTimersByTime(2500));
  fireEvent.click(screen.getByRole('button',{name:'Pausar story'}));
  expect(screen.getByRole('status',{name:'Story pausado'})).toBeInTheDocument();
  act(()=>jest.advanceTimersByTime(7000));
  expect(screen.getByRole('dialog',{name:'Oferta de Arroz em Mercearia'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Retomar story'}));
  act(()=>jest.advanceTimersByTime(4499));
  expect(screen.getByRole('dialog',{name:'Oferta de Arroz em Mercearia'})).toBeInTheDocument();
  act(()=>jest.advanceTimersByTime(1));
  expect(screen.getByRole('dialog',{name:'Oferta de Feijão em Mercearia'})).toBeInTheDocument();
});

test('temporarily pauses on press and hold without treating the hold as navigation',()=>{
  jest.useFakeTimers();
  render(<OfferStories campaign={campaign} items={items}/>);
  openGrocery();
  finishTour();
  const next=screen.getByRole('button',{name:'Próxima oferta'});
  fireEvent.pointerDown(next,{pointerType:'touch'});
  expect(screen.getByRole('status',{name:'Story pausado'})).toBeInTheDocument();
  act(()=>jest.advanceTimersByTime(500));
  fireEvent.pointerUp(next,{pointerType:'touch'});
  expect(screen.getByRole('dialog',{name:'Oferta de Arroz em Mercearia'})).toBeInTheDocument();
  expect(screen.queryByRole('status',{name:'Story pausado'})).not.toBeInTheDocument();
});

test('supports keyboard-style previous and next controls after the tour',()=>{
  render(<OfferStories campaign={campaign} items={items}/>);
  openGrocery();
  finishTour();
  fireEvent.click(screen.getByRole('button',{name:'Próxima oferta'}),{detail:0});
  expect(screen.getByRole('dialog',{name:'Oferta de Feijão em Mercearia'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Oferta anterior'}),{detail:0});
  expect(screen.getByRole('dialog',{name:'Oferta de Arroz em Mercearia'})).toBeInTheDocument();
});

test('uses the Black Friday artwork, campaign dates and real product data',()=>{
  render(<OfferStories campaign={{...campaign,title:'Semana Black Friday',theme_key:'black-friday',startDate:'2026-11-23',endDate:'2026-11-29'}} items={items}/>);
  openGrocery();
  const dialog=screen.getByRole('dialog',{name:'Oferta de Arroz em Mercearia'});
  expect(dialog).toHaveClass('offer-story-viewer--black-friday');
  expect(screen.getByText('Black Friday')).toBeInTheDocument();
  expect(screen.getByText('De 23 a 29/11/2026')).toBeInTheDocument();
  expect(screen.getByRole('img',{name:'Bom pra você Supermercado'})).toHaveAttribute('src', 'logo_bom_pra_voce_vetorizada.svg');
  expect(dialog).toHaveTextContent('R$ 5,99');
});
