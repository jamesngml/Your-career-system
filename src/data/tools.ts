import type { Tool } from '../types/career';

/**
 * The 22 reference tools, verbatim from the source `TOOLS` map.
 *
 * `id` is the original object key. `slug` is a hand-authored, URL-safe alias
 * used for deep links (`/tools/:slug`). `name` and `description` are copied
 * character-for-character from the source and must not be edited.
 *
 * `reference.url` / `reference.internalRoute` are intentionally absent — the
 * source HTML contains no HPB module content. See README for how to add them.
 */
export const tools: Tool[] = [
  {
    id: 'owner_diag',
    slug: 'owner-mindset-6-dimension-self-diagnostic',
    name: 'Owner Mindset 6-Dimension Self-Diagnostic',
    reference: { module: 1, page: 'p3' },
    description:
      "A 30-question self-assessment that scores you on the Owner-vs-Employee spectrum across 6 dimensions: Ownership, Focus, Decisions, Value, Time, and Influence. Each dimension carries 5 statements; your scores reveal your default patterns and which dimension needs the deliberate shift. Re-take it at 90 days to measure how your identity has moved.",
  },
  {
    id: 'owner_pillars',
    slug: '3-owner-mindset-pillars',
    name: 'The 3 Owner Mindset Pillars (Reality · Ownership · Growth)',
    reference: { module: 1, page: 'p8' },
    description:
      "Three pillars that anchor the Owner identity in daily decisions: Reality (see what's actually true, not what you wish), Ownership (it's your career, not your manager's), Growth (every situation is input to your trajectory). Use them as a mental check before reacting to setbacks. The pillars sit underneath the 6-Dimension Self-Diagnostic — they're the why; the diagnostic is the what.",
  },
  {
    id: 'three_circles',
    slug: '3-circles-framework',
    name: 'The 3 Circles framework (Have · Influence · Worry)',
    reference: { module: 2, page: 'p3' },
    description:
      "A visual triage tool that maps every concern into one of three circles: things you Have control over, things you can Influence, and things you can only Worry about. Most stuck professionals spend 80% of their energy in the Worry circle when the inverse is what produces movement. Use it whenever you feel paralysed, frustrated, or stuck on something you can't change.",
  },
  {
    id: 'long_short',
    slug: 'long-game-vs-short-game',
    name: 'Long Game vs Short Game (5 dimensions)',
    reference: { module: 2, page: 'p8' },
    description:
      "A 5-dimension lens for telling whether you're playing the Long Game or the Short Game — Time horizon, Risk appetite, Capital invested, Compounding, Visibility of payoff. Most professionals default to the Short Game when stressed (play safe, don't speak up, take the next job for money). Use the dimensions to see exactly where you're shrinking — and what choice would put you back in the Long Game.",
  },
  {
    id: 'three_cs',
    slug: '3cs-framework',
    name: 'The 3Cs framework (Competency · Commitment · Compatibility)',
    reference: { module: 3, page: 'p3' },
    description:
      "The three dimensions that determine whether you're seen as a Valued Member of the team: Competency (you can do the work), Commitment (you reliably show up), Compatibility (you make others want to work with you). Most stuck professionals over-invest in Competency and ignore Compatibility — which is usually the bottleneck. Use as a frame whenever you feel underappreciated despite delivering good work.",
  },
  {
    id: 'three_cs_assess',
    slug: '18-question-3cs-self-assessment',
    name: '18-question 3Cs Self-Assessment',
    reference: { module: 3, page: 'p5' },
    description:
      'An 18-item self-assessment that scores you on each of the 3Cs — 6 questions per C, Likert-scored 1-5. The output is your weakest C: the one most likely to be the bottleneck holding you back from Valued Member status. Take it once as a baseline + again every 6 months to track your shift.',
  },
  {
    id: 'first_one_on_one',
    slug: 'first-1-1-model-script',
    name: 'First 1:1 model script (Scenario C)',
    reference: { module: 3, page: 'p7' },
    description:
      'A scripted approach for the first 1:1 with a new manager or new skip-level: questions to ask THEM about their priorities and style, things to share about YOU and how you work, the cadence to propose. Sets up the relationship intentionally — you driving, not waiting. Use whenever someone new enters your reporting chain.',
  },
  {
    id: 'comp_peer_pushback',
    slug: 'compatibility-role-play-senior-pushback',
    name: 'Compatibility role-play — Senior Pushback (Scenario B)',
    reference: { module: 3, page: 'p6-7' },
    description:
      'Scenario B of the 5 Compatibility role-plays: a peer pushes back hard on your decision or proposal, often in front of others. The model conversation shows how to absorb the pushback without becoming defensive or capitulating, and to land a productive next step. Practice with a colleague before you need it — the muscle memory matters when emotions are high.',
  },
  {
    id: 'comp_peer_help',
    slug: 'compatibility-role-play-peer-help',
    name: 'Compatibility role-play — Peer Help (Scenario A)',
    reference: { module: 3, page: 'p6-7' },
    description:
      "Scenario A of the 5 Compatibility role-plays: a peer asks for help when you're already overloaded. The model conversation shows how to be helpful AND honest about your bandwidth — without burning the relationship or saying yes to everything. Run it once with a colleague so the words come naturally next time.",
  },
  {
    id: 'comp_decline',
    slug: 'compatibility-role-play-declining-without-burning',
    name: 'Compatibility role-play — Declining Without Burning (Scenario D)',
    reference: { module: 3, page: 'p6-7' },
    description:
      'Scenario D of the 5 Compatibility role-plays: declining a request — from a peer, manager, or stakeholder — without damaging the relationship. The model conversation gives you the language to say no while preserving goodwill, and to offer a small alternative where possible. Practice once; deploy whenever the request is real but the answer is no.',
  },
  {
    id: 'comp_feedback',
    slug: 'compatibility-role-play-receiving-critical-feedback',
    name: 'Compatibility role-play — Receiving Critical Feedback (Scenario E)',
    reference: { module: 3, page: 'p6-7' },
    description:
      'Scenario E of the 5 Compatibility role-plays: receiving critical feedback in a way that lands well for both sides. The model conversation shows how to listen without flinching, ask clarifying questions, and close cleanly — so the feedback-giver feels heard and you walk away with something usable. Run it once; deploy whenever feedback is coming.',
  },
  {
    id: 'mgr_audit',
    slug: 'manager-priority-audit',
    name: 'Manager Priority Audit',
    reference: { module: 4, page: 'p3' },
    description:
      "A short exercise: write down what you THINK your manager's top 3 priorities are this quarter, then verify in your next 1:1. Most professionals are wrong by at least one priority — and that's exactly where misaligned effort lives. Use whenever you have a new manager, after a strategy change, or quarterly as a re-audit.",
  },
  {
    id: 'four_step_prio',
    slug: '4-step-prioritization',
    name: '4-Step Prioritization (Eisenhower + Impact-Effort)',
    reference: { module: 4, page: 'p5-6' },
    description:
      'A 4-step process combining the Eisenhower matrix (urgent × important) with the Impact-Effort grid: (1) dump everything onto a list, (2) Eisenhower-sort, (3) Impact-Effort sort, (4) pick the top 3 for this week. Cuts a 30-item list down to 3 in under 15 minutes. Use any time your task list feels overwhelming or new asks are landing.',
  },
  {
    id: 'pain_value',
    slug: 'pain-point-value-matrix',
    name: 'Pain Point Value Matrix (4×3)',
    reference: { module: 4, page: 'p7-8' },
    description:
      "A 4×3 grid that maps your potential work against (a) the 4 types of pain your manager actually feels and (b) the 3 levels of value-add you can deliver. Surfaces where your effort matches your manager's biggest pain points — and where you're working on things that won't move the needle. Use when suggesting a new initiative or finding ways to add real value beyond your role description.",
  },
  {
    id: 'value_ladder',
    slug: 'value-ladder',
    name: 'The Value Ladder (Activity → Output → Outcome → Impact)',
    reference: { module: 5, page: 'p3-4' },
    description:
      'A 4-rung ladder that converts task language (“I held daily stand-ups”) into business-impact language (“I protected $2.4M of revenue”). Climb the ladder by asking “so what?” at each rung until you hit a number — dollar value, time saved, risk avoided. Use for any email, update, review, or pitch where you need senior leaders to see the impact, not just the activity.',
  },
  {
    id: 'bluf',
    slug: 'bluf',
    name: 'BLUF — Bottom-Line-Up-Front',
    reference: { module: 5, page: 'p5-6' },
    description:
      'A communication discipline: lead with your conclusion or ask in the first sentence, then add supporting context underneath. Reverses the natural narrative order so busy readers get the answer in 30 seconds — and only dig deeper if they need to. Use for any senior email, memo, or briefing where attention is scarce.',
  },
  {
    id: 'weekly_email',
    slug: 'weekly-email-update-template',
    name: 'Weekly Email Update template',
    reference: { module: 5, page: 'p7' },
    description:
      "A Monday-morning email template that takes ~10 minutes to write and gives your manager 60 seconds of visibility into your week: 3 sections, 3 bullets each — last week's wins, this week's priorities, risks and help needed. Builds your appraisal depository asynchronously. The cumulative effect over 12 months beats the annual review.",
  },
  {
    id: 'four_bullet',
    slug: '4-bullet-status-update-framework',
    name: '4-Bullet Status Update Framework',
    reference: { module: 5, page: 'p6' },
    description:
      "A reusable 4-bullet structure for any update to a senior reader: (1) what you asked me to do, (2) what I did, (3) what's at risk, (4) if given more time, I would. Mirrors how busy leaders SCAN updates — top-to-bottom in 30 seconds. Deploy for status reports, briefing notes, monthly reviews, or re-anchoring a senior who has been out of the loop.",
  },
  {
    id: 'one_on_one_anatomy',
    slug: '1-1-anatomy-6-standard-scenarios',
    name: '1:1 Anatomy + 6 standard scenarios',
    reference: { module: 5, page: 'p8-9' },
    description:
      'The structure of an excellent 1:1: Before (you bring 3 topics + draft the agenda), During (you drive the conversation + take notes), After (you own the follow-up). 6 standard scenarios cover common 1:1 moments — New Role, Career Growth, Overload, Recovery, Beyond-Role, Reorg. Pick the scenario closest to your moment and adapt the template.',
  },
  {
    id: 'wwhtbt',
    slug: 'wwhtbt-what-would-have-to-be-true',
    name: 'WWHTBT — What Would Have to Be True (3 dimensions: You · Boss · Business)',
    reference: { module: 6, page: 'p3-4' },
    description:
      "A planning framework for any 12-month milestone: list everything that would have to be TRUE across 3 dimensions — YOU (skills/performance), BOSS (advocacy/belief), BUSINESS (org conditions) — for the milestone to land. The BUSINESS dimension is the one that quietly kills most plans (the role doesn't exist; the org isn't ready). Use before committing to any stretch milestone, career conversation, or new role.",
  },
  {
    id: 'one_three_nine',
    slug: '1-3-9-framework',
    name: 'The 1:3:9 Framework',
    reference: { module: 6, page: 'p5-6' },
    description:
      'A cascade from milestone to daily action: 1 milestone goal, 3 drivers (Work Performance, Skills, Relationships), 9 actions across daily/weekly/monthly cadences. Translates an abstract milestone into a Monday-morning to-do list. Use as a private OKR equivalent for quarterly personal planning, after a career conversation, or whenever a goal feels too big to start.',
  },
  {
    id: 'pair_commit',
    slug: 'pair-commitment-30-day-check-in',
    name: 'Pair commitment + 30-day check-in',
    reference: { module: 6, page: 'p7' },
    description:
      'An accountability ritual: pair up with someone in the room, exchange your one commitment, exchange contact info, set a 30-day check-in date. Public commitment effect makes you 2-3× more likely to follow through than private commitments. Use to convert any plan into a sustained action.',
  },
];

export const toolById = new Map<string, Tool>(tools.map((t) => [t.id, t]));
export const toolBySlug = new Map<string, Tool>(tools.map((t) => [t.slug, t]));

/** Sorted, de-duplicated list of HPB module numbers that tools reference. */
export const toolModules: number[] = [...new Set(tools.map((t) => t.reference.module))].sort(
  (a, b) => a - b,
);
