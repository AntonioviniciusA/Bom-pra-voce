import { render, screen, fireEvent, within } from '@testing-library/react';
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
  expect(screen.getByRole('button', { name: 'Próxima foto' })).toHaveFocus();
  fireEvent.keyDown(document, { key: 'Tab' });
  expect(close).toHaveFocus();
});
