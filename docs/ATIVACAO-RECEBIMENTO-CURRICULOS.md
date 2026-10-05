# Ativação do recebimento de currículos

Status em 05/10/2026: **aviso provisório aprovado pelo responsável, Turnstile de produção configurado e ativação técnica em andamento**.

O site, as Edge Functions e o banco já possuem formulário, validação de PDF, limite de 5 MB, sessão idempotente, recibo, limitação de abuso, bucket privado e quarentena. A ativação foi adiada até a compra do domínio definitivo.

## Dados provisórios — não publicar como definitivos

- Canal provisório de privacidade: `antoniovinicius_@outlook.com`. Confirmar que a caixa é monitorada e substituí-la por um canal institucional quando disponível.
- Controlador pesquisado em 05/10/2026: Comercial de Produtos Alimenticios Bom Pra Voce LTDA - ME, CNPJ 05.428.120/0001-08, nome fantasia Bom Pra Voce Supermercado.
- Endereço cadastral: QD QS 118, conjunto 6, lote 2, Samambaia Sul, Brasília–DF, CEP 72302-576.
- Fontes públicas consultadas: Serasa Experian e CNPJ Biz. Os dados devem ser reconferidos em comprovante oficial da Receita Federal antes da aprovação final do aviso.
- Finalidade proposta: receber e avaliar candidaturas para oportunidades de trabalho no Bom Pra Você.
- Retenção proposta: até 6 meses após o recebimento.
- Atenção: a adequação jurídica do prazo de 6 meses precisa ser verificada antes da ativação. O prazo não deve ser tratado como automaticamente válido apenas por constar neste documento.

O arquivo `src/Data/storeConfig.js` usa a versão `2026-10-05`, aprovada provisoriamente pelo responsável em 05/10/2026. A validação jurídica da retenção continua como ação externa registrada, sem impedir a transparência sobre o prazo adotado.

## O que fazer depois de comprar o domínio

1. Configurar o domínio definitivo na hospedagem e confirmar HTTPS quando ele for adquirido.
2. Turnstile provisório de produção criado em 05/10/2026 no modo `Managed`, limitado a `bom-pra-voce-vert.vercel.app`.
3. `REACT_APP_TURNSTILE_SITE_KEY` configurada na produção da Vercel em 05/10/2026.
4. `TURNSTILE_SECRET_KEY` configurada somente nos segredos do Supabase em 05/10/2026.
5. `TURNSTILE_EXPECTED_HOSTNAME` configurado como `bom-pra-voce-vert.vercel.app`; substituir ao migrar para o domínio definitivo.
6. Confirmar que `antoniovinicius_@outlook.com` é atendido pela empresa, planejar sua substituição por um canal institucional e revisar todo o aviso de privacidade.
7. Definir e documentar quem acessará os currículos, como será feita a inspeção dos PDFs e quem executará pedidos de exclusão.
8. Validar juridicamente a finalidade, a base legal e a retenção proposta de 6 meses.
9. Versionar o aviso em `PRIVACY_NOTICE_VERSION` e no frontend.
10. Manter `APPLICATIONS_ENABLED=false` até concluir um teste ponta a ponta com dados e PDF fictícios.
11. Após o teste, habilitar `APPLICATIONS_ENABLED=true` no Supabase e `REACT_APP_APPLICATIONS_ENABLED=true` na Vercel, fazer novo deploy e repetir o teste público.

## Critérios para considerar funcional em produção

- visitante legítimo consegue concluir o Turnstile e enviar um PDF válido;
- robô ou token inválido é rejeitado pelo servidor;
- o candidato recebe um protocolo sem exposição do arquivo;
- o currículo fica em bucket privado e não pode ser baixado anonimamente;
- apenas pessoal autorizado do RH acessa candidaturas auditadas;
- existe rotina operacional de inspeção, retenção e exclusão;
- o canal de privacidade verdadeiro está publicado e é atendido;
- a remoção após o prazo aprovado foi testada.

## O que não fazer

- não usar as chaves públicas de teste do Turnstile em produção;
- não remover a verificação para “funcionar provisoriamente”;
- não manter um canal sem monitoramento nem deixar solicitações dos titulares sem atendimento;
- não ativar o recebimento enquanto `approved` estiver falso;
- não guardar currículos indefinidamente.
