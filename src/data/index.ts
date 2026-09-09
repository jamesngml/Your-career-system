/**
 * Data barrel + relationship helpers.
 *
 * The two-way Situation <-> Tool relationship is derived here once from the
 * canonical `situations` list so components never have to walk it themselves.
 */
import type { Situation, Tool } from '../types/career';
import { situations, situationBySlug } from './situations';
import { tools, toolById, toolBySlug, toolModules } from './tools';
import { sections, sectionById } from './sections';
import { synonyms } from './synonyms';

export { situations, situationBySlug } from './situations';
export { tools, toolById, toolBySlug, toolModules } from './tools';
export { sections, sectionById } from './sections';
export { synonyms } from './synonyms';

/** Map of tool id -> situations that reference it (source order preserved). */
const situationsByToolId: Map<string, Situation[]> = (() => {
  const map = new Map<string, Situation[]>();
  for (const tool of tools) map.set(tool.id, []);
  for (const situation of situations) {
    for (const toolId of situation.tools) {
      const list = map.get(toolId);
      if (list) list.push(situation);
    }
  }
  return map;
})();

/** Every career situation associated with a given tool. */
export function situationsForTool(toolId: string): Situation[] {
  return situationsByToolId.get(toolId) ?? [];
}

/** The resolved Tool objects linked to a situation, in source order. */
export function toolsForSituation(situation: Situation): Tool[] {
  return situation.tools
    .map((id) => toolById.get(id))
    .filter((t): t is Tool => t !== undefined);
}

/** The section a situation belongs to. */
export function sectionForSituation(situation: Situation) {
  return sectionById.get(situation.section);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return toolBySlug.get(slug);
}

export function getSituationBySlug(slug: string): Situation | undefined {
  return situationBySlug.get(slug);
}

/** Human-readable reference label, e.g. "HPB Module 5 · p8-9". */
export function referenceLabel(tool: Tool): string {
  return `HPB Module ${tool.reference.module} · ${tool.reference.page}`;
}

/** Aggregate counts, computed from data (never hard-coded). */
export const stats = {
  sections: sections.length,
  situations: situations.length,
  tools: tools.length,
  synonymKeys: Object.keys(synonyms).length,
  modules: toolModules,
};
