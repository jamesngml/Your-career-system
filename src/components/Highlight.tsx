import { Fragment } from 'react';
import { highlightMatches } from '../utils/highlight';

interface HighlightProps {
  text: string;
  query: string;
}

/**
 * Renders `text` with search matches wrapped in `<mark class="hl">`
 * (HPB yellow). Safe — segments are plain strings rendered by React.
 */
export function Highlight({ text, query }: HighlightProps) {
  const segments = highlightMatches(text, query);
  return (
    <>
      {segments.map((seg, i) =>
        seg.match ? (
          <mark className="hl" key={i}>
            {seg.text}
          </mark>
        ) : (
          <Fragment key={i}>{seg.text}</Fragment>
        ),
      )}
    </>
  );
}
