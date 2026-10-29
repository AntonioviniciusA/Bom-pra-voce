import { render, screen, fireEvent, within, act } from '@testing-library/react';
import Cards from './Cards';

test('shows artwork covers and opens a two-photo gallery instead of the cover', () => {
  render(<Cards />);
  const card = screen.getByRole('button', { name: 'Conheça o setor Hortifrúti' });
  const cover = card.querySelector('img').getAttribute('src');
  card.focus();
  fireEvent.click(card);
  const dialog = screen.getByRole('dialog');
  const first = dialog.querySelector('.sector-modal__main-image').getAttribute('src');
  expect(first).not.toBe(cover);
  expect(within(dialog).getAllByRole('button', { name: /Ver foto/ })).toHaveLength(2);
  fireEvent.click(within(dialog).getByRole('button', { name: 'Próxima foto' }));
  expect(dialog.querySelector('.sector-modal__main-image').getAttribute('src')).not.toBe(first);
  expect(within(dialog).getByRole('heading')).toHaveTextContent('Hortifrúti');
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(card).toHaveFocus();
});

test('merges drinks and wine, includes dairy, and resets the gallery when opening another sector', () => {
  render(<Cards />);
  expect(screen.queryByRole('button', { name: 'Conheça o setor Adega' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Conheça o setor Bebidas e Adega' }));
  fireEvent.keyDown(document, { key: 'ArrowRight' });
  expect(screen.getByText('2 / 3')).toBeInTheDocument();
  fireEvent.keyDown(document, { key: 'ArrowRight' });
  expect(screen.getByAltText('Adega de madeira com vinhos, espumantes e destilados')).toBeInTheDocument();
  fireEvent.keyDown(document, { key: 'ArrowLeft' });
  expect(screen.getByText('2 / 3')).toBeInTheDocument();
  fireEvent.keyDown(document, { key: 'Escape' });
  fireEvent.click(screen.getByRole('button', { name: 'Conheça o setor Laticínios e Frios' }));
  expect(screen.getByText('1 / 2')).toBeInTheDocument();
});

test('keeps keyboard focus inside the dialog and identifies the bakery crop honestly', () => {
  render(<Cards />);
  fireEvent.click(screen.getByRole('button', { name: 'Padaria — Em breve' }));
  expect(screen.getByText(/Vista e detalhe da mesma foto/)).toBeInTheDocument();
  const close = screen.getByRole('button', { name: 'Fechar detalhes do setor' });
  expect(close).toHaveFocus();
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  expect(screen.getByRole('button', { name: 'Próximo setor' })).toHaveFocus();
  fireEvent.keyDown(document, { key: 'Tab' });
  expect(close).toHaveFocus();
});


test('cycles through every sector without closing, resets photos, and restores the original trigger', () => {
  jest.useFakeTimers();
  render(<Cards />);
  const trigger = screen.getByRole('button', { name: 'Conheça o setor Bebidas e Adega' });
  trigger.focus();
  fireEvent.click(trigger);
  const dialog = screen.getByRole('dialog');
  const next = within(dialog).getByRole('button', { name: 'Próximo setor' });
  next.focus();
  for (const name of ['Hortifrúti', 'Laticínios e Frios', 'Congelados', 'Padaria', 'Bebidas e Adega']) {
    fireEvent.click(screen.getByRole('button', { name: 'Próxima foto' }));
    fireEvent.click(next);
    expect(screen.getByRole('dialog')).toBe(dialog);
    expect(within(dialog).getByRole('heading')).toHaveTextContent(name);
    expect(next).toHaveFocus();
    expect(document.body).toHaveClass('sector-modal-open');
    expect(trigger.closest('[inert]')).not.toBeNull();
    expect(within(dialog).getByRole('button', { name: 'Ver foto 1' })).toHaveAttribute('aria-pressed', 'true');
    act(() => jest.advanceTimersByTime(480));
  }
  fireEvent.click(screen.getByRole('button', { name: 'Setor anterior' }));
  expect(within(dialog).getByRole('heading')).toHaveTextContent('Padaria');
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(trigger).toHaveFocus();
  expect(trigger.closest('[inert]')).toBeNull();
  act(() => jest.runOnlyPendingTimers());
  jest.useRealTimers();
});

test('supports horizontal swipes and sector shortcuts, ignores vertical swipes, and honors reduced motion', () => {
  const originalMatchMedia = window.matchMedia;
  window.matchMedia = jest.fn(() => ({ matches: true }));
  render(<Cards />);
  fireEvent.click(screen.getByRole('button', { name: 'Conheça o setor Congelados' }));
  const dialog = screen.getByRole('dialog');
  const stage = dialog.querySelector('.sector-modal__stage');
  fireEvent.touchStart(stage, { touches: [{ clientX: 250, clientY: 120 }] });
  fireEvent.touchEnd(stage, { changedTouches: [{ clientX: 50, clientY: 125 }] });
  expect(within(dialog).getByRole('heading')).toHaveTextContent('Padaria');
  expect(stage.querySelector('.is-outgoing')).toBeNull();
  fireEvent.touchStart(stage, { touches: [{ clientX: 250, clientY: 120 }] });
  fireEvent.touchEnd(stage, { changedTouches: [{ clientX: 180, clientY: 350 }] });
  expect(within(dialog).getByRole('heading')).toHaveTextContent('Padaria');
  fireEvent.keyDown(document, { key: 'ArrowLeft', altKey: true });
  expect(within(dialog).getByRole('heading')).toHaveTextContent('Congelados');
  fireEvent.keyDown(document, { key: 'ArrowRight' });
  expect(screen.getByText('2 / 2')).toBeInTheDocument();
  window.matchMedia = originalMatchMedia;
});

test('rapid navigation does not stack animated pages and closing cancels the transition', () => {
  jest.useFakeTimers();
  render(<Cards />);
  fireEvent.click(screen.getByRole('button', { name: 'Conheça o setor Congelados' }));
  const next = screen.getByRole('button', { name: 'Próximo setor' });
  fireEvent.click(next);
  fireEvent.click(next);
  expect(screen.getByRole('heading', { name: 'Padaria' })).toBeInTheDocument();
  expect(document.querySelectorAll('.is-outgoing')).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: 'Fechar detalhes do setor' }));
  act(() => jest.runOnlyPendingTimers());
  fireEvent.click(screen.getByRole('button', { name: 'Conheça o setor Hortifrúti' }));
  expect(screen.getByRole('heading', { name: 'Hortifrúti' })).toBeInTheDocument();
  expect(document.querySelector('.is-outgoing')).toBeNull();
  jest.useRealTimers();
});
