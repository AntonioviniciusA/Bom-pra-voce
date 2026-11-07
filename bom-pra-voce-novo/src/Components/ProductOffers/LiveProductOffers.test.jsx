import {render,screen,act,cleanup,fireEvent} from '@testing-library/react';
import LiveProductOffers from './LiveProductOffers';
import {getProductShowcase} from '../../services/productShowcase';
jest.mock('../../services/productShowcase',()=>({getProductShowcase:jest.fn()}));
afterEach(()=>{cleanup();jest.useRealTimers();jest.clearAllMocks();localStorage.clear();});
test('shows a stable accessible offer skeleton while loading',()=>{getProductShowcase.mockImplementation(()=>new Promise(()=>{}));render(<LiveProductOffers/>);expect(screen.getByRole('heading',{name:'Preparando as melhores ofertas'})).toBeInTheDocument();expect(screen.getByRole('status')).toHaveTextContent('Conferindo produtos, preços e validade');expect(document.getElementById('promocoes')).toHaveAttribute('aria-busy','true');});
test('does not turn a network failure into an empty campaign',async()=>{getProductShowcase.mockRejectedValue(new Error('offline'));render(<LiveProductOffers/>);expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível');expect(screen.queryByText(/próximas ofertas estão/)).not.toBeInTheDocument();});
test('retries loading the offers after an error',async()=>{getProductShowcase.mockRejectedValueOnce(new Error('offline')).mockImplementation(()=>new Promise(()=>{}));render(<LiveProductOffers/>);fireEvent.click(await screen.findByRole('button',{name:'Tentar novamente'}));expect(getProductShowcase).toHaveBeenCalledTimes(2);expect(screen.getByRole('heading',{name:'Preparando as melhores ofertas'})).toBeInTheDocument();});
test('clears expired prices while the refresh is still pending',async()=>{
 jest.useFakeTimers();const now=Date.now();getProductShowcase.mockResolvedValueOnce({serverTime:now,nextChangeAt:now+1000,campaigns:[{id:'c',revision:1,title:'Oferta temporária',theme_key:'padrao',startDate:'2026-01-01',endDate:'2026-12-31',ends:now+1000,items:[{id:'i',priceCents:599,unit:'kg',product:{name:'Maçã',code:'001',category:'hortifruti'}}]}]}).mockImplementation(()=>new Promise(()=>{}));
 render(<LiveProductOffers/>);await act(async()=>{});expect(screen.getByText('Maçã')).toBeInTheDocument();await act(async()=>{jest.advanceTimersByTime(1100)});expect(screen.queryByText('Maçã')).not.toBeInTheDocument();expect(screen.getByRole('status')).toHaveTextContent('Conferindo');
});
test('does not request again while the 45 minute local cache is fresh',()=>{
 const now=Date.now();
 localStorage.setItem('bpv-public-product-showcase-v1',JSON.stringify({savedAt:now,payload:{serverTime:now,nextChangeAt:now+60*60*1000,version:'v1',campaigns:[{id:'c',revision:1,title:'Oferta em cache',theme_key:'padrao',startDate:'2026-01-01',endDate:'2026-12-31',ends:now+60*60*1000,items:[{id:'i',priceCents:599,unit:'kg',product:{name:'Maçã',code:'001',category:'hortifruti'}}]}]}}));
 render(<LiveProductOffers/>);
 expect(screen.getByText('Maçã')).toBeInTheDocument();
 window.dispatchEvent(new Event('focus'));
 expect(getProductShowcase).not.toHaveBeenCalled();
});
