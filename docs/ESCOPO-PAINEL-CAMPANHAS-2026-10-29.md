# Painel de campanhas e produtos

Data: 29/10/2026. Status: escopo desejado, somente documentação. Não implementado nesta tarefa.

## Direção definida pelo usuário

O painel deve servir apenas para mudar a campanha e cadastrar ou alterar os produtos das ofertas. Cada campanha terá sua apresentação previamente configurada no site, pronta para receber os produtos e a indicação do tema ativo.

Esta orientação substitui propostas anteriores de edição visual de campanhas pelo painel. Os guias existentes continuam registrando o funcionamento anterior; este documento descreve o comportamento futuro desejado.

Exemplo: o operador escolhe Black Friday, cadastra ou atualiza as ofertas e publica. O site aplica a apresentação de Black Friday já preparada.

## O que fica no site

- Catálogo de campanhas disponíveis, com identificadores estáveis.
- Layout, cores, fontes, fundos, ilustrações, títulos e composição de cada tema.
- Versões para celular e computador e regras de apresentação dos produtos.
- Aplicação do tema ativo e exibição dos produtos publicados e válidos.
- Inclusão de novos temas e mudanças de aparência por atualização do próprio site.

## O que fica no painel

O fluxo principal terá duas áreas:

1. **Campanha:** escolher uma campanha pronta, identificar qual está ativa, conferir a prévia e confirmar a troca.
2. **Produtos das ofertas:** cadastrar, editar, associar ou retirar produtos e atualizar seus preços, unidades, fotos e validade promocional.

Reaproveitar os dados comerciais já tratados pelo projeto: nome, marca, conteúdo, variantes e respectivos códigos, imagem, preço e unidade de venda. Manter a validade da oferta separada do vencimento da embalagem ou lote, quando informado.

O painel não terá editor de layout, cores, fontes, fundos, artes ou estrutura dos cards. A operação não deve exigir preenchimento de configurações técnicas para utilizar campanhas prontas.

Recomenda-se preservar rascunho, prévia e uma ação explícita para publicar. Salvar localmente e publicar precisam ter resultados claros. Uma falha não pode ser apresentada como publicação concluída.

## Troca da campanha

- Proposta: uma campanha temática ativa por vez. Confirmar essa regra antes da implementação, pois a leitura atual admite uma lista de campanhas.
- O site recebe o identificador do tema e os dados comerciais; a definição visual fica no site.
- Publicar tema e produtos como uma versão consistente, sem combinar o tema novo com produtos da versão anterior.
- Recomenda-se guardar produtos associados a cada campanha. Trocar o tema não deve copiar, apagar ou reaproveitar ofertas automaticamente.
- Recomenda-se impedir a ativação sem ao menos uma oferta válida. O site também precisa tratar a ausência de ofertas após sua expiração.
- Escolher um tema não renova ofertas vencidas nem implica ativação automática por calendário. Período e validade continuam sendo dados comerciais.

## Carregamento com a identidade do site

Durante a consulta da campanha ativa, dos produtos e dos recursos visuais essenciais do tema, exibir um carregamento com a identidade do Bom pra Você.

Direção visual proposta:

- Marca existente, tipografia do site, amarelo, roxo e fundo claro, reutilizando os estilos compartilhados.
- Mensagem **“Carregando nossas ofertas…”**, animação discreta e espaços reservados para os cards.
- Identidade institucional durante a espera, sem antecipar uma campanha antes de saber qual está ativa.
- Espaço reservado para reduzir saltos na página.
- Texto de status acessível e respeito à preferência por movimento reduzido.

Recomenda-se limitar o carregamento à área de campanha e ofertas, mantendo cabeçalho, navegação e informações da loja disponíveis. Bloquear a página inteira exigiria uma necessidade adicional definida.

| Estado | Resultado esperado |
| --- | --- |
| Consulta inicial em andamento | Carregamento institucional na área das ofertas. |
| Dados e identidade essencial prontos | Mostrar tema e produtos da mesma versão juntos. |
| Fotos individuais carregando | Reservar o espaço de cada foto, sem bloquear toda a vitrine por imagens fora da tela. |
| Nenhuma oferta válida | Encerrar a espera e informar a ausência de ofertas. |
| Erro na consulta | Encerrar a espera com mensagem clara e opção de tentar novamente. |
| Tema desconhecido ou arte essencial indisponível | Proposta: usar apresentação institucional padrão se os dados comerciais forem válidos e registrar a falha para correção. |
| Atualização em segundo plano | Preservar a versão anterior apenas enquanto válida; trocar quando a nova estiver pronta e retirar ofertas expiradas mesmo sem resposta da rede. |

Não usar porcentagem fictícia nem um tempo mínimo artificial. Definir limite de espera e política de nova tentativa na implementação, evitando animação infinita após falha. Uma imagem isolada com erro deve ter tratamento próprio.

## Base local consultada

- `bom-pra-voce-novo/src/Components/Tabloide/seasonalThemes.js`: catálogo visual com recursos por tamanho e seleção explícita, sem ativação automática pelo calendário.
- `bom-pra-voce-novo/src/services/productShowcase.js`: leitura e validação de campanhas e produtos, com filtro de validade pelo horário informado pelo servidor.
- `bom-pra-voce-novo/src/index.css`: cores e fontes do site.
- `painel-local/src/OffersWorkspace.jsx`: alternância existente entre vitrine e panfletos.
- [Vitrine e painel](vitrine-painel.md): fluxo anterior de cadastro, rascunho e publicação.

A consulta identifica pontos de partida locais. Não confirma comportamento em produção nem valida a publicação remota.

## Decisões ainda abertas

1. **Alcance de “painel apenas”:** o fluxo de campanhas terá o escopo reduzido descrito aqui. Antes de retirar outros módulos existentes, como currículos e publicações, confirmar se o pedido abrange o painel inteiro.
2. **Campanhas e produtos:** confirmar uma campanha ativa por vez e a proposta de guardar os produtos por campanha; definir se haverá reaproveitamento manual em outra campanha.
3. **Ordem e destaque:** definir se o operador poderá ordenar produtos e marcar destaques, sem editar o layout.

As recomendações deste documento são propostas para a futura implementação, não decisões adicionais já aprovadas pelo usuário.

## Critérios de aceite futuros

- Escolher uma campanha pronta e cadastrar ou alterar produtos sem configurar aparência.
- Aplicar no site a identidade previamente definida para a campanha publicada.
- Nunca misturar tema e produtos de versões diferentes durante a troca.
- Exibir carregamento institucional em celular e computador.
- Diferenciar carregamento, sucesso, ausência de ofertas e erro.
- Não bloquear indefinidamente as ofertas por falha de uma foto.
- Preservar validações comerciais, validade, autenticação, permissões e confirmação real da publicação.
- Resolver as decisões abertas antes de remover módulos ou mudar a regra de campanhas simultâneas.

## Limite desta entrega

Somente documentação. Nenhum código de aplicação, configuração, banco de dados, campanha ou publicação foi alterado nesta tarefa. As alterações já existentes no diretório foram preservadas.
