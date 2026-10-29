import {render,screen,act,cleanup} from '@testing-library/react';
import LiveProductOffers from './LiveProductOffers';
import {getProductShowcase} from '../../services/productShowcase';
jest.mock('../../services/productShowcase',()=>({getProductShowcase:jest.fn()}));
afterEach(()=>{cleanup();jest.useRealTimers();jest.clearAllMocks();});
test('does not turn a network failure into an empty campaign',async()=>{getProductShowcase.mockRejectedValue(new Error('offline'));render(<LiveProductOffers/>);expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível');expect(screen.queryByText(/próximas ofertas estão/)).not.toBeInTheDocument();});
test('clears expired prices while the refresh is still pending',async()=>{
 jest.useFakeTimers();const now=Date.now();getProductShowcase.mockResolvedValueOnce({serverTime:now,nextChangeAt:now+1000,campaigns:[{id:'c',revision:1,title:'Oferta temporária',theme_key:'padrao',startDate:'2026-01-01',endDate:'2026-12-31',ends:now+1000,items:[{id:'i',priceCents:599,unit:'kg',product:{name:'Maçã',code:'001',category:'hortifruti'}}]}]}).mockImplementation(()=>new Promise(()=>{}));
 render(<LiveProductOffers/>);await act(async()=>{});expect(screen.getByText('Maçã')).toBeInTheDocument();await act(async()=>{jest.advanceTimersByTime(1100)});expect(screen.queryByText('Maçã')).not.toBeInTheDocument();expect(screen.getByRole('status')).toHaveTextContent('Conferindo');
});
