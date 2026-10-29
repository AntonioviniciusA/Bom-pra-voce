// Templates prepare local drafts only. Published snapshots control commercial validity.
export const novemberPhases = [
 {templateKey:'novembro-2026-esquenta',title:'Esquenta Black Friday',startDate:'2026-11-01',endDate:'2026-11-22'},
 {templateKey:'novembro-2026-semana',title:'Semana Black Friday',startDate:'2026-11-23',endDate:'2026-11-29'},
];
export function createNovemberCampaign(id, phase=0) {
 return {id,...novemberPhases[phase],theme_key:'black-friday',conditions:'Enquanto durarem os estoques.',items:[]};
}
export function prepareNovemberCampaigns(campaigns, makeId) {
 const additions=novemberPhases.flatMap((phase,index)=>campaigns.some(c=>c.templateKey===phase.templateKey)?[]:[createNovemberCampaign(makeId(),index)]);
 return [...campaigns,...additions];
}
export function novemberPreparationAt(serverTime) {
 const date=new Date(serverTime).toLocaleDateString('en-CA',{timeZone:'America/Sao_Paulo'});
 const phase=novemberPhases.find(p=>date>=p.startDate&&date<=p.endDate) || (date>='2026-10-29'&&date<'2026-11-01'?novemberPhases[0]:null);
 return {id:'novembro-em-preparacao',theme_key:'black-friday',title:phase?.title||'Ofertas de novembro',startDate:phase?.startDate||'',endDate:phase?.endDate||'',items:[],conditions:'As ofertas serão divulgadas após a conferência dos produtos e preços.',emptyMessage:date>'2026-11-29'?'As campanhas de novembro foram encerradas. Confira as próximas ofertas.':phase&&date<'2026-11-01'?'O Esquenta Black Friday começa em 1º de novembro. Ofertas em preparação.':'As ofertas de novembro estão sendo preparadas. Volte em breve.'};
}
export function homeNovemberPreparationAt(serverTime) {
 const date=new Date(serverTime).toLocaleDateString('en-CA',{timeZone:'America/Sao_Paulo'});
 return date>='2026-10-29'&&date<='2026-11-29'?novemberPreparationAt(serverTime):null;
}
