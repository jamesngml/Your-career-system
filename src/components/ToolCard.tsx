import { Link } from 'react-router-dom';
import type { Tool } from '../types/career';
import { referenceLabel, situationsForTool } from '../data';
import { Highlight } from './Highlight';

interface ToolCardProps {
  tool: Tool;
  query?: string;
}

/** Compact tool entry for the Tools directory. */
export function ToolCard({ tool, query = '' }: ToolCardProps) {
  const related = situationsForTool(tool.id);
  return (
    <article className="toolcard">
      <h2 className="toolcard__name">
        <Link className="toolcard__name-link" to={`/tools/${tool.slug}`}>
          <Highlight text={tool.name} query={query} />
        </Link>
      </h2>
      <p className="toolcard__ref">{referenceLabel(tool)}</p>
      <p className="toolcard__desc">
        <Highlight text={tool.description} query={query} />
      </p>
      <p className="toolcard__related">
        {related.length} related {related.length === 1 ? 'situation' : 'situations'}
      </p>
    </article>
  );
}
