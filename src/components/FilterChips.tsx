import { sections } from '../data';

export type SectionFilter = 'all' | number;

interface FilterChipsProps {
  value: SectionFilter;
  onChange: (value: SectionFilter) => void;
}

/**
 * Section filter row. Horizontally scrollable on mobile, wraps on wider
 * screens. Implemented as a radiogroup for keyboard + screen-reader support.
 * Each chip carries a colour dot AND a text label (never colour alone).
 */
export function FilterChips({ value, onChange }: FilterChipsProps) {
  return (
    <div className="chips" role="group" aria-label="Filter situations by section">
      <button
        type="button"
        aria-pressed={value === 'all'}
        className={`chip${value === 'all' ? ' chip--active' : ''}`}
        onClick={() => onChange('all')}
      >
        All
      </button>
      {sections.map((section) => {
        const active = value === section.id;
        return (
          <button
            key={section.id}
            type="button"
            aria-pressed={active}
            className={`chip${active ? ' chip--active' : ''}`}
            onClick={() => onChange(section.id)}
          >
            <span
              className="chip__dot"
              style={{ background: section.color }}
              aria-hidden="true"
            />
            {section.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
