/** Section filtering. */
import { describe, expect, it } from 'vitest';
import { searchSituations, countSituations } from '../src/utils/search';
import { sections } from '../src/data/sections';
import { situations } from '../src/data/situations';

const EXPECTED_PER_SECTION: Record<number, number> = {
  1: situations.filter((s) => s.section === 1).length,
  2: situations.filter((s) => s.section === 2).length,
  3: situations.filter((s) => s.section === 3).length,
  4: situations.filter((s) => s.section === 4).length,
  5: situations.filter((s) => s.section === 5).length,
};

describe('filter: All', () => {
  it('shows every section and every situation', () => {
    expect(countSituations('', 'all')).toBe(45);
    expect(searchSituations('', 'all').map((g) => g.section.id)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('filter: one section at a time', () => {
  for (const section of sections) {
    it(`${section.shortLabel} shows only its own situations (${EXPECTED_PER_SECTION[section.id]})`, () => {
      const groups = searchSituations('', section.id);
      expect(groups).toHaveLength(1);
      expect(groups[0].section.id).toBe(section.id);
      expect(groups[0].situations).toHaveLength(EXPECTED_PER_SECTION[section.id]);
      expect(groups[0].situations.every((s) => s.section === section.id)).toBe(true);
    });
  }
});

describe('filter + search combined', () => {
  it('"boss" within Priorities stays inside Priorities', () => {
    const groups = searchSituations('boss', 3);
    expect(groups.every((g) => g.section.id === 3)).toBe(true);
    expect(groups.flatMap((g) => g.situations).length).toBeGreaterThan(0);
  });
  it('the section short labels are All + the five source names', () => {
    expect(['All', ...sections.map((s) => s.shortLabel)]).toEqual([
      'All',
      'Mindset',
      'People',
      'Priorities',
      'Visibility',
      'Goals',
    ]);
  });
});
