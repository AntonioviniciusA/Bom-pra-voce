import { useEffect, useRef } from "react";
import { storeConfig } from "../../Data/storeConfig";
export default function ApplicationReceipt({ receipt }) {
  const heading = useRef(null);
  useEffect(() => heading.current?.focus(), []);
  return <section className="receipt" aria-labelledby="receipt-title">
    <p className="eyebrow">{storeConfig.name}</p>
    <h2 id="receipt-title" tabIndex="-1" ref={heading}>Currículo recebido</h2>
    <p>Guarde seu comprovante de recebimento.</p>
    <dl className="receipt-details">
      <dt>Protocolo</dt><dd>{receipt.protocol}</dd>
      <dt>Nome</dt><dd>{receipt.candidate_name}</dd>
      <dt>Recebido em</dt><dd>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(receipt.received_at))} (Brasília)</dd>
      {receipt.area && <><dt>Área de interesse</dt><dd>{receipt.area}</dd></>}
      <dt>Arquivo</dt><dd>{receipt.file_name}</dd>
    </dl>
    <p>Confirma apenas o recebimento do currículo; não garante contratação ou leitura pelo RH. O arquivo pode passar por verificação de segurança.</p>
    <p>Não há consulta de andamento pelo site. Salve este comprovante antes de sair da página.</p>
    <button type="button" className="button no-print" onClick={() => window.print()}>Imprimir ou salvar em PDF</button>
    <p className="small no-print">Na janela de impressão, escolha “Salvar como PDF”, se disponível. Se a impressão falhar, tente novamente; não reenvie o currículo.</p>
  </section>;
}
