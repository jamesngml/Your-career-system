import { forwardRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  /** Live result-count sentence shown under the input (aria-live). */
  resultMeta: string;
  id?: string;
  placeholder?: string;
}

const DEFAULT_PLACEHOLDER =
  'Search by situation, tool, or keyword — e.g. “new boss” or “priorities”';

/**
 * Prominent, accessible search field with icon, clear button and a live
 * result-count region. Mirrors the source `#search` control.
 */
export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  { value, onChange, onClear, resultMeta, id = 'situation-search', placeholder },
  ref,
) {
  return (
    <div className="searchbar">
      <div className="searchbar__field">
        <span className="searchbar__icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <label className="visually-hidden" htmlFor={id}>
          Search career situations, tools and keywords
        </label>
        <input
          ref={ref}
          id={id}
          className="searchbar__input"
          type="search"
          inputMode="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          placeholder={placeholder ?? DEFAULT_PLACEHOLDER}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && value) {
              e.preventDefault();
              onClear();
            }
          }}
          aria-describedby={`${id}-meta`}
        />
        {value.length > 0 && (
          <button
            type="button"
            className="searchbar__clear"
            onClick={onClear}
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
      <p className="searchbar__meta" id={`${id}-meta`} role="status" aria-live="polite">
        {resultMeta}
      </p>
    </div>
  );
});
