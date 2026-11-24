**Source visual truth**

- `C:\Users\anton\AppData\Local\Temp\codex-clipboard-aa34b9a1-a28f-4d46-8d29-3fc540f111c5.png` — desktop, posição inicial reta.
- `C:\Users\anton\AppData\Local\Temp\codex-clipboard-55b485b1-b0fe-4be0-845e-042fed8bd336.png` — desktop, estado arredondado após rolagem.
- `C:\Users\anton\Downloads\logo_bom_pra_voce_vetorizada.svg` — marca final aprovada.

**Implementation evidence**

- Site real: `http://127.0.0.1:3000/`.
- Desktop: viewport 1351 × 635 CSS px, device scale 1; estados no topo e após 613 px de rolagem conferidos no navegador.
- Mobile: viewport 390 × 844 CSS px, device scale 1; estados no topo e após rolagem conferidos no navegador.
- Console: nenhuma falha da implementação observada durante a navegação.

**Required fidelity surfaces**

- Fonts and typography: navegação com peso forte, legível e sem quebras; marca preservada pelo SVG original.
- Spacing and layout rhythm: barra ocupa toda a largura no topo; após rolagem, margem de 16 px, redução de altura e raio de pílula correspondem à referência.
- Colors and visual tokens: amarelo sólido, contorno preto e item ativo preto/branco conferidos nos dois estados.
- Image quality and asset fidelity: SVG vetorial fornecido pelo usuário, sem reconstrução em CSS ou perda de nitidez.
- Copy and content: rótulos reais do site preservados.

**Interaction evidence**

- A classe `is-scrolled` foi observada após a rolagem e a transição levou ao estado arredondado.
- Menu móvel permaneceu disponível e o layout não apresentou transbordamento horizontal no viewport de 390 px.
- A preferência `prefers-reduced-motion` continua desativando transições globais.

**Findings**

- Nenhuma diferença P0, P1 ou P2 permaneceu após a conferência.
- P3 aceitável: os rótulos do site real diferem da ilustração de referência para preservar a arquitetura de navegação atual.

**Comparison history**

- Primeira captura do protótipo confirmou proporção, contraste e estado reto.
- Implementação real foi conferida no topo e após rolagem; nenhuma correção P0/P1/P2 foi necessária.

**Final result**

final result: passed
