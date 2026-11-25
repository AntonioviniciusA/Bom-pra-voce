# Biblioteca única de imagens

Os arquivos-fonte de imagem do repositório ficam nesta pasta.

- Arquivos e pastas existentes: identidade e fotos usadas no site.
- `offer-themes/<tema>/`: decorações consumidas, originais e referências completas organizados por tema; veja o [índice](../../../docs/vitrine-imagens.md).
- `../../../docs/pranchas-ofertas-sazonais/`: pranchas completas preservadas para comparação.
- `offer-themes/<tema>/evidencias/atual/`: capturas atuais; remover as substituídas, mantendo o registro da substituição.
- `offer-themes/compartilhados/`: pinceladas e faixas reutilizadas.
- `offer-themes/<tema>/originais/`: primeira produção de materiais, incluindo Story. Não são fotos aprovadas de produtos.
- `library/docs/`: evidências de outras áreas e temas ainda sem substitutos; as pranchas sazonais foram movidas para as pastas dos temas.
- `library/painel-local/artifacts/`: evidências históricas do painel.
- `library/supabase/seeds/promotion-assets/`: materiais de importação; não publicar sem conferir validade.
- `library/bom-pra-voce-novo/public/`: originais dos ícones públicos. O comando de build/start gera cópias em `public/` para preservar URLs.

As fotos cadastradas pelo operador são dados, não arquivos do código: rascunhos no IndexedDB e versões publicadas em `promotion-public/products/` no Supabase. Nenhuma imagem conceitual é automaticamente aprovada como foto de produto. Publicações usam caminhos imutáveis por campanha e conteúdo.

O inventário de movimentação e os hashes de integridade estão em `tools/image-moves.json`, na raiz do repositório. Imagens exportadas em build/dist e artefatos de execução são derivados.
