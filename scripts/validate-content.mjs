/**
 * validate-content.mjs — `npm run validate`
 *
 * Programmatic content validation against the source-of-truth document
 * (`reference/HPB_YourCareerSystem_v4.html`). Checks the invariants from the
 * build spec and exits non-zero on any failure so it can gate CI.
 *
 *   - exactly 5 sections
 *   - exactly 45 situations
 *   - exactly 22 unique tools
 *   - every situation references valid tool ids
 *   - every tool carries module + page
 *   - synonym dictionary present and non-trivial
 *   - derived situation slugs are unique (deep-link safety)
 */
import { parseSource } from './parse-source.mjs';

/** Must stay identical to src/utils/slugify.ts */
function slugify(input) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['‘’ʼ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const EXPECTED = { sections: 5, situations: 45, tools: 22 };

function main() {
  const { tools, sections, situations, synonyms, searchMeta } = parseSource();
  const failures = [];
  const pass = (msg) => console.log(`  ✓ ${msg}`);
  const fail = (msg) => {
    failures.push(msg);
    console.log(`  ✗ ${msg}`);
  };

  console.log('\nContent validation — source: HPB_YourCareerSystem_v4.html\n');

  // --- Counts -------------------------------------------------------------
  sections.length === EXPECTED.sections
    ? pass(`${sections.length} sections`)
    : fail(`expected ${EXPECTED.sections} sections, got ${sections.length}`);

  situations.length === EXPECTED.situations
    ? pass(`${situations.length} situations`)
    : fail(`expected ${EXPECTED.situations} situations, got ${situations.length}`);

  const toolIds = tools.map((t) => t.id);
  const uniqueToolIds = new Set(toolIds);
  uniqueToolIds.size === EXPECTED.tools
    ? pass(`${uniqueToolIds.size} unique tools`)
    : fail(`expected ${EXPECTED.tools} unique tools, got ${uniqueToolIds.size}`);

  // --- Section shape ----------------------------------------------------
  const sectionIds = new Set(sections.map((s) => s.id));
  for (const s of sections) {
    if (!s.title || !s.color || !s.description) {
      fail(`section ${s.id} missing title/color/description`);
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(s.color)) fail(`section ${s.id} colour not hex: ${s.color}`);
  }
  if (!failures.length) pass('every section has title, hex colour and description');

  // --- Tool shape -----------------------------------------------------
  let toolShapeOk = true;
  for (const t of tools) {
    if (!t.name || typeof t.name !== 'string') { fail(`tool ${t.id} missing name`); toolShapeOk = false; }
    if (!Number.isInteger(t.module)) { fail(`tool ${t.id} missing/invalid module`); toolShapeOk = false; }
    if (!t.page || typeof t.page !== 'string') { fail(`tool ${t.id} missing page`); toolShapeOk = false; }
    if (!t.description || t.description.length < 20) { fail(`tool ${t.id} missing description`); toolShapeOk = false; }
  }
  if (toolShapeOk) pass('every tool has name, module (int), page and description');

  // --- Relationships ------------------------------------------------
  let relOk = true;
  const referenced = new Set();
  situations.forEach((sit, i) => {
    if (!sectionIds.has(sit.section)) { fail(`situation #${i} has unknown section ${sit.section}`); relOk = false; }
    if (!Array.isArray(sit.tools) || sit.tools.length === 0) { fail(`situation #${i} "${sit.text}" has no tools`); relOk = false; }
    for (const id of sit.tools) {
      referenced.add(id);
      if (!uniqueToolIds.has(id)) { fail(`situation "${sit.text}" references unknown tool "${id}"`); relOk = false; }
    }
  });
  if (relOk) pass('every situation references only valid tool ids');

  const orphanTools = toolIds.filter((id) => !referenced.has(id));
  orphanTools.length === 0
    ? pass('every tool is referenced by at least one situation')
    : fail(`tools never referenced by a situation: ${orphanTools.join(', ')}`);

  // --- Synonyms ---------------------------------------------------
  const synKeys = Object.keys(synonyms);
  synKeys.length >= 60
    ? pass(`synonym dictionary migrated (${synKeys.length} keys)`)
    : fail(`synonym dictionary looks truncated (${synKeys.length} keys)`);
  const spotChecks = [
    ['boss', 'manager'],
    ['promotion', 'advance'],
    ['overwhelmed', 'drowning'],
    ['goal', 'milestone'],
    ['1:1', 'one-on-one'],
    ['conflict', 'pushback'],
    ['new', 'first'],
  ];
  for (const [k, v] of spotChecks) {
    if (!synonyms[k] || !synonyms[k].includes(v)) fail(`synonym "${k}" -> "${v}" missing`);
  }
  if (!failures.some((f) => f.startsWith('synonym'))) pass('synonym spot-checks pass (boss/manager, promotion/advance, …)');

  // --- Deep-link slug uniqueness -------------------------------
  const slugs = situations.map((s) => slugify(s.text));
  const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  dupes.length === 0
    ? pass('all 45 situation slugs are unique')
    : fail(`duplicate situation slugs: ${[...new Set(dupes)].join(', ')}`);

  const toolSlugSource = tools.map((t) => t.id);
  new Set(toolSlugSource).size === toolSlugSource.length
    ? pass('all tool ids are unique')
    : fail('duplicate tool ids');

  // --- Initial meta string ----------------------------------
  /45 situations across 5 sections/.test(searchMeta)
    ? pass(`initial label matches: "${searchMeta}"`)
    : fail(`unexpected initial label: "${searchMeta}"`);

  console.log('');
  if (failures.length) {
    console.error(`FAILED — ${failures.length} problem(s).\n`);
    process.exit(1);
  }
  console.log('All content checks passed.\n');
}

main();
