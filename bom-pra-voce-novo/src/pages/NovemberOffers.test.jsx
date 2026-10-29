import {render,screen} from '@testing-library/react';
import NovemberOffers from './NovemberOffers';
import {getProductShowcase} from '../services/productShowcase';
jest.mock('../services/productShowcase',()=>({getProductShowcase:jest.fn()}));
test('shows November decoration without publishing demonstration offers',async()=>{
 getProductShowcase.mockResolvedValue({serverTime:Date.parse('2026-11-10T12:00:00-03:00'),campaigns:[],version:'empty',nextChangeAt:null});
 render(<NovemberOffers/>);
 expect(await screen.findByRole('heading',{name:'Esquenta Black Friday'})).toBeInTheDocument();
 expect(screen.getByText('As ofertas de novembro estão sendo preparadas. Volte em breve.')).toBeInTheDocument();
 expect(screen.queryByText('Arroz branco')).not.toBeInTheDocument();
 expect(screen.getByRole('button',{name:'Compartilhar ofertas'})).toBeDisabled();
});
