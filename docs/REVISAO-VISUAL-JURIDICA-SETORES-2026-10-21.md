# Revisão visual, jurídica e artes dos setores — 21/10/2026

## Escopo e evidências

Revisão do site público no navegador integrado e do projeto local `bom-pra-voce-novo`. O domínio publicado ainda apresenta a versão anterior às correções locais desta conversa. Nenhum texto ou imagem foi publicado nesta tarefa.

Capturas desta revisão em `docs/revisao-visual-juridica-2026-10-21/`:

1. **Setores publicados — melhoria necessária:** a capa de Bebidas/Adega combinava duas artes com fundos distintos; os títulos ficavam sobre as imagens. A nova série usa composição uniforme e nomes abaixo das artes, mantendo a identificação da padaria em reforma.
2. **Privacidade publicada — revisão necessária:** texto curto, sem navegação entre assuntos e com subtítulos visualmente desproporcionais no celular. O projeto local agora possui introdução, atalhos e hierarquia mais equilibrada, além das informações acrescentadas na auditoria anterior.
3. **Setores locais após revisão:** cinco ilustrações da mesma família, sem preços, marcas, palavras geradas ou representação fictícia da fachada/interior. Cartões são botões HTML nativos, mantendo teclado, foco e galeria existente.
4. **Textos jurídicos locais após revisão:** termos com direitos relativos às ofertas e esclarecimento sobre as ilustrações; privacidade com texto mais simples e canais separados.

## Novas imagens

Arquivos finais: `bom-pra-voce-novo/src/images/Setores/ilustracoes/`:

- `bebidas.webp`: vinho, água, suco e latas sem marcas.
- `hortifruti.webp`: frutas, verduras e legumes.
- `laticinios.webp`: leite, iogurte, queijo e frios.
- `congelados.webp`: vegetais congelados e sorvete.
- `padaria.webp`: pães e croissant; cartão continua sinalizando reforma, sem afirmar disponibilidade atual.

Criados com **image_gen integrado**, não via API/CLI. Prompts exatos registrados em `revisao-visual-juridica-2026-10-21/prompts-imagens.json`. Cada imagem foi gerada separadamente; a primeira foi usada como referência de estilo das demais. Paleta creme/amarelo/roxo, fundo limpo, iluminação de estúdio e produtos sem identificação comercial. Exportação WebP em 720 × 720 px, aproximadamente 345 KiB no total para as cinco imagens. Arquivos anteriores preservados; os componentes passam a importar as novas versões.

As imagens são representativas das categorias; não comprovam estoque, variedade exata ou disponibilidade. A galeria de ambientes anterior foi preservada; a origem/autenticidade dessas imagens existentes não foi certificada nesta revisão. Os `alt` vazios das capas são intencionais: o botão tem nome acessível e a legenda contém o nome do setor. Imagens informativas da galeria mantêm descrições próprias.

## Revisão jurídica

### Ajustes realizados

- Termos esclarecem o caráter informativo do site e a compra presencial, sem usar isso para afastar o cumprimento de ofertas.
- Inclusão de redação sobre ofertas suficientemente precisas e preservação dos direitos do consumidor, sem cláusula genérica de isenção por erro de preço.
- Imagens ilustrativas são identificadas, mas não apresentadas como motivo para afastar informações corretas ou direitos do consumidor.
- Mudanças dos termos não afastam direitos adquiridos ou condições já vinculantes.
- Canal de currículos/exclusão separado do contato geral da gerente.
- Privacidade usa a mesma razão social exibida no restante do site, evitando a apresentação divergente do sufixo “ME” sem confirmação adicional.
- Informação sobre confirmação proporcional de identidade no atendimento e acesso aos canais da ANPD.
- Detalhes de chaves de armazenamento foram mantidos no inventário técnico da auditoria anterior, enquanto o texto público explica a finalidade em linguagem simples.

### Pendências que não se resolvem apenas com redação

Persistem a definição da hipótese legal de cada finalidade de recrutamento, a comprovação da eliminação após seis meses (inclusive cópias baixadas), contratos/regiões dos fornecedores e mecanismos de transferência internacional. Atualização em 22/10: o responsável confirmou vagas abertas e futuras oportunidades; o texto da finalidade foi atualizado. Não se criou checkbox de consentimento sem suporte de registro no backend.

O prazo de seis meses é uma política informada pela loja, não um prazo universal imposto pela LGPD. A informação deve corresponder ao processo efetivamente executado. Não foi declarada conformidade jurídica integral. A publicação continua exigindo revisão operacional pelo controlador e alinhamento de `PRIVACY_NOTICE_VERSION=2026-10-21` com o frontend.

## Fontes oficiais

- Código de Defesa do Consumidor, arts. 30, 31, 35 e 37: https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm
- ANPD, perguntas frequentes (necessidade, bases legais e duração do tratamento): https://www.gov.br/anpd/pt-br/acesso-a-informacao/perguntas-frequentes
- ANPD, Guia de Legítimo Interesse: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_hipoteses_legais_tratamento_de_dados_pessoais_legitimo_interesse

## Validação desta revisão

- Compilação final concluída, incluindo as quatro páginas institucionais estáticas.
- 15 testes direcionados de App, cartões e banner passaram. Após corrigir o retorno à mesma âncora, os seis testes de App passaram novamente, incluindo o novo teste de regressão (16 casos distintos ao todo).
- ESLint dos componentes alterados e teste de navegação passou. Aviso de base Browserslist antiga permanece.
- Os testes registraram indisponibilidade DNS do serviço de ofertas; isso não comprova funcionamento das ofertas em produção. O navegador local também apresentou a mensagem de indisponibilidade, sem inventar campanhas.
- No navegador integrado: Enter abriu os detalhes de Bebidas; Escape fechou e devolveu o foco ao cartão. Capturas em largura aproximada de 510 px; esta rodada não certifica todos os tamanhos de tela.
- Evidências aceitas: `01-setores-publicados.png`, `02-privacidade-publicada.png`, `03-setores-revisados.png`, `04-cartoes-revisados.png`, `05-visao-setores.png`, `06-privacidade-revisada.png` e `07-termos-revisados.png` na pasta desta revisão. A captura 05 foi substituída por uma vista válida dos cartões.
- Acrescentado aviso de reforma também ao banner da padaria, para evitar sugerir funcionamento normal do setor.
- Corrigida a navegação repetida para a mesma seção, que antes podia manter o visitante no rodapé.
- Sem commit, push ou publicação.

### Limitações de validação

Capturas comprovam apresentação visual no tamanho observado, não conformidade completa WCAG. O fluxo de candidatura real, leitores de tela, eliminação de arquivos e funcionamento dos fornecedores em produção não foram executados. As correções e testes anteriores permanecem descritos em `AUDITORIA-PRIVACIDADE-ACESSIBILIDADE-SEO-2026-10-21.md`.
