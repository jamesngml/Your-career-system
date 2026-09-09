/**
 * parse-source.mjs
 *
 * Extracts the TOOLS / SECTIONS / SITUATIONS / SYNONYMS data literals straight
 * out of the source-of-truth document and evaluates them.
 *
 * The literals are pure data (no DOM / no function calls), so evaluating them
 * with `new Function` is safe and gives us the exact author-entered values to
 * diff the app's typed data files against.
 *
 * Used by:
 *   - scripts/validate-content.mjs   (CLI: `npm run validate`)
 *   - tests/content-validation.test.ts
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const SOURCE_HTML_PATH = resolve(
  __dirname,
  '../reference/HPB_YourCareerSystem_v4.html',
);

function sliceLiteral(src, startMarker, openChar, closeChar) {
  const markerIdx = src.indexOf(startMarker);
  if (markerIdx === -1) throw new Error(`marker not found: ${startMarker}`);
  const openIdx = src.indexOf(openChar, markerIdx);
  const endIdx = src.indexOf(`\n${closeChar};`, openIdx);
  if (openIdx === -1 || endIdx === -1) {
    throw new Error(`could not bound literal for: ${startMarker}`);
  }
  return src.slice(openIdx, endIdx + 2); // include "\n" + closeChar
}

function evalLiteral(literal) {
  // eslint-disable-next-line no-new-func
  return new Function(`return (${literal});`)();
}

/**
 * @param {string} [html] raw HTML string; defaults to the bundled source file.
 * @returns {{
 *   tools: Array<{id:string,name:string,module:number,page:string,description:string}>,
 *   sections: Array<{id:number,title:string,color:string,description:string}>,
 *   situations: Array<{section:number,text:string,tools:string[]}>,
 *   synonyms: Record<string,string[]>,
 *   rawToolsObject: Record<string, any>
 * }}
 */
export function parseSource(html) {
  const src = html ?? readFileSync(SOURCE_HTML_PATH, 'utf8');

  const toolsObj = evalLiteral(sliceLiteral(src, 'const TOOLS =', '{', '}'));
  const sectionsObj = evalLiteral(sliceLiteral(src, 'const SECTIONS =', '{', '}'));
  const situationsArr = evalLiteral(sliceLiteral(src, 'const SITUATIONS =', '[', ']'));
  const synonymsObj = evalLiteral(sliceLiteral(src, 'const SYNONYMS =', '{', '}'));

  const tools = Object.entries(toolsObj).map(([id, t]) => ({
    id,
    name: t.name,
    module: t.module,
    page: t.page,
    description: t.desc,
  }));

  const sections = Object.entries(sectionsObj).map(([id, s]) => ({
    id: Number(id),
    title: s.title,
    color: s.color,
    description: s.desc,
  }));

  const situations = situationsArr.map((s) => ({
    section: s.section,
    text: s.text,
    tools: s.tools,
  }));

  // Meta string used for the initial "N situations across M sections." label.
  const metaMatch = src.match(/id="search-meta">([^<]+)</);
  const searchMeta = metaMatch ? metaMatch[1].trim() : '';

  return {
    tools,
    sections,
    situations,
    synonyms: synonymsObj,
    rawToolsObject: toolsObj,
    searchMeta,
  };
}

// Allow `node scripts/parse-source.mjs` for a quick sanity dump.
if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  const parsed = parseSource();
  console.log(
    JSON.stringify(
      {
        tools: parsed.tools.length,
        sections: parsed.sections.length,
        situations: parsed.situations.length,
        synonymKeys: Object.keys(parsed.synonyms).length,
        searchMeta: parsed.searchMeta,
      },
      null,
      2,
    ),
  );
}
