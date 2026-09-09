interface EmptyStateProps {
  onReset: () => void;
  /** Optional context, e.g. the current query. */
  query?: string;
  resetLabel?: string;
}

/** Shown when a search / filter yields no matches. Mirrors source `#no-results`. */
export function EmptyState({ onReset, query, resetLabel = 'Return to All' }: EmptyStateProps) {
  return (
    <div className="empty" role="status">
      <p className="empty__title">No matches{query ? <> for &ldquo;{query}&rdquo;</> : null}.</p>
      <p className="empty__hint">Try a different keyword or return to All.</p>
      <button type="button" className="btn btn--primary" onClick={onReset}>
        {resetLabel}
      </button>
    </div>
  );
}
