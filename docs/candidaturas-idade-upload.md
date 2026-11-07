# Candidaturas: idade e progresso de envio

A interface coleta idade opcional de 15 a 60 anos. A idade declarada fica registrada na candidatura; não é convertida em nascimento. Registros antigos mantêm a data histórica.

O PDF é lido e validado localmente antes do envio (extensão, MIME, tamanho, assinatura e marcador final). Arrastar e soltar e seletor de arquivos usam o mesmo caminho. Nenhum arquivo é enviado apenas por ser selecionado.

A porcentagem é calculada pelos eventos de bytes de XMLHttpRequest no envio multipart para application-submit. Não é uma porcentagem retornada pelo Supabase nem mede o processamento interno da Edge Function. Depois da transferência, a interface aguarda a resposta e só emite comprovante após validar status, sessão e protocolo. Tentativas de confirmação reutilizam a sessão e o conteúdo.

## Ordem de publicação

1. Aplicar `20261107171643_application_age.sql` ao projeto correto: adiciona idade, RPC v2 restrita a service_role e idade na listagem administrativa.
2. Publicar `application-submit` com a validação compartilhada atualizada. A versão aceita também formulários antigos e preserva seus hashes para retries.
3. Publicar o site e atualizar o painel. Não publicar o formulário novo contra a função antiga, que desconhece idade.
4. Verificar uma candidatura de teste autorizada: idade persistida, arquivo privado, protocolo, repetição sem duplicata e listagem no painel. Conferir rede lenta e perda de conexão.

Os testes locais em PostgreSQL/PGlite não comprovam a implantação remota, CORS, Turnstile, Storage ou inspeção do currículo.
