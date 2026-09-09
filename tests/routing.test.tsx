/** Routing / deep-linking. */
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../src/App';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('routes', () => {
  it('/ renders the Home situations directory with the dynamic count', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Your Career System' })).toBeInTheDocument();
    expect(screen.getByText('45 situations across 5 sections.')).toBeInTheDocument();
  });

  it('/tools renders the tools directory', () => {
    renderAt('/tools');
    expect(screen.getByRole('heading', { level: 1, name: 'Tools' })).toBeInTheDocument();
    expect(screen.getByText(/All 22 HPB reference tools/i)).toBeInTheDocument();
  });

  it('/tools/:slug renders a tool detail page with related situations', () => {
    renderAt('/tools/bluf');
    expect(
      screen.getByRole('heading', { level: 1, name: 'BLUF — Bottom-Line-Up-Front' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Related situations/i })).toBeInTheDocument();
    expect(
      screen.getByText('I need to write a clear email to a senior leader'),
    ).toBeInTheDocument();
  });

  it('/situations/:slug deep-links straight to one situation + its tool', () => {
    renderAt('/situations/i-have-a-1-1-coming-up');
    expect(
      screen.getByRole('heading', { level: 1, name: /I have a 1:1 coming up/ }),
    ).toBeInTheDocument();
    expect(screen.getByText('1:1 Anatomy + 6 standard scenarios')).toBeInTheDocument();
  });

  it('unknown route renders the 404 page', () => {
    renderAt('/definitely-not-a-page');
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });

  it('unknown tool slug renders a not-found message', () => {
    renderAt('/tools/no-such-tool');
    expect(screen.getByRole('heading', { name: 'Tool not found' })).toBeInTheDocument();
  });

  it('/situations (index) redirects to Home', () => {
    renderAt('/situations');
    expect(screen.getByRole('heading', { level: 1, name: 'Your Career System' })).toBeInTheDocument();
  });

  it('primary navigation is present (top + bottom)', () => {
    renderAt('/');
    const navs = screen.getAllByRole('navigation', { name: 'Primary' });
    expect(navs.length).toBeGreaterThanOrEqual(2);
    expect(within(navs[0]).getByRole('link', { name: 'Tools' })).toBeInTheDocument();
  });
});
