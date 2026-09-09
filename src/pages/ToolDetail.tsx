import { Link, useParams } from 'react-router-dom';
import { getToolBySlug, referenceLabel, situationsForTool, sectionById } from '../data';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { NotFound } from './NotFound';

export function ToolDetail() {
  const { slug = '' } = useParams();
  const tool = getToolBySlug(slug);

  useDocumentTitle(tool?.name);

  if (!tool) {
    return <NotFound title="Tool not found" message="That tool link doesn’t match any HPB tool." />;
  }

  const related = situationsForTool(tool.id);
  const { url, internalRoute } = tool.reference;

  return (
    <article className="detail">
      <nav className="detail__crumbs" aria-label="Breadcrumb">
        <Link to="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{tool.name}</span>
      </nav>

      <header className="detail__head">
        <p className="detail__kicker">HPB Tool</p>
        <h1 className="detail__title">{tool.name}</h1>
      </header>

      <section className="detail__section">
        <h2 className="detail__h2">Description</h2>
        <p className="detail__body">{tool.description}</p>
      </section>

      <section className="detail__section">
        <h2 className="detail__h2">HPB reference</h2>
        <p className="detail__body">
          <strong>{referenceLabel(tool)}</strong>
        </p>
        {url ? (
          <a className="btn btn--primary" href={url} target="_blank" rel="noreferrer">
            Open in HPB Module {tool.reference.module} ↗
          </a>
        ) : internalRoute ? (
          <Link className="btn btn--primary" to={internalRoute}>
            Open in HPB Module {tool.reference.module} →
          </Link>
        ) : (
          <p className="detail__note">
            Reference only — open your HPB course materials at this module and page.
            A direct link can be added later without changing this page.
          </p>
        )}
      </section>

      <section className="detail__section">
        <h2 className="detail__h2">
          Related situations <span className="detail__count">({related.length})</span>
        </h2>
        <ul className="detail__links">
          {related.map((situation) => {
            const section = sectionById.get(situation.section);
            return (
              <li key={situation.id}>
                <Link className="detail__link" to={`/situations/${situation.slug}`}>
                  <span
                    className="detail__dot"
                    style={{ background: section?.color }}
                    aria-hidden="true"
                  />
                  <span>{situation.text}</span>
                  <span className="detail__link-section">{section?.shortLabel}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </article>
  );
}
