import React from 'react';
import {createRoot} from 'react-dom/client';

import ProductOffers from '../../bom-pra-voce-novo/src/Components/ProductOffers/ProductOffers';
import {seasonalTheme} from '../../bom-pra-voce-novo/src/Components/Tabloide/seasonalThemes';
const Home=React.lazy(()=>import('../../bom-pra-voce-novo/src/preview/StorefrontPreview'));
import '../../bom-pra-voce-novo/src/index.css';
import '../../bom-pra-voce-novo/src/Components/Tabloide/promotionThemes.css';
import './AdminPanel.css';
import './controls.css';
const ProductCampaigns=React.lazy(()=>import('./ProductCampaigns'));
const phase=new URLSearchParams(location.search).get('phase');
const theme=new URLSearchParams(location.search).get('theme')||'outubro-rosa';
const titles={'black-friday':'Seleção Black Friday',natal:'Natal à mesa','ano-novo':'Um novo ano de economia',criancas:'Momentos em família',verao:'Verão com economia','volta-a-rotina':'Sua rotina rende mais',carnaval:'Folia de ofertas','volta-as-aulas':'De volta às aulas',consumidor:'Mês do consumidor',pascoa:'Páscoa para compartilhar',maes:'Para celebrar com elas','festa-junina':'Arraiá de ofertas',namorados:'Sabores para compartilhar',ferias:'Férias com mais sabor',inverno:'Sabores de inverno',pais:'Celebre bons momentos',primavera:'Ofertas de primavera','aniversario-loja':'Aniversário Bom pra você'};
const month=String(seasonalTheme(theme)?.month||10).padStart(2,'0');
const products=['mercearia','mercearia','mercearia','mercearia'].map((category,i)=>({id:'demo-'+i,name:['Arroz branco','Feijão carioca','Óleo de soja','Café torrado'][i],code:'DEMO-'+(i+1),category,brand:'',content:['5 kg','1 kg','900 ml','500 g'][i],image:'',imageRevision:'demo',revision:0,identifierType:'plu',noGtinReason:'Somente demonstração',imageApproved:false}));
const campaign={id:'demo-campaign',title:theme==='black-friday'&&phase?(phase==='esquenta'?'Esquenta Black Friday':'Semana Black Friday'):titles[theme]||'Ofertas da semana',theme_key:theme,startDate:theme==='black-friday'&&phase?(phase==='esquenta'?'2026-11-01':'2026-11-23'):`2026-${month}-24`,endDate:theme==='black-friday'&&phase?(phase==='esquenta'?'2026-11-22':'2026-11-29'):`2026-${month}-${month==='02'?'28':['04','06','09','11'].includes(month)?'30':'31'}`,conditions:'Demonstração de estrutura. Produtos, fotos e preços reais aguardam cadastro e aprovação.',items:products.map((product,i)=>({id:'item-'+i,productId:product.id,product,priceCents:[1999,699,749,1499][i],unit:'un'}))};
window.demoWorkspace={revision:0,catalog:products,campaigns:[{...campaign,items:campaign.items.map(({product,...item})=>item)}]};
const section=<ProductOffers campaign={campaign} preview/>;
function App(){if(new URLSearchParams(location.search).has('device'))return <iframe title='Avaliação em largura fixa' src={'/seasonal-visual.html?theme='+theme+(phase?'&phase='+phase:'')} style={{width:new URLSearchParams(location.search).get('device')==='desktop'?1280:390,height:1100,border:0,display:'block'}}/>;return <><p style={{padding:4,fontSize:11,background:'#fff6ce',textAlign:'center',margin:0}}>AVALIAÇÃO LOCAL · VALORES ILUSTRATIVOS DA PRANCHA · NÃO PUBLICADO</p>{location.search.includes('panel')?<ProductCampaigns initialWorkspace={window.demoWorkspace}/>:location.search.includes('full')?<Home offers={section}/>:section}</>}
const root=createRoot(document.getElementById('root'));root.render(<React.Suspense fallback={<p>Carregando prévia…</p>}><App/></React.Suspense>);if(import.meta.hot)import.meta.hot.dispose(()=>root.unmount());





