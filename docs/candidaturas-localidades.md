# Cidade e bairro na candidatura

Implementado em 07/11/2026, preservando os estilos e o contrato `address` do formulário/painel. A cidade é enviada como `Cidade - UF` e o bairro, quando informado, é acrescentado com ` — `. Ambos continuam opcionais. Não há migração nem consulta externa durante o preenchimento.

O seletor começa pelas 35 regiões administrativas do DF, seguido pelos 11 municípios da Região Metropolitana do Entorno em Goiás. Esse recorte inicial não representa toda a RIDE. Planaltina/DF e Planaltina/GO são opções distintas.

Os bairros/setores são sugestões iniciais, não um cadastro completo ou uma delimitação territorial oficial. Algumas localidades ainda não têm sugestões; nesses casos o usuário pode escolher “Outro bairro / setor” e digitar. “Outra cidade / região” também permite entrada manual. Trocar a cidade limpa o bairro e os textos anteriores. Os textos livres têm limite de 90 caracteres cada, respeitando o limite de 200 do endereço composto.

## Referências consultadas

- [IDE/DF — Regiões administrativas](https://www.geoservicos.ide.df.gov.br/arcgis/rest/services/Publico/IDEDF/MapServer/123).
- [Governo de Goiás — 11 municípios do Entorno](https://agencia.go.gov.br/ibge-reconhece-regiao-metropolitana-do-entorno-do-distrito-federal/).
- [SES/DF — localidades, tabela atualizada em janeiro de 2025](https://www.saude.df.gov.br/documents/37101/0/TABELA_CODEPLAN_2025_SINAN%2B%281%29.pdf/c4ac2bc3-ad7b-c8e4-20ef-ec63faf8a014?t=1768567549118): sugestões de setores e localidades do DF. A classificação sanitária não deve ser tratada como delimitação cadastral.
- [TRE/DF — localidades das zonas eleitorais](https://www.tre-df.jus.br/institucional/corregedoria-regional-eleitoral): Jardim Botânico e São Sebastião.
- [SEDUC/GO — endereços escolares](https://goias.gov.br/educacao/lista-de-escolas-rede-estadual-de-educacao/): Valparaíso e Jardim Ingá.
- [ANTT — transporte do Entorno](https://www.gov.br/antt/pt-br/assuntos/noticias/licitacao-de-onibus-do-entorno-do-df-e-liberada-pelo-tcu): Girassol e Monte Alto.
- [ANTT — localidades atendidas](https://www.gov.br/antt/pt-br/assuntos/passageiros/transportesemiurbano/convenio-taguatur/licitacoes-de-linhas-do-sistema-de-transporte-rodoviario-coletivo-interestadual-e-internacional-de-passageiros.pdf): Mansões Marajó, Jardim ABC e Jardim Ingá.
- [Bombeiros/GO — localidades no estudo de trânsito](https://www.bombeiros.go.gov.br/wp-content/uploads/2017/08/10-Aldeci-de-Ara%C3%BAjo-Pereira-PERFIL-DOS-ACIDENTES-DE-TR%C3%82NSITO-ATENDIDOS-NA-%C3%81REA-DO-5%C2%BA-BATALH%C3%83O-BOMBEIRO-MILITAR-GOI%C3%81S1.pdf): Novo Gama e Valparaíso.

Para ampliar a cobertura, editar `applicationLocations.js`, verificando o vínculo de cada bairro com sua cidade. As referências incluem documentos históricos: não usar a lista para validar CEP, limites administrativos ou rejeitar endereços.

## Validação

Testes do componente verificam filtro por cidade, limpeza do bairro anterior, localidades livres e distinção entre Planaltina/DF e GO. O teste integrado do formulário verifica o endereço entregue à sessão de envio e sua preservação/bloqueio na tentativa de confirmação após falha de rede. Não é um envio real ao serviço remoto.
