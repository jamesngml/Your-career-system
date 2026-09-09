/**
 * Search engine behaviour — a port-fidelity check against the source document's
 * synonym-aware search (NOT a plain substring `includes`).
 */
import { describe, expect, it } from 'vitest';
import {
  searchSituations,
  searchTools,
  matchesSituation,
  expandToken,
  expandSynonyms,
  getHighlightTerms,
} from '../src/utils/search';
import { highlightMatches } from '../src/utils/highlight';
import { situations } from '../src/data/situations';

function flat(query: string, section: 'all' | number = 'all') {
  return searchSituations(query, section).flatMap((g) => g.situations);
}
function texts(query: string) {
  return flat(query).map((s) => s.text);
}

describe('empty / initial state', () => {
  it('returns all 45 situations grouped across 5 sections when query is empty', () => {
    const groups = searchSituations('', 'all');
    expect(groups).toHaveLength(5);
    expect(groups.flatMap((g) => g.situations)).toHaveLength(45);
  });
});

describe('single-keyword search', () => {
  const cases: Array<[string, string]> = [
    ['boss', "My boss's strategy or priorities have just changed"],
    ['manager', "I don't actually know my manager's priorities"],
    ['promotion', 'I just got passed over for promotion or received hard feedback'],
    ['raise', "I'm asking for more scope, a promotion, or a raise"],
    ['feedback', "I'm receiving critical feedback and want to handle it well"],
    ['stuck', "I'm stuck on something I cannot change"],
    ['overwhelmed', 'I am drowning in tasks and need to prioritise'],
    ['email', 'I need to write a clear email to a senior leader'],
    ['1:1', 'I have a 1:1 coming up'],
    ['visibility', 'I want to be seen as a valued team member'],
    ['goal', 'I have a goal but no clear path'],
    ['project', "I'm inheriting a struggling project"],
    ['conflict', 'A peer is pushing back hard on a decision'],
    ['new', 'A new manager is starting'],
  ];

  for (const [query, expected] of cases) {
    it(`"${query}" surfaces "${expected}"`, () => {
      const results = texts(query);
      expect(results.length).toBeGreaterThan(0);
      expect(results).toContain(expected);
    });
  }
});

describe('synonym expansion (not substring matching)', () => {
  it('"boss" expands to include "manager"', () => {
    expect([...expandToken('boss')]).toContain('manager');
  });
  it('"overwhelmed" matches a situation that only says "drowning"', () => {
    const drowning = situations.find((s) => s.text.includes('drowning'))!;
    expect(matchesSituation(drowning, 'overwhelmed')).toBe(true);
    expect(drowning.text.toLowerCase()).not.toContain('overwhelmed');
  });
  it('"1:1" matches "one-on-one" phrasing via synonyms', () => {
    expect([...expandToken('1:1')]).toEqual(
      expect.arrayContaining(['one on one', 'one-on-one', 'check-in']),
    );
  });
  it('expandSynonyms unions multiple tokens', () => {
    const set = expandSynonyms(['boss', 'goal']);
    expect(set.has('manager')).toBe(true);
    expect(set.has('milestone')).toBe(true);
  });
});

describe('multi-word search (AND across tokens)', () => {
  it('"new boss" surfaces "A new manager is starting" with the First 1:1 script', () => {
    const match = flat('new boss').find((s) => s.text === 'A new manager is starting');
    expect(match).toBeDefined();
    expect(match!.tools).toContain('first_one_on_one');
  });
  it('requires BOTH tokens to match — an impossible second token yields nothing', () => {
    // "new" matches plenty, but nothing contains "zqxwplk", so the AND fails.
    expect(flat('new zqxwplk')).toHaveLength(0);
  });

  it('matchesSituation enforces the per-token AND directly', () => {
    const s = situations.find((x) => x.text === 'A new manager is starting')!;
    expect(matchesSituation(s, 'new boss')).toBe(true);
    expect(matchesSituation(s, 'new accordion')).toBe(false); // "accordion" matches nothing
  });
});

describe('no-results', () => {
  it('returns nothing for gibberish', () => {
    expect(searchSituations('zzxqwplk', 'all')).toHaveLength(0);
  });
});

describe('tool search', () => {
  it('"email" finds the Weekly Email Update template and BLUF', () => {
    const names = searchTools('email').map((t) => t.id);
    expect(names).toContain('weekly_email');
    expect(names).toContain('bluf');
  });
  it('module filter narrows results', () => {
    const m5 = searchTools('', 5);
    expect(m5.length).toBeGreaterThan(0);
    expect(m5.every((t) => t.reference.module === 5)).toBe(true);
  });
});

describe('highlight terms & segments', () => {
  it('getHighlightTerms includes the query and its synonyms', () => {
    const terms = getHighlightTerms('promotion');
    expect(terms).toContain('promotion');
    expect(terms).toContain('advance');
  });
  it('highlightMatches marks the matched span and nothing else', () => {
    const segs = highlightMatches('I just got passed over for promotion', 'promotion');
    const marked = segs.filter((s) => s.match).map((s) => s.text);
    expect(marked).toEqual(['promotion']);
    expect(segs.map((s) => s.text).join('')).toBe('I just got passed over for promotion');
  });
  it('returns a single unmatched segment when query is empty', () => {
    expect(highlightMatches('hello world', '')).toEqual([{ text: 'hello world', match: false }]);
  });
});
