import type { Situation } from '../types/career';
import { slugify } from '../utils/slugify';

/**
 * The 45 career situations, verbatim from the source `SITUATIONS` array
 * (order preserved). `id` / `slug` are derived deterministically from `text`
 * via {@link slugify} so deep links stay stable as long as the text does.
 */
interface RawSituation {
  section: number;
  text: string;
  tools: string[];
}

const raw: RawSituation[] = [
  // Section 1 — Mindset & Perspective
  { section: 1, text: "I'm slipping back into passive Employee mode", tools: ['owner_diag'] },
  { section: 1, text: "I need to remind myself I'm the CEO of my career", tools: ['owner_pillars'] },
  {
    section: 1,
    text: "I feel my career is happening TO me — I'm waiting for my manager to develop me",
    tools: ['owner_diag', 'owner_pillars'],
  },
  {
    section: 1,
    text: 'I just got passed over for promotion or received hard feedback',
    tools: ['three_circles', 'long_short'],
  },
  { section: 1, text: "I'm stuck on something I cannot change", tools: ['three_circles'] },
  { section: 1, text: 'I keep playing safe at work', tools: ['long_short'] },
  {
    section: 1,
    text: 'My company is reorganising or strategy is shifting',
    tools: ['three_circles', 'long_short'],
  },
  { section: 1, text: "I'm considering whether to stay or leave my role", tools: ['long_short'] },

  // Section 2 — People & Transitions
  { section: 2, text: 'I want to be seen as a valued team member', tools: ['three_cs'] },
  { section: 2, text: 'I want to diagnose my weakest C', tools: ['three_cs_assess'] },
  { section: 2, text: 'A new manager is starting', tools: ['first_one_on_one'] },
  {
    section: 2,
    text: 'A new skip-level is starting',
    tools: ['first_one_on_one', 'three_cs_assess'],
  },
  {
    section: 2,
    text: "I've just changed roles (internal lateral or promotion)",
    tools: ['three_cs_assess', 'first_one_on_one'],
  },
  {
    section: 2,
    text: 'A peer is pushing back hard on a decision',
    tools: ['comp_peer_pushback'],
  },
  {
    section: 2,
    text: "A peer asks for help when I'm already overloaded",
    tools: ['comp_peer_help'],
  },
  {
    section: 2,
    text: 'I need to decline a request without damaging the relationship',
    tools: ['comp_decline'],
  },
  {
    section: 2,
    text: "I'm receiving critical feedback and want to handle it well",
    tools: ['comp_feedback'],
  },
  {
    section: 2,
    text: "I'm joining a new cross-functional team or project",
    tools: ['three_cs', 'three_cs_assess'],
  },

  // Section 3 — Priorities & Projects
  { section: 3, text: "I don't actually know my manager's priorities", tools: ['mgr_audit'] },
  {
    section: 3,
    text: "My boss's strategy or priorities have just changed",
    tools: ['mgr_audit'],
  },
  {
    section: 3,
    text: 'I am drowning in tasks and need to prioritise',
    tools: ['four_step_prio'],
  },
  {
    section: 3,
    text: "I've been asked to take on a new project — should I?",
    tools: ['four_step_prio', 'pain_value'],
  },
  {
    section: 3,
    text: "I'm inheriting a struggling project",
    tools: ['mgr_audit', 'three_circles'],
  },
  { section: 3, text: 'I want to find concrete ways to add value', tools: ['pain_value'] },
  {
    section: 3,
    text: 'My boss is overloaded — how do I add real value?',
    tools: ['pain_value'],
  },
  { section: 3, text: 'I want to suggest a new initiative', tools: ['pain_value'] },
  {
    section: 3,
    text: 'A new quarter or planning cycle is starting',
    tools: ['mgr_audit', 'four_step_prio'],
  },

  // Section 4 — Visibility & Communication
  {
    section: 4,
    text: 'I want to talk about my work in business terms',
    tools: ['value_ladder'],
  },
  {
    section: 4,
    text: 'I need to write a clear email to a senior leader',
    tools: ['bluf'],
  },
  {
    section: 4,
    text: 'I want to send a useful weekly update to my manager',
    tools: ['weekly_email'],
  },
  { section: 4, text: 'I have a 1:1 coming up', tools: ['one_on_one_anatomy'] },
  { section: 4, text: "I'm giving a quick status report", tools: ['four_bullet'] },
  {
    section: 4,
    text: 'Performance review or appraisal is coming up',
    tools: ['value_ladder', 'weekly_email'],
  },
  {
    section: 4,
    text: 'Skip-level meeting is coming up',
    tools: ['four_bullet', 'value_ladder'],
  },
  {
    section: 4,
    text: "I'm asking for more scope, a promotion, or a raise",
    tools: ['value_ladder', 'one_on_one_anatomy'],
  },
  {
    section: 4,
    text: "I need to update a stakeholder who's been out of the loop",
    tools: ['four_bullet'],
  },
  {
    section: 4,
    text: 'I need to recover credibility after a missed commitment',
    tools: ['bluf', 'four_bullet', 'weekly_email'],
  },
  {
    section: 4,
    text: "I'm leading my first project or chairing a meeting for the first time",
    tools: ['one_on_one_anatomy', 'weekly_email'],
  },

  // Section 5 — Goals & Long Game
  { section: 5, text: 'I have a goal but no clear path', tools: ['wwhtbt'] },
  { section: 5, text: 'I want to build a personal action plan', tools: ['one_three_nine'] },
  {
    section: 5,
    text: "I'm starting a new role or project — what does success look like?",
    tools: ['wwhtbt'],
  },
  {
    section: 5,
    text: "I'm setting goals for the new year or fiscal quarter",
    tools: ['wwhtbt', 'one_three_nine'],
  },
  {
    section: 5,
    text: 'I had a commitment but lost momentum',
    tools: ['one_three_nine', 'pair_commit'],
  },
  {
    section: 5,
    text: 'Mid-year career stocktake — where am I really?',
    tools: ['wwhtbt', 'one_three_nine'],
  },
  { section: 5, text: 'I need an accountability partner', tools: ['pair_commit'] },
];

export const situations: Situation[] = raw.map((r) => {
  const slug = slugify(r.text);
  return { id: slug, slug, section: r.section, text: r.text, tools: r.tools };
});

export const situationBySlug = new Map<string, Situation>(situations.map((s) => [s.slug, s]));
