# Auditoria para commits locais — 23/10/2026

## Escopo e conclusão

Todas as alterações pendentes de `bom-pra-voce-novo` e suas evidências foram revisadas para commits temáticos na branch `codex/layout-sobre-auditado-2026-10-23`, conforme autorização final do usuário. Resultado: aptas para registro local, com as limitações abaixo. Não houve merge, push ou publicação.

Grupos: layout Sobre; privacidade e páginas institucionais/SEO; controles de destaques/ofertas e faixa histórica; cartões e ilustrações dos setores; documentação e ferramentas de auditoria.

## Evidência atual

- Suíte completa executada nesta conversa: 10 conjuntos, 44 testes aprovados.
- Compilação de produção concluída nesta conversa, incluindo quatro páginas estáticas, sitemap e robots. Não houve alteração funcional depois dessa compilação.
- Revisão dos diffs e dos arquivos novos: preferências com recusa por padrão, expiração e tratamento de armazenamento inválido; mapa condicionado à escolha; metadados por rota; renderização estática de conteúdo institucional; sem dados sensíveis adicionados ao schema público.
- Chrome: Sobre validado em 320 e 1440 px, sem transbordamento, textos alinhados e foco visível; capturas em `sobre-layout-2026-10-23/chrome-320.png` e `chrome-1440.png`.
- Chrome: Enter abre a galeria de Hortifrúti; Escape fecha e devolve foco ao botão; nenhum atributo inert residual após fechar.
- Chrome: rejeitar opcionais remove o iframe do mapa e devolve foco ao botão de preferências.
- Chrome: páginas Privacidade e Termos abrem; título e canonical de Termos conferidos, sem transbordamento na largura desktop observada.
- Chrome: candidaturas exibem indisponibilidade e não apresentam campos de coleta enquanto o recebimento está desativado.
- `git diff --check` e conferência dos arquivos preparados antes de cada commit.

## Limitações e observações

- Testes passaram com aviso de resposta externa 403 no jsdom e avisos de future flags do React Router. Isso não certifica disponibilidade de integrações externas.
- Build apresentou aviso de base Browserslist antiga, sem erro de compilação.
- Relatórios e capturas de 21 e 22/10 são evidências históricas; seus números e ambientes não substituem esta verificação. O script histórico `accessibility-audit.cjs` usa Edge e não foi reexecutado: a verificação desta rodada utilizou Chrome, conforme preferência do usuário.
- As cinco ilustrações atuais somam aproximadamente 828 KiB; a estimativa de 345 KiB no relatório histórico não descreve os arquivos atuais.
- Não se declara conformidade jurídica, WCAG integral, auditoria exaustiva de segurança, homologação de candidaturas ou prontidão de produção. Permanecem a validação operacional da retenção e dos fornecedores e o alinhamento da versão do aviso no servidor antes de publicação.
- O arquivo `supabase/seeds/promotion-assets/segunda-da-limpeza-2026-10-12.png` é de campanha separada e não integra os commits do site.

## Preservação

Os commits foram criados na branch existente. A referência `main` foi preservada; nenhum envio ao remoto foi executado.
