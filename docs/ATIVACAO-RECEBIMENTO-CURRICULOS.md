# Ativação do recebimento de currículos

Status em 04/10/2026: **implementado tecnicamente, mas deliberadamente desativado para o público**.

O site, as Edge Functions e o banco já possuem formulário, validação de PDF, limite de 5 MB, sessão idempotente, recibo, limitação de abuso, bucket privado e quarentena. A ativação foi adiada até a compra do domínio definitivo.

## Dados provisórios — não publicar como definitivos

- Canal de privacidade de exemplo: `privacidade@example.com`.
- Controlador: razão social e CNPJ ainda precisam ser informados.
- Finalidade proposta: receber e avaliar candidaturas para oportunidades de trabalho no Bom Pra Você.
- Retenção proposta: até 6 meses após o recebimento.
- Atenção: a adequação jurídica do prazo de 6 meses precisa ser verificada antes da ativação. O prazo não deve ser tratado como automaticamente válido apenas por constar neste documento.

O arquivo `src/Data/storeConfig.js` mantém esses dados como rascunho com `approved: false`. Não alterar para `true` enquanto houver marcadores de exemplo ou pendências.

## O que fazer depois de comprar o domínio

1. Configurar o domínio na hospedagem e confirmar HTTPS.
2. Criar um widget Cloudflare Turnstile separado para produção, em modo `Managed`, aceitando somente o domínio definitivo.
3. Colocar a `site key` em `REACT_APP_TURNSTILE_SITE_KEY` na Vercel. Essa chave é pública.
4. Colocar a `secret key` em `TURNSTILE_SECRET_KEY` nos segredos do Supabase. Essa chave nunca deve ir para o React, Git ou Vercel como variável pública.
5. Configurar `TURNSTILE_EXPECTED_HOSTNAME` com o domínio definitivo.
6. Substituir o e-mail de exemplo, preencher a identidade oficial do controlador e revisar todo o aviso de privacidade.
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
- não publicar `privacidade@example.com` como contato real;
- não ativar o recebimento enquanto `approved` estiver falso;
- não guardar currículos indefinidamente.
