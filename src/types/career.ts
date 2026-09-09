/**
 * Core domain types for Your Career System.
 *
 * All content values originate from the source-of-truth document
 * `reference/HPB_YourCareerSystem_v4.html`. Only routing metadata (`slug`) and
 * the optional forward-looking `url` / `internalRoute` fields are additions.
 */

/** One of the five top-level sections of the career system. */
export interface Section {
  /** 1-5, matching the source `SECTIONS` map keys. */
  id: number;
  /** Full section title from the source (e.g. "Mindset & Perspective"). */
  title: string;
  /** Short chip label used in the filter row (e.g. "Mindset"). */
  shortLabel: string;
  /** Hex accent colour from the source. */
  color: string;
  /** Italic description shown under the section header. */
  description: string;
}

/**
 * A pointer to where a tool lives inside the HPB course material.
 *
 * The source HTML only carries `module` + `page`. `url` and `internalRoute`
 * are intentionally optional so a future version can attach a real
 * destination (PDF, LMS deep link, internal module page) without a data
 * migration. See README "How to add future HPB module links".
 */
export interface ToolReference {
  /** HPB module number (1-6). */
  module: number;
  /** Page reference string from the source (e.g. "p8-9"). */
  page: string;
  /** Optional external URL (PDF, LMS, course platform). Not yet populated. */
  url?: string;
  /** Optional in-app route to a future interactive version of the tool. */
  internalRoute?: string;
}

/** A reference tool / framework from the HPB. 22 in total. */
export interface Tool {
  /** Stable id — the original `TOOLS` object key from the source (e.g. "bluf"). */
  id: string;
  /** URL-safe slug for deep linking (e.g. "bluf"). */
  slug: string;
  /** Exact tool name from the source. */
  name: string;
  /** Where to find it in the HPB. */
  reference: ToolReference;
  /** Exact multi-sentence description from the source. */
  description: string;
}

/** A career situation a user might look up. 45 in total. */
export interface Situation {
  /** Stable id, derived deterministically from the situation text. */
  id: string;
  /** URL-safe slug for deep linking. Equal to `id`. */
  slug: string;
  /** Section id (1-5) this situation belongs to. */
  section: number;
  /** Exact situation text from the source. */
  text: string;
  /** Ids of the tools linked to this situation, in source order. */
  tools: string[];
}

/** A situation grouped under its section — used by the search/render pipeline. */
export interface SituationGroup {
  section: Section;
  situations: Situation[];
}
