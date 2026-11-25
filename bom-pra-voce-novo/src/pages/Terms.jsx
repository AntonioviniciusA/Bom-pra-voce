import { Link } from "react-router-dom";
import { storeConfig } from "../Data/storeConfig";
export default function Terms() {
  return <section className="shell section narrow legal-copy"><p className="eyebrow">INFORMAÇÕES DA LOJA</p><h1>Termos de uso</h1>
    <p className="legal-lead">Entenda como consultar as informações e ofertas do Bom Pra Você e como falar com a loja.</p>
    <p>Atualizados em 21 de outubro de 2026.</p>
    <h2>Quem mantém o site</h2><p>{storeConfig.legalName}, CNPJ {storeConfig.cnpj}. {storeConfig.address}.</p>
    <h2>Informações e compras na loja</h2><p>Este site divulga informações do supermercado, panfletos e orientações para candidaturas. As compras são presenciais; o site não oferece pagamento, reserva de estoque ou entrega de pedidos.</p>
    <h2>Ofertas</h2><p>Confira o período de validade e as condições de cada panfleto. As informações de produtos, preços, quantidades e condições devem ser claras. Ofertas suficientemente precisas vinculam o fornecedor nos termos da legislação. Em caso de divergência, procure a loja para esclarecimento e solução. Estes termos não afastam o cumprimento de ofertas nem os demais direitos assegurados pelo Código de Defesa do Consumidor.</p>
    <h2>Imagens dos setores</h2><p>As capas dos setores são ilustrações representativas. Elas não são fotografias das instalações nem anúncios de produtos específicos. Produtos, preços e condições de uma oferta devem ser consultados no respectivo panfleto. A indicação de imagem ilustrativa não afasta a obrigação de informar corretamente.</p>
    <h2>Candidaturas</h2><p>O envio depende da disponibilidade do formulário. Envie informações corretas e apenas documentos necessários à candidatura. O recebimento de currículo não garante contratação. Consulte o <Link to="/privacidade">aviso de privacidade</Link> antes de enviar. Para questões sobre currículos ou pedidos de exclusão, escreva para <a href={`mailto:${storeConfig.privacy.contact}`}>{storeConfig.privacy.contact}</a>.</p>
    <h2>Alterações destas informações</h2><p>A data acima identifica a atualização destes termos. Mudanças futuras não afastam direitos adquiridos nem as condições de ofertas já vinculantes.</p>
    <h2>Serviços externos</h2><p>Links para mapas e outros serviços abrem ambientes de terceiros, com políticas próprias. O mapa incorporado é opcional e sua permissão pode ser alterada no rodapé.</p>
    <h2>Acessibilidade e contato</h2><p>Se encontrar dificuldade de acesso, informe a página e a dificuldade pelo e-mail <a href={`mailto:${storeConfig.email}`}>{storeConfig.email}</a>, sem enviar senhas ou documentos sensíveis.</p>
  </section>;
}
