/**
 * Search engine for Your Career System.
 *
 * This is a faithful port of the vanilla-JS search in the source document
 * (`reference/HPB_YourCareerSystem_v4.html`): the same tokenisation, the same
 * synonym expansion, the same haystack construction, and the same matching
 * rules (full-phrase-or-synonym first; then multi-word AND across tokens).
 *
 * All functions are pure and framework-free so the engine can be unit-tested
 * and swapped for something smarter later without touching the UI.
 */
import type { Situation, Tool } from '../types/career';
import { synonyms } from '../data/synonyms';
import { situations } from '../data/situations';
import { tools, toolById } from '../data/tools';
import { sections } from '../data/sections';

/** Lowercase, trim, split on whitespace, drop empties. (source: `tokenize`) */
export function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

/**
 * Expand a single token to the set {token} ∪ synonyms(token).
 * (source: `expandToken`)
 */
export function expandToken(token: string): Set<string> {
  const set = new Set<string>([token]);
  const syns = synonyms[token];
  if (syns) syns.forEach((s) => set.add(s.toLowerCase()));
  return set;
}

/**
 * Expand a list of tokens into the union of all their synonym sets.
 * (spec name: `expandSynonyms`)
 */
export function expandSynonyms(tokens: string[]): Set<string> {
  const set = new Set<string>();
  for (const token of tokens) expandToken(token).forEach((t) => set.add(t));
  return set;
}

/** Build the lowercase haystack for a tool. (source: inline in `matches`) */
function toolHaystack(tool: Tool): string {
  const { module, page } = tool.reference;
  return (
    ` ${tool.name.toLowerCase()} ${tool.description.toLowerCase()}` +
    ` m${module} module ${module} ${page.toLowerCase()}`
  );
}

/** Build the lowercase haystack for a situation + all of its linked tools. */
function situationHaystack(situation: Situation): string {
  let haystack = situation.text.toLowerCase();
  for (const id of situation.tools) {
    const tool = toolById.get(id);
    if (tool) haystack += toolHaystack(tool);
  }
  return haystack;
}

/**
 * Core matcher shared by situations and tools. Faithful to source `matches`:
 *  1. If the full query (or one of its direct synonyms) appears in the
 *     haystack as a substring -> match.
 *  2. Otherwise, for a multi-word query, EVERY token must have at least one
 *     of its synonyms present in the haystack -> match. Single-word queries
 *     that failed step 1 do not match.
 */
function haystackMatches(haystack: string, query: string): boolean {
  const ql = query.toLowerCase().trim();
  if (!ql) return true;

  // 1 — full query and its direct synonyms, as a single phrase
  for (const s of expandToken(ql)) {
    if (haystack.includes(s)) return true;
  }

  // 2 — multi-word AND across tokens
  const tokens = tokenizeQuery(ql);
  if (tokens.length <= 1) return false;
  for (const token of tokens) {
    let found = false;
    for (const syn of expandToken(token)) {
      if (haystack.includes(syn)) {
        found = true;
        break;
      }
    }
    if (!found) return false;
  }
  return true;
}

export function matchesSituation(situation: Situation, query: string): boolean {
  if (!query.trim()) return true;
  return haystackMatches(situationHaystack(situation), query);
}

export function matchesTool(tool: Tool, query: string): boolean {
  if (!query.trim()) return true;
  return haystackMatches(toolHaystack(tool), query);
}

/**
 * Terms to visually highlight for a query. (source: `getHighlightTerms`)
 * Returns lowercase terms of length >= 2.
 */
export function getHighlightTerms(query: string): string[] {
  if (!query) return [];
  const terms = new Set<string>();
  const ql = query.toLowerCase().trim();
  if (!ql) return [];
  expandToken(ql).forEach((t) => terms.add(t));
  const tokens = tokenizeQuery(ql);
  if (tokens.length > 1) {
    for (const token of tokens) expandToken(token).forEach((t) => terms.add(t));
  }
  return Array.from(terms).filter((t) => t.length >= 2);
}

export interface SituationSearchResult {
  section: (typeof sections)[number];
  situations: Situation[];
}

/**
 * Search + section filter, grouped by section in canonical order.
 * `sectionFilter` is `'all'` or a section id (number or numeric string).
 */
export function searchSituations(
  query: string,
  sectionFilter: 'all' | number | string = 'all',
): SituationSearchResult[] {
  const q = query.trim();
  const results: SituationSearchResult[] = [];
  for (const section of sections) {
    if (sectionFilter !== 'all' && String(sectionFilter) !== String(section.id)) continue;
    const matched = situations.filter(
      (s) => s.section === section.id && matchesSituation(s, q),
    );
    if (matched.length > 0) results.push({ section, situations: matched });
  }
  return results;
}

/** Flat count of situations matching a query + section filter. */
export function countSituations(
  query: string,
  sectionFilter: 'all' | number | string = 'all',
): number {
  return searchSituations(query, sectionFilter).reduce((n, g) => n + g.situations.length, 0);
}

/**
 * Search the tools directory. `moduleFilter` is `'all'` or an HPB module number.
 * Results stay in canonical (source) order.
 */
export function searchTools(
  query: string,
  moduleFilter: 'all' | number | string = 'all',
): Tool[] {
  const q = query.trim();
  return tools.filter((t) => {
    if (moduleFilter !== 'all' && String(moduleFilter) !== String(t.reference.module)) {
      return false;
    }
    return matchesTool(t, q);
  });
}
