import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Tool } from '../types/career';
import { referenceLabel } from '../data';

interface ToolReferenceProps {
  tool: Tool;
  /** Show the "Open tool" link to the tool detail page. */
  showOpenLink?: boolean;
}

/**
 * The module/page reference for a tool.
 *
 * Today this is reference-only: the source HTML carries no HPB module content,
 * so we never invent a destination. If `reference.url` or
 * `reference.internalRoute` is added later, this component upgrades the badge
 * to a real link automatically.
 */
export function ToolReference({ tool, showOpenLink = true }: ToolReferenceProps) {
  const { url, internalRoute } = tool.reference;
  const label = referenceLabel(tool);

  let referenceEl: ReactNode;
  if (url) {
    referenceEl = (
      <a className="toolref__badge toolref__badge--link" href={url} target="_blank" rel="noreferrer">
        Open in {label}
        <span aria-hidden="true"> ↗</span>
      </a>
    );
  } else if (internalRoute) {
    referenceEl = (
      <Link className="toolref__badge toolref__badge--link" to={internalRoute}>
        Open in {label}
        <span aria-hidden="true"> →</span>
      </Link>
    );
  } else {
    referenceEl = (
      <span className="toolref__badge" title="Reference only — open your HPB materials at this page">
        {label}
      </span>
    );
  }

  return (
    <div className="toolref">
      {showOpenLink && (
        <Link className="toolref__open" to={`/tools/${tool.slug}`}>
          Open tool
          <span aria-hidden="true"> →</span>
        </Link>
      )}
      {referenceEl}
    </div>
  );
}
