import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
const Careers = lazy(() => import("./pages/Careers"));
const Privacy = lazy(() => import("./pages/Privacy"));
export function SiteRoutes() {
  return <Suspense fallback={<p className="shell section" role="status">Carregando página…</p>}>
    <Routes><Route element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/trabalhe-conosco" element={<Careers />} />
      <Route path="/privacidade" element={<Privacy />} />
      <Route path="*" element={<section className="shell section"><h1>Página não encontrada</h1><p>Confira o endereço ou volte ao início.</p><Link to="/">Voltar ao início</Link></section>} />
    </Route></Routes>
  </Suspense>;
}
export default function AppRoutes() {
  return <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><SiteRoutes /></BrowserRouter>;
}
