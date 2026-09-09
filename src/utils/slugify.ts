/**
 * Deterministic slugifier used to derive stable, shareable ids for situations.
 *
 * Rules:
 *  - lowercase
 *  - apostrophes (straight or curly) are dropped, so "boss's" -> "bosss"
 *  - every other run of non-alphanumeric characters becomes a single "-"
 *  - leading / trailing "-" trimmed
 *
 * Examples:
 *   "I have a 1:1 coming up"              -> "i-have-a-1-1-coming-up"
 *   "My boss's strategy has just changed" -> "my-bosss-strategy-or-priorities-have-just-changed"
 *   "A new manager is starting"           -> "a-new-manager-is-starting"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/['‘’ʼ]/g, '') // drop apostrophes entirely
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
