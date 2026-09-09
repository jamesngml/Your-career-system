/**
 * Content validation — the app's typed data must match the source document
 * character-for-character (nothing added, removed, simplified or reworded).
 */
import { describe, expect, it } from 'vitest';
import { parseSource } from '../scripts/parse-source.mjs';
import { sections } from '../src/data/sections';
import { tools } from '../src/data/tools';
import { situations } from '../src/data/situations';
import { synonyms } from '../src/data/synonyms';
import { slugify } from '../src/utils/slugify';

const source = parseSource();

describe('counts', () => {
  it('has exactly 5 sections', () => {
    expect(sections).toHaveLength(5);
    expect(source.sections).toHaveLength(5);
  });
  it('has exactly 45 situations', () => {
    expect(situations).toHaveLength(45);
    expect(source.situations).toHaveLength(45);
  });
  it('has exactly 22 unique tools', () => {
    expect(tools).toHaveLength(22);
    expect(new Set(tools.map((t) => t.id)).size).toBe(22);
    expect(Object.keys(source.rawToolsObject)).toHaveLength(22);
  });
});

describe('sections match source', () => {
  for (const src of parseSource().sections) {
    it(`section ${src.id}: "${src.title}"`, () => {
      const ours = sections.find((s) => s.id === src.id);
      expect(ours).toBeDefined();
      expect(ours!.title).toBe(src.title);
      expect(ours!.color).toBe(src.color);
      expect(ours!.description).toBe(src.description);
    });
  }
});

describe('tools match source', () => {
  for (const src of parseSource().tools) {
    it(`tool "${src.id}"`, () => {
      const ours = tools.find((t) => t.id === src.id);
      expect(ours, `tool ${src.id} present`).toBeDefined();
      expect(ours!.name).toBe(src.name);
      expect(ours!.description).toBe(src.description);
      expect(ours!.reference.module).toBe(src.module);
      expect(ours!.reference.page).toBe(src.page);
    });
  }

  it('no extra tools beyond the source', () => {
    const srcIds = new Set(source.tools.map((t) => t.id));
    for (const t of tools) expect(srcIds.has(t.id)).toBe(true);
  });

  it('every tool has module + page info', () => {
    for (const t of tools) {
      expect(Number.isInteger(t.reference.module)).toBe(true);
      expect(t.reference.page.length).toBeGreaterThan(0);
    }
  });
});

describe('situations match source (order + content preserved)', () => {
  source.situations.forEach((src, i) => {
    it(`situation #${i + 1}: "${src.text}"`, () => {
      const ours = situations[i];
      expect(ours.text).toBe(src.text);
      expect(ours.section).toBe(src.section);
      expect(ours.tools).toEqual(src.tools);
    });
  });

  it('every situation references valid tool ids', () => {
    const ids = new Set(tools.map((t) => t.id));
    for (const s of situations) {
      for (const id of s.tools) expect(ids.has(id), `${s.text} -> ${id}`).toBe(true);
    }
  });

  it('derived slugs are unique and stable', () => {
    const slugs = situations.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of situations) expect(s.slug).toBe(slugify(s.text));
  });

  it('no situation was omitted', () => {
    const ourTexts = new Set(situations.map((s) => s.text));
    for (const src of source.situations) expect(ourTexts.has(src.text)).toBe(true);
  });
});

describe('synonym dictionary migrated verbatim', () => {
  it('same set of keys', () => {
    expect(Object.keys(synonyms).sort()).toEqual(Object.keys(source.synonyms).sort());
  });
  it('same values for every key', () => {
    for (const [k, v] of Object.entries(source.synonyms)) {
      expect(synonyms[k]).toEqual(v);
    }
  });
});

describe('aggregate label', () => {
  it('source initial label is "45 situations across 5 sections."', () => {
    expect(source.searchMeta).toBe('45 situations across 5 sections.');
  });
});
