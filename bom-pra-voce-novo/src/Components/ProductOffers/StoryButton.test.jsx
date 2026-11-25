import {fireEvent,render,screen,waitFor} from '@testing-library/react';
import StoryButton from './StoryButton';
import {createProductStory} from './story';
import {createCampaignFlyerPdf,downloadFile} from './flyerPdf';

jest.mock('./story',()=>({createProductStory:jest.fn()}));
jest.mock('./flyerPdf',()=>({createCampaignFlyerPdf:jest.fn(),downloadFile:jest.fn()}));

const item={id:'i1',product:{name:'Arroz',code:'001'}};
const campaign={title:'Campanha',items:[item]};

afterEach(()=>{jest.clearAllMocks();delete navigator.share;delete navigator.canShare;});

function openMenu(){fireEvent.click(screen.getByRole('button',{name:'Compartilhar Arroz'}));}

test('keeps native sharing separate from the two download actions',async()=>{
 const file=new File(['story'],'oferta.png',{type:'image/png'}),share=jest.fn().mockResolvedValue();
 createProductStory.mockResolvedValue(file);
 Object.defineProperty(navigator,'share',{configurable:true,value:share});
 Object.defineProperty(navigator,'canShare',{configurable:true,value:jest.fn(()=>true)});
 render(<StoryButton campaign={campaign} item={item}/>);openMenu();
 await waitFor(()=>expect(screen.getByRole('button',{name:/^Compartilhar Abrir/})).toBeEnabled());
 expect(screen.getByRole('button',{name:/Baixar arte do produto/})).toBeInTheDocument();
 expect(screen.getByRole('button',{name:/Baixar panfleto completo/})).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:/^Compartilhar Abrir/}));
 await waitFor(()=>expect(share).toHaveBeenCalledWith({files:[file],title:'Arroz',text:'Confira a oferta de Arroz.'}));
 expect(downloadFile).not.toHaveBeenCalled();
});

test('downloads the individual PNG only after choosing that option',async()=>{
 const file=new File(['story'],'oferta.png',{type:'image/png'});createProductStory.mockResolvedValue(file);
 render(<StoryButton campaign={campaign} item={item}/>);openMenu();
 expect(screen.queryByRole('button',{name:'Compartilhar',exact:true})).not.toBeInTheDocument();
 await waitFor(()=>expect(screen.getByRole('button',{name:/Baixar arte do produto/})).toBeEnabled());
 fireEvent.click(screen.getByRole('button',{name:/Baixar arte do produto/}));
 await waitFor(()=>expect(downloadFile).toHaveBeenCalledWith(file));
 expect(screen.getByRole('status')).toHaveTextContent('Arte baixada em alta qualidade');
});

test('generates the complete campaign PDF from the same menu',async()=>{
 const pdf=new File(['pdf'],'panfleto.pdf',{type:'application/pdf'});createCampaignFlyerPdf.mockResolvedValue(pdf);
 createProductStory.mockResolvedValue(new File(['story'],'oferta.png',{type:'image/png'}));
 render(<StoryButton campaign={campaign} item={item}/>);openMenu();
 fireEvent.click(screen.getByRole('button',{name:/Baixar panfleto completo/}));
 await waitFor(()=>expect(createCampaignFlyerPdf).toHaveBeenCalledWith(campaign,campaign.items));
 expect(downloadFile).toHaveBeenCalledWith(pdf);
 expect(await screen.findByRole('status')).toHaveTextContent('Panfleto completo baixado');
});

test('reports a native share failure without disabling the menu',async()=>{
 createProductStory.mockResolvedValue(new File(['x'],'arte.png',{type:'image/png'}));
 Object.defineProperty(navigator,'share',{configurable:true,value:jest.fn().mockRejectedValue(new Error('Compartilhamento bloqueado.'))});
 Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});
 render(<StoryButton campaign={campaign} item={item}/>);openMenu();
 await waitFor(()=>expect(screen.getByRole('button',{name:/^Compartilhar Abrir/})).toBeEnabled());
 fireEvent.click(screen.getByRole('button',{name:/^Compartilhar Abrir/}));
 expect(await screen.findByRole('status')).toHaveTextContent('Compartilhamento bloqueado');
 expect(screen.getByRole('button',{name:/Baixar arte do produto/})).toBeEnabled();
});
