import {fireEvent,render,screen,waitFor} from '@testing-library/react';
import StoryButton from './StoryButton';
import {createProductStory,downloadStory} from './story';
jest.mock('./story',()=>({createProductStory:jest.fn(),downloadStory:jest.fn()}));
const campaign={title:'Campanha'},item={product:{name:'Arroz',code:'001'}};
afterEach(()=>{jest.clearAllMocks();delete navigator.share;delete navigator.canShare;});
test('prepares and shares from a single Stories button',async()=>{
 const file=new File(['story'],'oferta.png',{type:'image/png'}),share=jest.fn().mockResolvedValue();
 createProductStory.mockResolvedValue(file);Object.defineProperty(navigator,'share',{configurable:true,value:share});Object.defineProperty(navigator,'canShare',{configurable:true,value:jest.fn(()=>true)});
 render(<StoryButton campaign={campaign} item={item}/>);
 expect(screen.queryByRole('button',{name:'Preparar Story'})).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'Compartilhar nos Stories'}));
 expect(await screen.findByRole('button',{name:'Preparando compartilhamento…'})).toBeDisabled();
 await waitFor(()=>expect(share).toHaveBeenCalledWith({files:[file],title:'Arroz'}));
 expect(screen.getByRole('button',{name:'Compartilhar nos Stories'})).toBeEnabled();
});
test('downloads the generated Story when file sharing is unavailable',async()=>{
 const file=new File(['story'],'oferta.png',{type:'image/png'});createProductStory.mockResolvedValue(file);
 render(<StoryButton campaign={campaign} item={item}/>);fireEvent.click(screen.getByRole('button',{name:'Compartilhar nos Stories'}));
 await waitFor(()=>expect(downloadStory).toHaveBeenCalledWith(file));
 expect(screen.getByRole('status')).toHaveTextContent('Imagem do Story baixada');
});
