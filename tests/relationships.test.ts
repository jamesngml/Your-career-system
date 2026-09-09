/** Two-way Situation <-> Tool relationship integrity. */
import { describe, expect, it } from 'vitest';
import { situations } from '../src/data/situations';
import { tools, toolBySlug } from '../src/data/tools';
import { situationsForTool, toolsForSituation, referenceLabel } from '../src/data';

describe('situation -> tool', () => {
  it('every situation references at least one valid tool', () => {
    const ids = new Set(tools.map((t) => t.id));
    for (const s of situations) {
      expect(s.tools.length).toBeGreaterThan(0);
      for (const id of s.tools) expect(ids.has(id)).toBe(true);
    }
  });

  it('toolsForSituation resolves in source order', () => {
    const s = situations.find((x) => x.text === 'I just got passed over for promotion or received hard feedback')!;
    expect(toolsForSituation(s).map((t) => t.id)).toEqual(['three_circles', 'long_short']);
  });
});

describe('tool -> situation', () => {
  it('every tool returns its related situations, and the link is symmetric', () => {
    for (const tool of tools) {
      const related = situationsForTool(tool.id);
      for (const s of related) expect(s.tools).toContain(tool.id);
      // symmetry: any situation listing this tool appears in related
      const expected = situations.filter((s) => s.tools.includes(tool.id));
      expect(new Set(related)).toEqual(new Set(expected));
    }
  });

  it('every tool is used by at least one situation (no orphans)', () => {
    for (const tool of tools) {
      expect(situationsForTool(tool.id).length).toBeGreaterThan(0);
    }
  });

  it('slugs resolve back to the same tool', () => {
    for (const tool of tools) {
      expect(toolBySlug.get(tool.slug)?.id).toBe(tool.id);
    }
  });

  it('reference label reads "HPB Module N · pX"', () => {
    expect(referenceLabel(tools.find((t) => t.id === 'one_on_one_anatomy')!)).toBe(
      'HPB Module 5 · p8-9',
    );
  });
});
