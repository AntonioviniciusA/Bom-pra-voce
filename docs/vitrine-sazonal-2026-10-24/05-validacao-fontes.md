# Validação futura, etapas e referências

Os cenários abaixo são critérios para implementação posterior. **Não foram executados e não autorizam programar ou publicar.**

## Cenários de aceite

| Área | Cenário | Resultado esperado |
|---|---|---|
| Identidade | Mesmo nome, variantes/códigos diferentes | Foto, descrição, unidade e preço associados ao ID correto |
| Código | Zero inicial, código interno, GTIN inválido | Texto preservado; tipo explícito; erro contextual |
| Foto | Substituir arquivo aprovado | Nova revisão pendente; campanha anterior não muda silenciosamente |
| Proporção | Foto 1200×800 em slot 1:1 | Aviso com medidas e encaixe; sem deformação/corte automático |
| Resolução | Foto pequena em destaque/Story | Mostrar limitação no tamanho de saída; não fingir nitidez |
| Promoções | Mesmo produto em períodos sobrepostos | Conflito explícito antes de publicar |
| Concorrência | Dois operadores editam a mesma revisão | Comparar versões, sem sobrescrita silenciosa |
| Respostas | Consulta A lenta, B rápida | A nunca substitui B |
| Vigência | Oferta expira durante consulta | Retirar no limite conhecido, sem esperar a rede |
| Cache | Metadados/payload de versões diferentes | Nova tentativa limitada ou conflito; sem mistura |
| Imagem lenta | Foto A chega após card virar B | Foto A nunca aparece em B |
| Filtros | Categoria vazia versus erro de rede | Mensagens distintas |
| Suspensão | Voltar à aba após expiração | Revalidar antes de mostrar preço potencialmente vencido |
| Tema | Falha no pacote decorativo | Tema padrão mantém conteúdo; não inventa ofertas |
| Compartilhar | iOS, Android, notebook, cancelamento | Opções reais e fallback, sem confirmação falsa de post |
| Link antigo | Oferta encerrada | Estado encerrado, sem preço como vigente |
| Story | Vários itens, texto longo e condições | Sequência legível, sem corte de preço/unidade/data |
| Instagram | Timeout seguido de reenvio | Reconciliação e ausência de duplicação |
| Acessibilidade | Teclado, foco, leitor, zoom 200% | Sem perda de informação e sem depender só de cor |
| Responsividade | 360/390/430/1280/1366 px | Sem rolagem horizontal global; categorias podem rolar |
| Estabilidade | Fontes/fotos tardias | Espaços reservados, sem deslocar alvos de toque |

## Metas a medir

Contraste WCAG 2.2 AA: 4,5:1 para texto comum e 3:1 para texto grande, conforme definições da norma. Alvos segundo WCAG e suas exceções; preferir 44×44 CSS px nos controles principais. CLS alvo até 0,1 no percentil 75 quando houver dados reais; laboratório não substitui campo.

Testar com equipe da loja: localizar por código, identificar foto errada e corrigir campanha. Testar com clientes: achar categoria, ler unidade/preço e compartilhar sem confundir com compra. Não prometer vendas ou engajamento com base em mockups.

## Etapas futuras, somente após nova autorização

1. Conferir catálogo real, categorias, responsáveis e imagens disponíveis.
2. Contratos versionados de catálogo/campanha/snapshot e transição dos panfletos com histórico preservado.
3. Revisão de foto/proporção antes da publicação granular.
4. Controle dos produtos e listagem pública com estados robustos.
5. Validar padrão + um tema festivo + um de conscientização antes de ampliar biblioteca.
6. Produzir assets decorativos finais e renderizador de Story usando dados aprovados.
7. Testar compartilhamento em aparelhos reais e integração da conta da loja.

Planejamento, estudo visual, implementação, teste, homologação externa e operação pública são estados diferentes. Nenhuma etapa acima está concluída por esta entrega.

## Fontes, consultadas em 24/10/2026

- [NN/g — princípios visuais](https://www.nngroup.com/articles/principles-visual-design/): hierarquia e agrupamento.
- [NN/g — heurísticas](https://www.nngroup.com/articles/ten-usability-heuristics/): controle, status e prevenção/recuperação de erros.
- [NN/g — divulgação progressiva](https://www.nngroup.com/articles/progressive-disclosure/): controles essenciais antes de ajustes avançados.
- [Baymard — listas e filtros](https://baymard.com/research/ecommerce-product-lists): descoberta e comparação de itens.
- [W3C — contraste](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) e [alvos](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): critérios a verificar na UI real.
- [web.dev — CLS](https://web.dev/articles/optimize-cls): reservar dimensões e medir instabilidade após carregamento.
- [GS1 — identificadores](https://www.gs1.org/edi-xml/technical-user-guide/Item_Numbers) e [unicidade/zeros](https://support.gs1.org/support/solutions/articles/43000734386-are-all-gtins-unique-numbers-): preservação e representação de códigos.
- [MDN — share](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) e [canShare](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare): capacidades e limitações reais.
- [INCA — campanhas](https://www.gov.br/inca/pt-br/assuntos/campanhas) e [Setembro Amarelo — participação](https://setembroamarelo.org.br/participe/): referências para mensagens institucionais, sem aconselhamento médico em oferta.

Consulta Meta retornou 429; limites atuais e permissões exigem confirmação posterior. Nenhuma conta externa foi alterada.

## Verificação desta entrega

Conferir inventário de 21 temas × três aplicações conceituais, arquivos/links presentes, Feed fora da galeria final e alterações restritas à pasta de planejamento. Revisão de imagem não certifica proporção exportável, acessibilidade nem fidelidade de embalagem.

### Resultado da conferência documental em 24/10/2026

- 23 PNGs presentes: 21 pranchas de temas e 2 telas do painel.
- Dimensões reais: pranchas 1774×887; telas do painel 1536×1024. Os alvos escritos nas pranchas são especificações futuras, não dimensões de exportação entregues.
- Oito documentos Markdown e um inventário JSON; nenhum link local quebrado encontrado.
- Inventário registra tamanho, dimensões, hash e estado não aprovado para publicação.
- Referências restantes a Feed explicam sua retirada ou preservação de histórico legado, não inclusão no escopo.
- Somente arquivos de planejamento nesta pasta foram criados/alterados nesta entrega; alterações preexistentes do projeto foram preservadas.
- Não houve execução de testes funcionais, alteração do aplicativo, migração, deploy ou publicação social. Os testes da tabela continuam pendentes para uma implementação futura autorizada.
