import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { FilterChips, type SectionFilter } from '../components/FilterChips';
import { SectionHeader } from '../components/SectionHeader';
import { SituationCard } from '../components/SituationCard';
import { EmptyState } from '../components/EmptyState';
import { searchSituations } from '../utils/search';
import { sectionById, stats } from '../data';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function parseSection(raw: string | null): SectionFilter {
  if (!raw || raw === 'all') return 'all';
  const n = Number(raw);
  return Number.isInteger(n) && sectionById.has(n) ? n : 'all';
}

export function Home() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const section = parseSection(params.get('section'));
  const searchRef = useRef<HTMLInputElement>(null);

  useDocumentTitle(query ? `“${query}”` : undefined);

  // Support the /?...#search manifest shortcut: focus the field on load.
  useEffect(() => {
    if (window.location.hash === '#search') searchRef.current?.focus();
  }, []);

  const setQuery = useCallback(
    (value: string) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) next.set('q', value);
          else next.delete('q');
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const setSection = useCallback(
    (value: SectionFilter) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === 'all') next.delete('section');
          else next.set('section', String(value));
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const reset = useCallback(() => {
    setParams({}, { replace: true });
    searchRef.current?.focus();
  }, [setParams]);

  const groups = useMemo(() => searchSituations(query, section), [query, section]);
  const total = groups.reduce((n, g) => n + g.situations.length, 0);

  const resultMeta = useMemo(() => {
    const q = query.trim();
    if (total === 0) {
      return q ? `No matches for “${q}”.` : 'No matches.';
    }
    if (q || section !== 'all') {
      const scope =
        section === 'all'
          ? `across all ${stats.sections} sections`
          : `in ${sectionById.get(section)?.title ?? ''}`;
      const noun = total === 1 ? 'situation' : 'situations';
      return `${total} ${noun} ${q ? `matching “${q}” ` : ''}${scope}.`;
    }
    return `${stats.situations} situations across ${stats.sections} sections.`;
  }, [query, section, total]);

  return (
    <div className="home">
      <div className="home__intro">
        <p className="home__eyebrow">HPB · High Performer Blueprint</p>
        <h1 className="home__title">Your Career System</h1>
        <p className="home__tagline">Look up your situation. Find the tool. Open the page.</p>
      </div>

      <div className="home__controls" id="search">
        <SearchBar
          ref={searchRef}
          value={query}
          onChange={setQuery}
          onClear={reset}
          resultMeta={resultMeta}
        />
        <FilterChips value={section} onChange={setSection} />
      </div>

      {total === 0 ? (
        <EmptyState onReset={reset} query={query.trim() || undefined} />
      ) : (
        <div className="home__results">
          {groups.map((group) => (
            <section
              key={group.section.id}
              className="section"
              aria-label={group.section.title}
            >
              <SectionHeader section={group.section} count={group.situations.length} />
              <div className="section__cards">
                {group.situations.map((situation) => (
                  <SituationCard
                    key={situation.id}
                    situation={situation}
                    query={query}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
