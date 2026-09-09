import type { Section } from '../types/career';

/**
 * The five sections, verbatim from the source `SECTIONS` map.
 * `shortLabel` values come from the source filter chips (`#chips`).
 */
export const sections: Section[] = [
  {
    id: 1,
    title: 'Mindset & Perspective',
    shortLabel: 'Mindset',
    color: '#F4B7B7',
    description:
      "When your head needs a reset — feeling stuck, passed over, playing safe, or weighing whether to stay or leave",
  },
  {
    id: 2,
    title: 'People & Transitions',
    shortLabel: 'People',
    color: '#FFE599',
    description:
      'New boss · new role · new team · cross-functional joins · pushback, declines, and tough feedback',
  },
  {
    id: 3,
    title: 'Priorities & Projects',
    shortLabel: 'Priorities',
    color: '#C5E1A5',
    description:
      'What to take on · what to drop · new asks · drowning in tasks · suggesting initiatives',
  },
  {
    id: 4,
    title: 'Visibility & Communication',
    shortLabel: 'Visibility',
    color: '#BBDEFB',
    description:
      'Emails · 1:1s · status updates · reviews · skip-levels · asking for more · recovering from a miss',
  },
  {
    id: 5,
    title: 'Goals & Long Game',
    shortLabel: 'Goals',
    color: '#D5C5E0',
    description:
      'Planning the next 12 months · staying on track · accountability · momentum',
  },
];

export const sectionById = new Map<number, Section>(sections.map((s) => [s.id, s]));
