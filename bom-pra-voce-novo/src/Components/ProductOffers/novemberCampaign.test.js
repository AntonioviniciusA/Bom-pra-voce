import {homeNovemberPreparationAt,novemberPreparationAt,prepareNovemberCampaigns} from './novemberCampaign';

test('preserves legacy and edited drafts and creates each phase only once',()=>{
 const legacy={id:'legacy',templateKey:'novembro-2026',title:'Minha campanha',items:[{id:'keep'}]};
 let id=0;
 const drafts=prepareNovemberCampaigns([legacy],()=>String(++id));
 expect(drafts).toHaveLength(3);
 expect(drafts[0]).toBe(legacy);
 drafts[1].title='Esquenta editado';
 expect(prepareNovemberCampaigns(drafts,()=>String(++id))).toEqual(drafts);
 expect(drafts.slice(1).map(c=>[c.startDate,c.endDate])).toEqual([['2026-11-01','2026-11-22'],['2026-11-23','2026-11-29']]);
});

test.each([
 ['2026-11-01T02:59:59Z','Esquenta Black Friday'],
 ['2026-11-01T03:00:00Z','Esquenta Black Friday'],
 ['2026-11-23T02:59:59Z','Esquenta Black Friday'],
 ['2026-11-23T03:00:00Z','Semana Black Friday'],
 ['2026-11-30T02:59:59Z','Semana Black Friday'],
 ['2026-11-30T03:00:00Z','Ofertas de novembro'],
])('uses Brasilia boundaries without inventing offers: %s',(instant,title)=>{
 const preparation=novemberPreparationAt(Date.parse(instant));
 expect(preparation.title).toBe(title);
 expect(preparation.items).toEqual([]);
 expect(preparation.startDate).toBe(title==='Ofertas de novembro'?'':'2026-11-'+(title==='Semana Black Friday'?'23':'01'));
});

test('shows the Esquenta identity on the home page only during the announced campaign window',()=>{
 expect(homeNovemberPreparationAt(Date.parse('2026-10-29T12:00:00-03:00')).title).toBe('Esquenta Black Friday');
 expect(homeNovemberPreparationAt(Date.parse('2026-10-29T12:00:00-03:00')).items).toEqual([]);
 expect(homeNovemberPreparationAt(Date.parse('2026-11-23T12:00:00-03:00')).title).toBe('Semana Black Friday');
 expect(homeNovemberPreparationAt(Date.parse('2026-11-30T12:00:00-03:00'))).toBeNull();
});
