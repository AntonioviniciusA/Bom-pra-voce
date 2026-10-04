// PDFs are opened by the browser, avoiding concurrent canvas rendering.
export default function TabloideView({ pdfUrl }) {
  return <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Abrir panfleto em nova aba</a>;
}
