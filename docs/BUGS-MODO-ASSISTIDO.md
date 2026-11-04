# Bugs encontrados no modo assistido

Registro operacional de comportamentos encontrados durante cadastros assistidos no painel Bom Pra Você.

## Como registrar

Cada ocorrência deve informar:

- data e horário;
- tela e operação;
- resultado esperado e resultado observado;
- passos mínimos para reproduzir;
- produto ou GTIN afetado, sem registrar senhas, códigos TOTP ou tokens;
- evidências disponíveis, como mensagem apresentada e captura de tela;
- impacto e alternativa segura utilizada;
- situação: `a confirmar`, `confirmado`, `corrigido` ou `não reproduzido`;
- arquivos ou testes relacionados à correção.

O modo assistido deve pausar a operação afetada quando houver risco de sobrescrever dados, cadastrar o produto errado ou publicar conteúdo. Falhas externas de rede, autenticação ou Supabase devem ser registradas separadamente de defeitos confirmados do painel.

## Ocorrências

### 04/11/2026 — falha ao carregar por template literal aninhado

- Tela e operação: inicialização do painel após ampliar a telemetria de campos inválidos.
- Esperado: o Electron iniciar e o modo assistido informar `invalidFields`.
- Observado: `SyntaxError: Unexpected identifier '$'` em `electron/assistant.cjs`.
- Causa confirmada: uso de `${...}` dentro do template literal que constrói `assistantScript`.
- Impacto: o painel não abriu; nenhum produto ou rascunho foi alterado.
- Correção: substituição do template interno por concatenação de strings.
- Prevenção: `node --check electron/assistant.cjs` passa a ser obrigatório antes de reiniciar.
- Situação: corrigido.
