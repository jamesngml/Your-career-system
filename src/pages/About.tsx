import { Link } from 'react-router-dom';
import { APP_VERSION, SOURCE_DOCUMENT } from '../config/version';
import { stats } from '../data';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function About() {
  useDocumentTitle('About');
  return (
    <div className="about">
      <header className="page-head">
        <h1 className="page-head__title">About</h1>
        <p className="page-head__lead">
          A digital companion to the High Performer Blueprint. When something is
          happening in your career, look up the situation, find the recommended
          HPB tool, and go to the module and page where it lives.
        </p>
      </header>

      <section className="about__section">
        <h2 className="detail__h2">How to use it</h2>
        <ol className="about__list">
          <li>
            <strong>What&rsquo;s happening?</strong> Search or browse for the situation
            closest to yours.
          </li>
          <li>
            <strong>What should I use?</strong> Each situation names the HPB tool
            that fits.
          </li>
          <li>
            <strong>Where do I find it?</strong> Open the tool for its description
            and the exact HPB module and page.
          </li>
        </ol>
        <p>
          <Link className="btn btn--primary" to="/">
            Start with your situation →
          </Link>
        </p>
      </section>

      <section className="about__section">
        <h2 className="detail__h2">What&rsquo;s inside</h2>
        <ul className="about__stats">
          <li>
            <span className="about__stat-num">{stats.sections}</span> sections
          </li>
          <li>
            <span className="about__stat-num">{stats.situations}</span> career situations
          </li>
          <li>
            <span className="about__stat-num">{stats.tools}</span> reference tools
          </li>
          <li>
            <span className="about__stat-num">{stats.synonymKeys}</span> search synonym groups
          </li>
        </ul>
      </section>

      <section className="about__section">
        <h2 className="detail__h2">Offline &amp; install</h2>
        <p>
          After your first visit the whole system — situations, tools and the
          search index — is cached on your device and works with no internet
          connection. On a phone, use your browser&rsquo;s <em>Add to Home Screen</em>{' '}
          to install it as a standalone app.
        </p>
      </section>

      <section className="about__section">
        <h2 className="detail__h2">Notes</h2>
        <p>
          This app is a reference layer only. It does not contain the HPB module
          content itself — the &ldquo;HPB Module&rdquo; references point you to where each
          tool lives in your course materials.
        </p>
      </section>

      <footer className="about__meta">
        <p>
          Version {APP_VERSION} &middot; Content source: {SOURCE_DOCUMENT} &middot;
          Insights Associates Pte Ltd &middot; Copyright 2026
        </p>
      </footer>
    </div>
  );
}
