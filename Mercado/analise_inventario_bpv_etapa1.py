"""Etapa 1 — Diagnóstico somente de leitura de PRODUDOS.xlsx.

NÃO altera o arquivo original. Usa apenas biblioteca padrão (Zip XML),
pois o importador de planilhas excedeu o tempo de execução nesta extração.
Saída: diagnóstico JSON; nenhuma classificação tributária definitiva.
"""
import os, json, re, zipfile, hashlib, collections, decimal
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

SOURCE = '/mnt/data/PRODUDOS.xlsx'
OUTPUT = '/mnt/data/DIAGNOSTICO_ETAPA_1_BPV.json'
NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
Q = lambda s: f'{{{NS}}}{s}'
FIELDS=['CODIGO','CODIGO_BARRAS','DESCRICAO','GRUPO','NCM','PRECO_CUSTO','MARGEM_LUCRO','PRECO_VENDA','ESTOQUE_MINIMO','ESTOQUE_MAXIMO','ESTOQUE_ATUAL','UNIDADE','CONTROLA_ESTOQUE','CFOP','CSOSN','CST','ICMS','ATIVO','EXIBIR_TELA','SOLICITA_QUANTIDADE','PERMITIR_COMBINACAO','CEST','CST_PIS','PIS','CST_COFINS','COFINS']
CAT=['GRUPO','UNIDADE','CONTROLA_ESTOQUE','CFOP','CSOSN','CST','ICMS','ATIVO','EXIBIR_TELA','SOLICITA_QUANTIDADE','PERMITIR_COMBINACAO','CST_PIS','PIS','CST_COFINS','COFINS','NCM','CEST']
NAMES_SET=set(FIELDS)

def column_num(cell_ref):
    col=re.match(r'[A-Z]+',cell_ref).group()
    result=0
    for letter in col:result=result*26+ord(letter)-64
    return result-1

def gtin_valid(s):
    if len(s) not in (8,12,13,14) or not s.isdigit():return None
    # weights from right 3,1 alternating on body
    body=s[:-1]
    chk=(10-sum((3 if i%2==0 else 1)*int(d) for i,d in enumerate(reversed(body)))%10)%10
    return chk == int(s[-1])

def normalized(x):
    return re.sub(r'\s+',' ',x.upper().strip())

with open(SOURCE,'rb') as f:
 sha=hashlib.file_digest(f,'sha256').hexdigest()
size=os.path.getsize(SOURCE)
z=zipfile.ZipFile(SOURCE)
ssroot=ET.fromstring(z.read('xl/sharedStrings.xml'))
ss=[''.join(t.text or '' for t in si.iter(Q('t'))) for si in ssroot]
del ssroot
meta=ET.fromstring(z.read('xl/workbook.xml'))
ws=[s.attrib['name'] for s in meta.iter(Q('sheet'))]

count=0; excel_rows=0; empty_rows=0; full_rows=0; formulas=0
pop=collections.Counter(); zeros=collections.Counter(); types={col:collections.Counter() for col in FIELDS}; distinct={col:set() for col in FIELDS}; frequency={col:collections.Counter() for col in CAT}
examples={col:[] for col in FIELDS}; samples=[]
code_freq=collections.Counter(); gtin_freq=collections.Counter(); desc_freq=collections.Counter()
code_duplicate_examples={}; gtin_duplicate_examples={}; descriptions_example={}
flags=collections.Counter(); examples_flags=collections.defaultdict(list)
stock_distribution=collections.Counter(); val_gtin=collections.Counter()
status_stock=collections.Counter(); status_ncm=collections.Counter()

with z.open('xl/worksheets/sheet1.xml') as fh:
    for ev,el in ET.iterparse(fh,events=('end',)):
        if el.tag != Q('row'):continue
        rownum=int(el.get('r'))
        excel_rows+=1
        values={}
        for c in el.findall(Q('c')):
            r=c.get('r','A1');ci=column_num(r)
            if ci>=len(FIELDS): continue
            key=FIELDS[ci]
            v=c.find(Q('v')); t=c.get('t','n')
            f=c.find(Q('f'))
            if f is not None:formulas+=1
            raw=v.text if v is not None and v.text is not None else ''
            if t=='s' and raw: val=ss[int(raw)]
            elif t=='inlineStr':val=''.join(x.text or '' for x in c.iter(Q('t')))
            else:val=raw
            values[key]=str(val).strip()
            if str(val).strip()!='':types[key][t]+=1
        el.clear()
        if rownum==1:
            headers=[values.get(c) for c in FIELDS]
            continue
        if all(not x for x in values.values()):
            empty_rows+=1;continue
        count+=1
        if len(values)==len(FIELDS): full_rows+=1
        if len(samples)<4:samples.append({'excel_row':rownum,**values})
        for c in FIELDS:
            v=values.get(c,'')
            if v=='':continue
            pop[c]+=1;distinct[c].add(v)
            if v in ('0','0.0','0.00','00000000','0000000'):zeros[c]+=1
            if c in CAT:frequency[c][v]+=1
            if len(examples[c])<3 and v not in examples[c]:examples[c].append(v)
        code=values.get('CODIGO','')
        gtin=values.get('CODIGO_BARRAS','')
        desc=values.get('DESCRICAO','')
        active=values.get('ATIVO','').upper()
        ncm=values.get('NCM','')
        stock=values.get('ESTOQUE_ATUAL','')
        if code:code_freq[code]+=1
        if gtin:gtin_freq[gtin]+=1
        if desc:
            d=normalized(desc)
            desc_freq[d]+=1
            if d not in descriptions_example:descriptions_example[d]=[rownum, desc]
        if gtin:
            if gtin.isdigit():
                if len(gtin) in (8,12,13,14):
                    val_gtin['padrao_8_12_13_14_digitos']+=1
                    if gtin_valid(gtin):val_gtin['digito_verificador_confere']+=1
                    else:val_gtin['digito_verificador_nao_confere']+=1
                else:val_gtin['comprimento_nao_padrao']+=1
            else:val_gtin['nao_numerico']+=1
        if not desc:
            flags['sem_descricao']+=1
            if len(examples_flags['sem_descricao'])<5:examples_flags['sem_descricao'].append([rownum,code,desc])
        if not ncm or ncm=='00000000' or not re.fullmatch(r'\d{8}',ncm):
            flags['ncm_ausente_zero_ou_formato_invalido']+=1
            if len(examples_flags['ncm_ausente_zero_ou_formato_invalido'])<5:examples_flags['ncm_ausente_zero_ou_formato_invalido'].append([rownum,code,desc,ncm])
        if not values.get('CEST',''):
            flags['cest_vazio']+=1
        if values.get('CST_COFINS','')=='':flags['cst_cofins_vazio']+=1
        if values.get('CST_PIS','')=='':flags['cst_pis_vazio']+=1
        if values.get('PRECO_CUSTO','') in ('','0','0.0','0.00'):flags['preco_custo_ausente_ou_zero']+=1
        if values.get('PRECO_VENDA','') in ('','0','0.0','0.00'):flags['preco_venda_ausente_ou_zero']+=1
        try:
            st=decimal.Decimal(stock) if stock else None
            if st is None: stock_distribution['vazio']+=1
            elif st<0:stock_distribution['negativo']+=1
            elif st==0:stock_distribution['zero']+=1
            else:stock_distribution['positivo']+=1
            if st is not None:status_stock[(active,('negativo' if st<0 else 'zero' if st==0 else 'positivo'))]+=1
        except decimal.InvalidOperation: stock_distribution['nao_numerico']+=1
        status_ncm[(active,'regular_formato' if re.fullmatch(r'\d{8}',ncm) and ncm!='00000000' else 'incompleto_formato')]+=1

def top(key,n=10):return [{'valor':a,'registros':b} for a,b in frequency[key].most_common(n)]
def dup_stats(ct,desc=False):
    keys=[k for k,v in ct.items() if v>1]
    return {'chaves_duplicadas':len(keys),'linhas_envolvidas':sum(ct[k] for k in keys), 'exemplos':[{'valor': k,'ocorrencias': ct[k]} for k in sorted(keys,key=lambda k:(-ct[k], k))[:12]]}

result={
'arquivo':{'nome':'PRODUDOS.xlsx','bytes':size,'sha256':sha,'abas':ws,'dimensao_declarada':'A1:Z41748','formulas':formulas,'leitura':'somente leitura (zip/xml)'},
'inventario':{'linhas_registro':count,'linhas_fisicas_xml':excel_rows,'linhas_total_sem_cabecalho_xml':excel_rows-1,'linhas_vazias':empty_rows,'linhas_todas_26_celulas_presentes':full_rows,'colunas':len(FIELDS),'cabecalhos':headers,'exemplo_primeiros_registros':samples},
'campos':{c:{'preenchidos':pop[c],'vazios':count-pop[c],'percentual_preenchido':round(pop[c]/count*100,2) if count else 0,'zeros_representacoes_comuns':zeros[c],'distintos':len(distinct[c]),'tipos_xml':dict(types[c]),'exemplos':examples[c]} for c in FIELDS},
'categoricos':{c:top(c,15) for c in CAT},
'duplicacoes_preliminares':{'codigo':dup_stats(code_freq),'codigo_barras':dup_stats(gtin_freq),'descricao_normalizada':dup_stats(desc_freq)},
'gtin_formato':dict(val_gtin),
'estoque_distribuicao':dict(stock_distribution),
'estoque_por_status':{f'{a}|{b}':v for (a,b),v in status_stock.items()},
'ncm_por_status':{f'{a}|{b}':v for (a,b),v in status_ncm.items()},
'alertas_estruturais':dict(flags),
'exemplos_alertas':dict(examples_flags),
'limitacoes':['Arquivo nao contem data da ultima venda, compras, movimentacoes, XML, apuracoes nem comprovantes','Codigo e codigo de barras podem ser internos, sem validacao EAN exigivel','CEST nao e obrigatorio para todo produto, conforme enquadramento','Dados de tributacao nao comprovam informacoes efetivamente emitidas em NF-e/NFC-e'],
}
with open(OUTPUT,'w',encoding='utf8') as fp:json.dump(result,fp,indent=2,ensure_ascii=False)
print('OUTPUT',OUTPUT)
print('COUNT',count,'SHEETS',ws,'FORMULAS',formulas)
print('FILE_SHA256',sha)
print('STOCK',result['estoque_distribuicao'])
print('GTIN',result['gtin_formato'])
print('STATUS',top('ATIVO',10))
print('NCM',top('NCM',10))
print('CFOP',top('CFOP',10))
print('CSOSN',top('CSOSN',10))
print('CST_PIS',top('CST_PIS',10))
print('CST_COFINS',top('CST_COFINS',10))
print('COUNTS',result['alertas_estruturais'])
print('DUPL', {a:{'chaves_duplicadas':v['chaves_duplicadas'],'linhas_envolvidas':v['linhas_envolvidas']} for a,v in result['duplicacoes_preliminares'].items()})
print('FIELDS',[(c,result['campos'][c]['vazios']) for c in FIELDS])
