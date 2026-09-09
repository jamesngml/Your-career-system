/** Types for the plain-JS source extractor (`parse-source.mjs`), used by tests. */
export interface ParsedTool {
  id: string;
  name: string;
  module: number;
  page: string;
  description: string;
}
export interface ParsedSection {
  id: number;
  title: string;
  color: string;
  description: string;
}
export interface ParsedSituation {
  section: number;
  text: string;
  tools: string[];
}
export interface ParsedSource {
  tools: ParsedTool[];
  sections: ParsedSection[];
  situations: ParsedSituation[];
  synonyms: Record<string, string[]>;
  rawToolsObject: Record<string, { name: string; module: number; page: string; desc: string }>;
  searchMeta: string;
}
export const SOURCE_HTML_PATH: string;
export function parseSource(html?: string): ParsedSource;
