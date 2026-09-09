import { useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { ToolCard } from '../components/ToolCard';
import { EmptyState } from '../components/EmptyState';
import { searchTools } from '../utils/search';
import { stats, toolModules } from '../data';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

type ModuleFilter = 'all' | number;

function parseModule(raw: string | null): ModuleFilter {
  if (!raw || raw === 'all') return 'all';
  const n = Number(raw);
  return toolModules.includes(n) ? n : 'all';
}

export function Tools() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const moduleFilter = parseModule(params.get('module'));
  const searchRef = useRef<HTMLInputElement>(null);

  useDocumentTitle('Tools');

  const update = useCallback(
    (key: 'q' | 'module', value: string) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value && value !== 'all') next.set(key, value);
          else next.delete(key);
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

  const results = useMemo(
    () => searchTools(query, moduleFilter),
    [query, moduleFilter],
  );

  const meta =
    results.length === 0
      ? query
        ? `No tools match “${query.trim()}”.`
        : 'No tools.'
      : `${results.length} of ${stats.tools} tools${
          moduleFilter === 'all' ? '' : ` · HPB Module ${moduleFilter}`
        }.`;

  return (
    <div className="tools-page">
      <header className="page-head">
        <h1 className="page-head__title">Tools</h1>
        <p className="page-head__lead">
          All {stats.tools} HPB reference tools. Search by name, keyword or module.
        </p>
      </header>

      <div className="home__controls">
        <SearchBar
          ref={searchRef}
          value={query}
          onChange={(v) => update('q', v)}
          onClear={reset}
          resultMeta={meta}
          id="tool-search"
          placeholder="Search tools — e.g. “email”, “1:1”, “prioritise”"
        />
        <div className="chips" role="group" aria-label="Filter tools by HPB module">
          <button
            type="button"
            aria-pressed={moduleFilter === 'all'}
            className={`chip${moduleFilter === 'all' ? ' chip--active' : ''}`}
            onClick={() => update('module', 'all')}
          >
            All modules
          </button>
          {toolModules.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={moduleFilter === m}
              className={`chip${moduleFilter === m ? ' chip--active' : ''}`}
              onClick={() => update('module', String(m))}
            >
              Module {m}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState onReset={reset} query={query.trim() || undefined} resetLabel="Reset filters" />
      ) : (
        <div className="toolgrid">
          {results.map((tool) => (
            <ToolCard key={tool.id} tool={tool} query={query} />
          ))}
        </div>
      )}
    </div>
  );
}
