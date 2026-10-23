import { privacyReady, storeConfig } from "../Data/storeConfig";
export default function Privacy() {
  const p = storeConfig.privacy;
  return <section className="shell section narrow legal-copy"><p className="eyebrow">SEUS DADOS</p><h1>Privacidade</h1>
    <p className="legal-lead">Saiba quais informações são utilizadas, para quais finalidades e como fazer uma solicitação sobre seus dados.</p>
    <nav className="legal-nav" aria-label="Nesta política">{privacyReady() && <><a href="#dados">Dados de candidaturas</a><a href="#direitos">Seus direitos</a></>}<a href="#cookies">Cookies e mapa</a></nav>
    <p>Informações sobre navegação atualizadas em 21 de outubro de 2026. Aviso de candidaturas: versão {p.version}.</p>
    {privacyReady() ? <>
      <h2>Responsável pelo tratamento</h2><p>{storeConfig.legalName} — CNPJ {storeConfig.cnpj}</p><p>{p.controllerAddress}</p>
      <h2>Finalidade do recebimento</h2><p>{p.purpose}</p>
      <h2>Prazo de guarda</h2><p>{p.retention}</p>
      <h2 id="dados">Dados da candidatura</h2><p>O formulário solicita nome, e-mail e currículo em PDF. Telefone, nascimento, cidade/bairro e área de interesse são opcionais. Não envie CPF, RG, dados bancários ou informações sensíveis. O envio gera um protocolo e registra a versão do aviso de privacidade.</p>
      <h2 id="direitos">Seus direitos e contato sobre currículos</h2><p>{p.rights}</p><p>Você também pode pedir confirmação do tratamento, informações sobre compartilhamento e, quando aplicável, anonimização, bloqueio, portabilidade e revogação de consentimento. O atendimento observará os requisitos e exceções da LGPD.</p><p><a href={`mailto:${p.contact}`}>{p.contact}</a>. Informe o pedido e, se disponível, o protocolo. Não envie documentos de identidade sem orientação. Podemos solicitar apenas as informações necessárias para confirmar sua identidade e proteger seus dados durante o atendimento. Se não conseguir resolver sua solicitação com o controlador, você pode recorrer aos canais da <a href="https://www.gov.br/anpd/pt-br/canais_atendimento">Autoridade Nacional de Proteção de Dados (ANPD)</a>.</p>
      <h2>Serviços utilizados</h2><p>Quando o recebimento está habilitado, os dados e o arquivo são enviados à infraestrutura Supabase para processamento da candidatura. A verificação antispam Cloudflare Turnstile recebe informações técnicas do navegador. Esses serviços podem envolver infraestrutura fora do Brasil; consulte o controlador para detalhes sobre o tratamento e os fornecedores.</p>
    </> : <p>O recebimento de currículos pelo site está indisponível enquanto as informações de privacidade são preparadas. Não envie dados pessoais por esta página.</p>}
    <h2>Contato geral da loja</h2><p>A gerente local atende pelo e-mail <a href={`mailto:${storeConfig.email}`}>{storeConfig.email}</a>. Para currículos e exclusão de candidaturas, utilize o canal específico acima.</p>
    <h2 id="cookies">Cookies e conteúdo externo</h2>
    <p>O mapa incorporado do Google só é carregado após sua permissão. Ele pode transmitir IP e dados do navegador ao Google e utilizar cookies sob a política desse fornecedor. Você pode rejeitá-lo e continuar consultando endereço, horários e o link de rotas.</p>
    <p>Sua escolha sobre o mapa é guardada neste navegador por até 180 dias. Não é necessário permitir o mapa para consultar o restante do site ou enviar uma candidatura. Use “Preferências de cookies” no rodapé para alterá-la ou revogar a permissão. A revogação remove o mapa desta página, mas não apaga cookies já definidos no domínio do Google; para isso, use as configurações do navegador.</p>
    <p>O navegador também pode guardar uma cópia de panfletos públicos para agilizar a consulta, sem dados de candidaturas. Antes da exibição, o site verifica a versão e a vigência com o servidor. Essa cópia é substituída quando há atualização e pode ser removida nas configurações do navegador.</p>
    <p>A proteção antispam é carregada no formulário disponível. As integrações atuais do site não incluem publicidade comportamental ou ferramenta de análise de audiência. Serviços de hospedagem podem registrar dados técnicos de acesso.</p>
    <p>Ao abrir um link externo, você acessa o serviço escolhido diretamente. Consulte as políticas do <a href="https://policies.google.com/privacy">Google</a>, da <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare</a> e da <a href="https://supabase.com/privacy">Supabase</a>.</p>
  </section>;
}
