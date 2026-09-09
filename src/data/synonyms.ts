/**
 * Synonym dictionary for smarter keyword search — migrated verbatim from the
 * source `SYNONYMS` map.
 *
 * When the user searches for X, the search engine also checks for each synonym
 * of X. Bidirectional pairs are defined explicitly (e.g. boss <-> manager).
 * Keys and values are all lowercase.
 */
export const synonyms: Record<string, string[]> = {
  // People & roles
  boss: ['manager', 'supervisor', 'lead', 'leader', 'head'],
  manager: ['boss', 'supervisor', 'lead', 'leader'],
  supervisor: ['boss', 'manager', 'lead'],
  leader: ['boss', 'manager', 'lead'],
  'skip-level': ['grandboss', 'director', 'vp', 'skip level', 'senior leader'],
  skip: ['skip-level', 'grandboss', 'skip level'],
  grandboss: ['skip-level', 'director', 'senior leader'],
  stakeholder: ['partner', 'advocate', 'sponsor', 'ally'],
  sponsor: ['advocate', 'champion', 'stakeholder', 'supporter'],
  advocate: ['sponsor', 'champion', 'supporter'],
  team: ['colleagues', 'peers', 'coworkers', 'teammates'],
  peer: ['colleague', 'teammate', 'coworker'],
  colleague: ['peer', 'teammate', 'coworker'],
  teammate: ['peer', 'colleague', 'coworker'],

  // Career events
  promotion: ['advance', 'advancement', 'step up', 'promoted', 'move up'],
  promoted: ['promotion', 'advance', 'step up'],
  raise: ['pay rise', 'pay raise', 'salary increase', 'bump', 'comp'],
  appraisal: ['review', 'feedback', 'evaluation', 'performance review'],
  review: ['appraisal', 'feedback', 'evaluation'],
  feedback: ['critique', 'review', 'appraisal', 'evaluation'],
  transition: ['change', 'shift', 'move', 'switch'],
  leave: ['resign', 'quit', 'exit', 'move on'],
  quit: ['resign', 'leave', 'exit'],
  resign: ['quit', 'leave', 'exit'],

  // States / conditions
  stuck: ['blocked', 'stalled', 'plateaued', 'stagnant', 'frustrated'],
  blocked: ['stuck', 'stalled', 'stopped'],
  overwhelmed: ['drowning', 'swamped', 'burned out', 'burnout', 'exhausted'],
  drowning: ['overwhelmed', 'swamped'],
  swamped: ['overwhelmed', 'drowning'],
  burnout: ['burned out', 'overwhelmed', 'exhausted'],
  'passed over': ['overlooked', 'missed out', 'skipped'],
  overlooked: ['passed over', 'missed out', 'ignored'],

  // Decisions / choices
  options: ['choice', 'choices', 'decision', 'alternatives', 'paths', 'should i', 'considering', 'decide'],
  choice: ['options', 'decision', 'alternatives', 'paths'],
  decision: ['options', 'choice', 'decide', 'deciding'],
  decide: ['decision', 'choose', 'deciding', 'options'],
  considering: ['thinking about', 'weighing', 'options'],

  // Communication
  email: ['message', 'note', 'memo'],
  message: ['email', 'note', 'memo'],
  '1:1': ['one on one', 'one-on-one', 'check-in'],
  'one-on-one': ['1:1', 'one on one'],
  'one on one': ['1:1', 'one-on-one'],
  meeting: ['session', 'discussion', 'catch-up'],
  update: ['status', 'report', 'briefing', 'summary'],
  status: ['update', 'report', 'briefing'],

  // Visibility / impact
  visibility: ['recognition', 'seen', 'noticed', 'credit', 'exposure'],
  recognition: ['visibility', 'credit', 'noticed', 'appreciated'],
  influence: ['sway', 'persuade', 'convince'],
  credibility: ['trust', 'respect', 'reputation'],
  impact: ['value', 'outcome', 'result', 'contribution'],
  value: ['impact', 'contribution', 'outcome'],
  contribute: ['add value', 'impact', 'contribution'],

  // Goals / planning
  goal: ['milestone', 'target', 'objective', 'ambition'],
  milestone: ['goal', 'target', 'objective'],
  target: ['goal', 'milestone', 'objective'],
  vision: ['goal', 'ambition', 'aim'],
  plan: ['roadmap', 'action plan', 'strategy'],
  strategy: ['plan', 'approach', 'direction'],
  priority: ['focus', 'top priority', 'important', 'matters'],

  // Work events
  project: ['initiative', 'assignment', 'work'],
  initiative: ['project', 'program', 'effort'],
  task: ['work', 'assignment', 'to-do'],
  ask: ['pitch', 'request', 'proposal', 'case'],
  pitch: ['ask', 'request', 'proposal'],
  request: ['ask', 'pitch', 'proposal'],
  reorg: ['restructure', 'reorganisation', 'reorganization', 'shake up'],
  restructure: ['reorg', 'reorganisation'],

  // Difficulty
  difficult: ['hard', 'tough', 'challenging', 'tricky'],
  tough: ['hard', 'difficult', 'challenging'],
  hard: ['difficult', 'tough', 'challenging'],
  conflict: ['disagreement', 'pushback', 'tension', 'dispute'],
  pushback: ['conflict', 'resistance', 'disagreement'],
  criticism: ['critical feedback', 'negative feedback'],
  fear: ['worry', 'anxiety', 'scared', 'afraid'],
  worry: ['fear', 'anxiety', 'concern', 'stress'],

  // Beginnings
  new: ['starting', 'joining', 'beginning', 'fresh', 'first'],
  first: ['new', 'starting', 'beginning'],
  starting: ['new', 'joining', 'beginning'],
  joining: ['new', 'starting'],
  onboarding: ['joining', 'starting', 'new role'],

  // Generic career
  career: ['job', 'role', 'professional'],
  role: ['career', 'job', 'position'],
  job: ['role', 'career', 'position'],
  mindset: ['attitude', 'outlook', 'approach'],
  owner: ['ownership', 'agency'],
};
