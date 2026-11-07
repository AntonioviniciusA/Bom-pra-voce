import {fireEvent,render,screen,waitFor} from '@testing-library/react';
import StoryButton from './StoryButton';
import {createProductStory,downloadStory} from './story';
jest.mock('./story',()=>({createProductStory:jest.fn(),downloadStory:jest.fn()}));
const campaign={title:'Campanha'},item={product:{name:'Arroz',code:'001'}};
afterEach(()=>{jest.clearAllMocks();delete navigator.share;delete navigator.canShare;});
test('prepares in advance and shares the artwork from the single top button',async()=>{
 const file=new File(['story'],'oferta.png',{type:'image/png'}),share=jest.fn().mockResolvedValue();
 createProductStory.mockResolvedValue(file);Object.defineProperty(navigator,'share',{configurable:true,value:share});Object.defineProperty(navigator,'canShare',{configurable:true,value:jest.fn(()=>true)});
 render(<StoryButton campaign={campaign} item={item}/>);
 const button=await screen.findByRole('button',{name:'Compartilhar Arroz'});await waitFor(()=>expect(button).toBeEnabled());
 fireEvent.click(button);
 await waitFor(()=>expect(share).toHaveBeenCalledWith({files:[file],title:'Arroz'}));
 expect(screen.queryByText('Preparar arte para compartilhar')).not.toBeInTheDocument();
});
test('the same share button downloads the PNG when native sharing is unavailable',async()=>{
 const file=new File(['story'],'oferta.png',{type:'image/png'});createProductStory.mockResolvedValue(file);
 render(<StoryButton campaign={campaign} item={item}/>);const button=await screen.findByRole('button',{name:'Compartilhar Arroz'});await waitFor(()=>expect(button).toBeEnabled());fireEvent.click(button);
 expect(downloadStory).toHaveBeenCalledWith(file);expect(await screen.findByRole('status')).toHaveTextContent('PNG baixado');
});
test('retains download after native sharing fails',async()=>{
 createProductStory.mockResolvedValue(new File(['x'],'arte.png',{type:'image/png'}));
 Object.defineProperty(navigator,'share',{configurable:true,value:jest.fn().mockRejectedValue(new Error('blocked'))});Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});
 render(<StoryButton campaign={campaign} item={item}/>);const button=await screen.findByRole('button',{name:'Compartilhar Arroz'});await waitFor(()=>expect(button).toBeEnabled());fireEvent.click(button);
 expect(await screen.findByRole('status')).toHaveTextContent('Tente novamente');expect(screen.getByRole('button',{name:'Compartilhar Arroz'})).toBeEnabled();
});
