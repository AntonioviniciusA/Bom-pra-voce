import { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, FileText, Instagram, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export default function SidebarLayout({ tab, onSelect, children }) {
  const [open, setOpen] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const toggle = useRef(null);
  const navigation = useRef(null);
  useEffect(() => {
    if (!open || hovered || focused) return;
    const timer = setTimeout(() => {
      if (navigation.current?.contains(document.activeElement)) toggle.current?.focus();
      setOpen(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, [open, hovered, focused]);
  function close() {
    setOpen(false); setHovered(false); setFocused(false);
    toggle.current?.focus();
  }
  return <>
    <div className="sidebar-toolbar"><button ref={toggle} type="button" className="admin-quiet" aria-expanded={open} aria-controls="admin-navigation" onClick={() => open ? close() : setOpen(true)}>
      {open ? <PanelLeftClose size={19} /> : <PanelLeftOpen size={19} />}{open ? "Fechar menu" : "Abrir menu"}
    </button></div>
    <div className={`admin-layout${open ? "" : " sidebar-closed"}`}>
      <aside ref={navigation} id="admin-navigation" aria-label="Menu do painel" className="admin-sidebar" hidden={!open}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); setFocused(false); }}
        onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
        onKeyDown={event => { if (event.key === "Escape") close(); }}>
        <button type="button" className={tab === "offers" ? "active" : ""} onClick={() => onSelect("offers")}><FileText size={19} /> Ofertas</button>
        <button type="button" className={tab === "instagram" ? "active" : ""} onClick={() => onSelect("instagram")}><Instagram size={19} /> Instagram</button>
        <button type="button" className={tab === "resumes" ? "active" : ""} onClick={() => onSelect("resumes")}><BriefcaseBusiness size={19} /> Currículos</button>
      </aside>
      {children}
    </div>
  </>;
}
