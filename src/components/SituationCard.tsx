import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { Situation } from '../types/career';
import { sectionForSituation, toolsForSituation } from '../data';
import { Highlight } from './Highlight';
import { ToolReference } from './ToolReference';

interface SituationCardProps {
  situation: Situation;
  query?: string;
  /** When true, the situation text links to its detail page. */
  linkToDetail?: boolean;
  headingLevel?: 'h1' | 'h2' | 'h3';
}

/** One situation + its recommended HPB tool(s). */
export function SituationCard({
  situation,
  query = '',
  linkToDetail = true,
  headingLevel: Heading = 'h3',
}: SituationCardProps) {
  const section = sectionForSituation(situation);
  const linkedTools = toolsForSituation(situation);

  return (
    <article
      className="card"
      style={{ '--section-color': section?.color ?? 'var(--navy)' } as CSSProperties}
    >
      <Heading className="card__situation">
        <span className="card__quote" aria-hidden="true">&ldquo;</span>
        {linkToDetail ? (
          <Link className="card__situation-link" to={`/situations/${situation.slug}`}>
            <Highlight text={situation.text} query={query} />
          </Link>
        ) : (
          <Highlight text={situation.text} query={query} />
        )}
      </Heading>

      {linkedTools.map((tool) => (
        <div className="toolblock" key={tool.id}>
          <p className="toolblock__name">
            <Link className="toolblock__name-link" to={`/tools/${tool.slug}`}>
              <Highlight text={tool.name} query={query} />
            </Link>
          </p>
          <p className="toolblock__desc">
            <Highlight text={tool.description} query={query} />
          </p>
          <ToolReference tool={tool} />
        </div>
      ))}
    </article>
  );
}
