import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PrivacyPreferences, { usePrivacyPreferences } from "./PrivacyPreferences";
import StoreVisit from "./StoreVisit/StoreVisit";
function Settings() {
  const { openPreferences } = usePrivacyPreferences();
  return <button onClick={openPreferences}>Preferências</button>;
}
function mount() { return render(<MemoryRouter><PrivacyPreferences><StoreVisit /><Settings /></PrivacyPreferences></MemoryRouter>); }
beforeEach(() => { localStorage.clear(); Element.prototype.scrollIntoView = jest.fn(); });
test("does not mount Google before permission, remembers rejection and revokes permission", () => {
  const view = mount();
  expect(document.querySelector('iframe')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Rejeitar opcionais' }));
  expect(document.querySelector('iframe')).toBeNull();
  view.unmount();
  mount();
  expect(screen.queryByRole('button', { name: 'Permitir mapa do Google' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Preferências' }));
  fireEvent.click(screen.getByRole('button', { name: 'Permitir mapa do Google' }));
  expect(document.querySelector('iframe')).toHaveAttribute('src', expect.stringContaining('maps.google.com'));
  fireEvent.click(screen.getByRole('button', { name: 'Preferências' }));
  fireEvent.click(screen.getByRole('button', { name: 'Rejeitar opcionais' }));
  expect(document.querySelector('iframe')).toBeNull();
});
test("expired or malformed storage does not grant permission", () => {
  localStorage.setItem('bpv-privacy-v1', JSON.stringify({ version: 1, maps: true, at: 1 }));
  const view = mount();
  expect(document.querySelector('iframe')).toBeNull();
  view.unmount();
  localStorage.setItem('bpv-privacy-v1', '{broken');
  mount();
  expect(document.querySelector('iframe')).toBeNull();
});
