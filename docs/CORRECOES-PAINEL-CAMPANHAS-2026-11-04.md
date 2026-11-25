# Correções do painel de campanhas — 04/11/2026

## Situação deste documento

Este documento foi criado antes da implementação para registrar o diagnóstico, o comportamento esperado e os critérios de aceite. As correções foram implementadas após a confirmação das duas decisões pendentes e validadas por testes automatizados e compilação em 04/11/2026.

## Objetivo

Reduzir interrupções durante a montagem da campanha, tornar a conferência de fotos efetiva e rastreável, impedir inclusões duplicadas de forma visível e melhorar a entrada de preço e a navegação por teclado sem diminuir a proteção do painel.

## Evidências analisadas

1. Modal **Painel bloqueado** informa bloqueio após 15 minutos.
2. Modal **Autorizar por 1 hora** exibe o campo do autenticador como uma coluna de pontos, em vez de seis caixas horizontais.
3. Etapa **Conferir e publicar** mostra seis pendências de vencimento, mas cada pendência é apenas texto e não leva ao campo que precisa ser corrigido.
4. Catálogo mostra produtos com os estados **Conferido** e **Revisar cadastro**, mas a conferência da foto depende de abrir a edição completa.
5. Tabela da campanha exige preço com separador decimal e não oferece um fluxo completo por teclado entre preço, unidade, vencimento e o produto seguinte.

## Lista documentada de correções

### CP-01 — Bloqueio do painel após 1 hora e 30 minutos

**Estado atual:** o painel bloqueia após 15 minutos sem atividade e o texto do modal repete esse prazo. O bloqueio também ocorre imediatamente quando o Windows é bloqueado.

**Correção proposta:**

- alterar somente o tempo de inatividade do painel de 15 para 90 minutos;
- manter o bloqueio imediato quando o Windows for bloqueado;
- atualizar o texto para: “O painel ficou 1 hora e 30 minutos sem atividade ou o Windows foi bloqueado.”;
- manter a exigência do código autenticador para desbloquear;
- manter o tempo do modo assistido separado e inalterado em 1 hora.

**Critérios de aceite:**

- com menos de 90 minutos de inatividade, o painel não abre o bloqueio automático;
- ao completar 90 minutos, o modal de bloqueio é aberto;
- bloquear o Windows abre o modal independentemente do tempo de inatividade;
- digitar, clicar ou alterar um campo reinicia a contagem quando o painel está desbloqueado;
- ativar ou renovar o modo assistido continua gerando uma autorização de 60 minutos.

### CP-02 — Corrigir o modal de código do modo assistido

**Causa confirmada no código:** a regra visual `.assistant-mode span` alcança também os elementos internos do campo de código. Como o modal fica dentro do banner do modo assistido, essa regra substitui a organização em grade das seis caixas e as empilha verticalmente.

**Correção proposta:**

- limitar os estilos do resumo do banner aos elementos diretamente pertencentes ao banner;
- impedir que os estilos do banner vazem para o modal;
- preservar seis caixas horizontais, foco visível, entrada somente numérica e colagem dos seis dígitos;
- manter o botão **Autorizar conexão** desabilitado até os seis dígitos serem preenchidos;
- manter o título **Autorizar por 1 hora** e a duração real de 60 minutos.

**Critérios de aceite:**

- as seis caixas aparecem lado a lado em desktop e se ajustam sem corte na menor largura suportada;
- clicar em qualquer área das caixas posiciona o foco no campo;
- digitação, colagem, Backspace e código inválido funcionam sem deformar o modal;
- o modal de desbloqueio e o modal do modo assistido usam o mesmo componente visual sem regressão.

### CP-03 — Digitação monetária automática nos preços

**Estado atual:** o campo é numérico e transforma diretamente o valor digitado em reais; para informar centavos, o operador precisa inserir o separador decimal.

**Correção proposta:** usar entrada monetária por centavos, mantendo `priceCents` como inteiro no armazenamento. Os dígitos entram da direita para a esquerda:

- `3` → `R$ 0,03`;
- `34` → `R$ 0,34`;
- `349` → `R$ 3,49`;
- `1099` → `R$ 10,99`.

Backspace remove o último dígito; colagem aceita números e valores já formatados; letras e símbolos inválidos são ignorados. A exibição usa o padrão brasileiro de reais e centavos.

**Critérios de aceite:**

- não é necessário digitar vírgula ou ponto;
- o valor exibido e o número de centavos salvo sempre correspondem;
- apagar todos os dígitos deixa o campo vazio e mantém a pendência de preço;
- valores colados como `10,99`, `R$ 10,99` e `1099` seguem uma regra coberta por testes e não geram centavos incorretos;
- foco, seleção e leitura por tecnologia assistiva continuam identificando o campo como preço do produto correspondente.

### CP-04 — Voltar da conferência para corrigir a pendência certa

**Estado atual:** existe um botão geral **Voltar aos produtos**, mas as pendências do checklist não são acionáveis e não levam ao produto/campo relacionado.

**Correção proposta:**

- transformar cada pendência de produto em uma ação **Corrigir**;
- para preço, unidade ou vencimento, voltar à tabela da campanha, localizar a linha, limpar filtros que a escondam e focar o campo correspondente;
- para foto, código, GTIN ou cadastro, abrir a edição do produto correto;
- para dados da campanha, voltar à seção **Dados da campanha** e focar o campo relacionado;
- preservar todos os valores já preenchidos e o estado da campanha durante a navegação.

**Critérios de aceite:**

- cada uma das seis pendências de vencimento leva ao vencimento do produto correto;
- o produto fica visível mesmo que antes houvesse busca ou filtro ativo;
- foco e destaque temporário deixam claro onde corrigir;
- após salvar/corrigir, a pendência desaparece da conferência sem perder os demais dados.

### CP-05 — Conferência individual de imagens com persistência real

**Estado atual:** a confirmação da foto fica dentro da edição completa do produto. Ao marcar, o painel pede o autenticador, mas a aprovação só passa a fazer parte do catálogo depois do salvamento do produto; isso faz a confirmação parecer ineficaz ou ser perdida ao sair.

**Correção proposta:**

- oferecer uma ação dedicada **Conferir imagem** nos produtos com foto pendente;
- abrir uma única imagem por vez, em tamanho suficiente, junto de nome, marca, conteúdo, variantes/fragâncias, código interno e GTINs;
- após a confirmação de segurança, gravar a aprovação da imagem imediatamente no catálogo local;
- só marcar **Aprovada/Conferida** depois de o salvamento terminar com sucesso;
- se o salvamento falhar, manter a imagem pendente e exibir uma mensagem recuperável;
- alterar, substituir ou remover a imagem, sua origem ou autorização volta a deixá-la pendente;
- permitir retornar à lista e escolher a próxima imagem, sem aprovação coletiva silenciosa.

**Critérios de aceite:**

- a conferência mostra exatamente um produto e uma imagem por vez;
- confirmar uma foto e fechar a tela mantém o produto como conferido depois de reabrir o painel;
- cancelar ou informar código inválido não aprova a imagem;
- uma falha de salvamento não apresenta falso sucesso;
- a pendência de foto some da campanha apenas para o produto efetivamente confirmado.

### CP-06 — Produtos já adicionados claramente marcados e não adicionáveis

**Estado atual:** o código já desabilita a caixa de seleção e filtra inclusões repetidas, inclusive na inclusão por lista. Porém, a linha do catálogo não explica visualmente o motivo do bloqueio.

**Correção proposta:**

- manter o produto visível no catálogo da campanha;
- exibir o marcador **Já adicionado** na própria linha;
- manter a caixa de seleção e qualquer ação de inclusão desabilitadas;
- remover o produto do conjunto de selecionados se ele passar a estar na campanha;
- manter a proteção final que elimina IDs repetidos antes de atualizar a campanha;
- na inclusão por lista, continuar exibindo **Já está na campanha** e não contar o item no botão de inclusão.

**Critérios de aceite:**

- um produto já presente nunca cria uma segunda linha na campanha;
- busca e lista colada mostram claramente o estado **Já adicionado**;
- o marcador não é confundido com **Revisar cadastro**;
- ao remover o produto da campanha, ele volta a poder ser selecionado no catálogo.

### CP-07 — Avanço com Enter nos campos dos produtos da campanha

**Correção proposta:** adotar a sequência de trabalho por linha:

1. preço;
2. unidade;
3. vencimento do lote;
4. preço do próximo produto visível.

Enter avança para o próximo campo sem enviar formulário, remover produto ou alterar a ordem das linhas. `Shift+Enter` retorna ao campo anterior. Campos inválidos não bloqueiam a navegação, mas mantêm indicação de pendência. O fluxo respeita a ordem dos produtos atualmente visíveis após busca/filtro.

**Critérios de aceite:**

- Enter no preço leva à unidade da mesma linha;
- Enter na unidade leva ao vencimento da mesma linha;
- Enter no vencimento leva ao preço da próxima linha visível;
- na última linha, Enter no vencimento mantém o foco em um ponto previsível e não executa outra ação;
- o recurso funciona sem impedir o uso normal de teclado no seletor de unidade e no controle nativo de data;
- foco visível e rótulos acessíveis permanecem presentes.

## Ordem recomendada de implementação

1. CP-02, por ser um defeito visual com causa isolada e afetar as confirmações seguintes.
2. CP-01, mantendo separados os relógios de 90 e 60 minutos.
3. CP-05, para corrigir a perda/ambiguidade da aprovação da foto.
4. CP-04, conectando as pendências às telas e campos corretos.
5. CP-06, tornando explícita a proteção contra duplicidade que já existe parcialmente.
6. CP-03 e CP-07 em conjunto, porque ambos alteram o comportamento de teclado da tabela.

## Verificações previstas após a implementação

- testes unitários dos temporizadores de bloqueio e do modo assistido;
- testes do componente de código nos dois modais;
- testes da máscara monetária, inclusive Backspace e colagem;
- testes de navegação e foco a partir de cada grupo de pendências;
- testes da aprovação individual, persistência, cancelamento e falha de salvamento;
- testes de inclusão por seleção e por lista sem duplicidade;
- testes de Enter e `Shift+Enter` com busca e filtros ativos;
- compilação do painel;
- verificação visual no Electron em desktop e na menor largura suportada;
- teste manual do bloqueio do Windows, que não pode ser comprovado apenas por teste de interface.

## Decisões confirmadas antes da implementação

1. **Autenticador na conferência de fotos:** confirmado pedir o código uma vez e abrir uma sessão de conferência de até 10 minutos. Cada imagem continua sendo apresentada e aprovada individualmente. Se o prazo terminar, o código é solicitado novamente antes da próxima aprovação.
2. **Enter na tabela:** confirmada a sequência `preço → unidade → vencimento → preço do próximo produto`.

## Resultado da validação local

- suíte completa do painel: 16 arquivos e 74 testes aprovados;
- compilação de produção concluída;
- o aviso de pacote JavaScript acima de 500 kB continua sendo apenas uma recomendação de divisão do pacote e não bloqueou a compilação;
- a execução real no Electron, o bloqueio físico do Windows e a conferência visual final ainda dependem de validação manual no computador.

