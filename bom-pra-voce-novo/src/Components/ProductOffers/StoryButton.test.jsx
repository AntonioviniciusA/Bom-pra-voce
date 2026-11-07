import {fireEvent,render,screen,waitFor} from '@testing-library/react';
import StoryButton from './StoryButton';
import {createProductStory,downloadStory} from './story';
jest.mock('./story',()=>({createProductStory:jest.fn(),downloadStory:jest.fn()}));
const campaign={title:'Campanha'},item={product:{name:'Arroz',code:'001'}};
afterEach(()=>{jest.clearAllMocks();delete navigator.share;delete navigator.canShare;});
test('shares a prepared file only from a fresh user click and keeps download available',async()=>{
 const file=new File(['story'],'oferta.png',{type:'image/png'}),share=jest.fn().mockResolvedValue();
 createProductStory.mockResolvedValue(file);Object.defineProperty(navigator,'share',{configurable:true,value:share});Object.defineProperty(navigator,'canShare',{configurable:true,value:jest.fn(()=>true)});
 render(<StoryButton campaign={campaign} item={item}/>);
 fireEvent.click(screen.getByRole('button',{name:'Preparar arte para compartilhar'}));
 const button=await screen.findByRole('button',{name:'Compartilhar arte'});
 expect(share).not.toHaveBeenCalled();fireEvent.click(button);
 await waitFor(()=>expect(share).toHaveBeenCalledWith({files:[file],title:'Arroz'}));
 fireEvent.click(screen.getByRole('button',{name:'Baixar PNG'}));expect(downloadStory).toHaveBeenCalledWith(file);
});
test('offers PNG download when native sharing is unavailable',async()=>{
 const file=new File(['story'],'oferta.png',{type:'image/png'});createProductStory.mockResolvedValue(file);
 render(<StoryButton campaign={campaign} item={item}/>);fireEvent.click(screen.getByRole('button',{name:'Preparar arte para compartilhar'}));
 fireEvent.click(await screen.findByRole('button',{name:'Baixar PNG'}));
 expect(downloadStory).toHaveBeenCalledWith(file);expect(screen.queryByRole('button',{name:'Compartilhar arte'})).not.toBeInTheDocument();
});
test('retains download after native sharing fails',async()=>{
 createProductStory.mockResolvedValue(new File(['x'],'arte.png',{type:'image/png'}));
 Object.defineProperty(navigator,'share',{configurable:true,value:jest.fn().mockRejectedValue(new Error('blocked'))});Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});
 render(<StoryButton campaign={campaign} item={item}/>);fireEvent.click(screen.getByRole('button',{name:'Preparar arte para compartilhar'}));fireEvent.click(await screen.findByRole('button',{name:'Compartilhar arte'}));
 expect(await screen.findByRole('status')).toHaveTextContent('Use Baixar PNG');expect(screen.getByRole('button',{name:'Baixar PNG'})).toBeEnabled();
});
