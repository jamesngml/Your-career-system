import type { CSSProperties } from 'react';
import type { Section } from '../types/career';

interface SectionHeaderProps {
  section: Section;
  /** Heading level — 2 on Home, 1 on a section-focused view. */
  as?: 'h2' | 'h3';
  count?: number;
}

/** Coloured section header (top border accent + title + italic description). */
export function SectionHeader({ section, as: Tag = 'h2', count }: SectionHeaderProps) {
  return (
    <div
      className="section-header"
      style={{ '--section-color': section.color } as CSSProperties}
    >
      <Tag className="section-header__title">
        <span className="section-header__num">{section.id}.</span> {section.title}
        {typeof count === 'number' && (
          <span className="section-header__count"> · {count}</span>
        )}
      </Tag>
      <p className="section-header__desc">{section.description}</p>
    </div>
  );
}
