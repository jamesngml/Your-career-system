/**
 * Safe search-term highlighting.
 *
 * The source document builds an HTML string and injects it with innerHTML.
 * Here we instead split the text into plain string / match segments and let
 * React render them — no `dangerouslySetInnerHTML`, no sanitisation concerns.
 *
 * `highlightMatches` returns an array of segments; the <Highlight> component
 * wraps match segments in `<mark class="hl">` (HPB yellow `#FFE599`).
 */
import { getHighlightTerms } from './search';

export interface HighlightSegment {
  text: string;
  match: boolean;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Split `text` into ordered segments, marking the ranges that match any of the
 * query's highlight terms (query + expanded synonyms, length >= 2).
 * Matching is case-insensitive; longer terms take precedence.
 */
export function highlightMatches(text: string, query: string): HighlightSegment[] {
  const terms = getHighlightTerms(query);
  if (terms.length === 0) return [{ text, match: false }];

  // Longest first so "one-on-one" wins over "one".
  const pattern = terms
    .slice()
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|');

  const re = new RegExp(`(${pattern})`, 'gi');
  const segments: HighlightSegment[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++; // guard against zero-length matches
      continue;
    }
    if (m.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, m.index), match: false });
    }
    segments.push({ text: m[0], match: true });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), match: false });
  }
  return segments.length > 0 ? segments : [{ text, match: false }];
}
