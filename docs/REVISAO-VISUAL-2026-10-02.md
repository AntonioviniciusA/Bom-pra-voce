# Revisão visual — 02/10/2026

O usuário rejeitou a apresentação genérica da implementação de 01/10 e autorizou recuperar o visual anterior com ajustes pontuais. Esta decisão substitui a direção visual anterior; os contratos e proteções funcionais permanecem.

## Alterações

- Retorno da arte original `PrecoBaixo.png`, sem o hero textual genérico ou o símbolo “B” inventado. Imagem inteira, sem corte no celular; texto alternativo e atalhos HTML para ofertas/localização.
- Cabeçalho arredondado amarelo, próximo da composição original, mantido no fluxo sticky para não encobrir o banner. Menu móvel e foco preservados.
- Retorno das cinco imagens originais de setores, cada uma associada ao próprio nome. Cartões responsivos sem modal/galeria com placeholders.
- Retorno da imagem de apresentação e da arte de recrutamento. Sem recuperar lista de vagas/benefícios fictícios ou alegação de 20 anos.
- Rodapé amarelo com a marca original e texto escuro; FAQ em cartões amarelos arredondados. Mantidos links corretos e retirada da assinatura inoperante.
- Ordem aproximada da página original: banner, ofertas, setores, apresentação, recrutamento; localização e pagamentos acrescentados antes do FAQ.

Não restaurado: arte Quarta Verde, que contém campanha recorrente, endereço e telefone ainda não confirmados; carrossel automático; PDF de teste; galeria falsa; convite de tour sem funcionamento; confirmação fictícia de currículo. Arquivos originais dessas artes continuam no repositório.

## Limites

Retomar as artes aumenta o peso das imagens em comparação com a versão textual. Preservada a fidelidade dos arquivos originais; imagens abaixo da dobra usam lazy loading. Otimização com equivalência visual é trabalho posterior, sem redesenhar as artes. A faixa horizontal do banner fica menor no celular; os atalhos permanecem legíveis e separados da arte.

Permanecem as pendências de dados comerciais, backend e privacidade registradas no [relatório funcional](IMPLEMENTACAO-SITE-PUBLICO-2026-10-01.md). Currículos continuam bloqueados até integração real. Nenhuma alteração no Supabase, painel local ou publicação.

## Validação concluída em 03/10/2026

- Os 23 testes funcionais passaram após a revisão. Build de produção final compilado com sucesso, incluindo o ajuste de CSS para localização e rodapé em uma coluna no celular.
- Conferidas larguras de 360, 390, 768, 1024 e 1440 pixels, sem transbordamento horizontal na versão final. A conferência inicial identificou excesso de largura em 360 pixels, corrigido antes da entrega.
- Menu móvel abre, navega até Pagamentos, fecha e transfere o foco para a seção. Console observado sem erros ou avisos da página.
- Ferramentas de build ainda avisam sobre a base Browserslist antiga e depreciação de fs.F_OK; não impediram a compilação.
- Evidências: [desktop](evidencias-revisao-visual-2026-10-03/desktop.png), [celular](evidencias-revisao-visual-2026-10-03/mobile.png), [larguras](evidencias-revisao-visual-2026-10-03/responsividade.json) e [console](evidencias-revisao-visual-2026-10-03/console.json). Capturas de página inteira podem não incluir imagens com carregamento adiado ainda fora da área visitada.

Prévia local em http://127.0.0.1:4173/. Esta validação confirma a apresentação local; não representa publicação ou operação do recebimento de currículos.
