import { Link, useParams } from 'react-router-dom';
import { getSituationBySlug, sectionForSituation } from '../data';
import { SituationCard } from '../components/SituationCard';
import { SectionHeader } from '../components/SectionHeader';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { NotFound } from './NotFound';

export function SituationDetail() {
  const { slug = '' } = useParams();
  const situation = getSituationBySlug(slug);

  useDocumentTitle(situation?.text);

  if (!situation) {
    return (
      <NotFound
        title="Situation not found"
        message="That situation link doesn’t match anything in the career system."
      />
    );
  }

  const section = sectionForSituation(situation);

  return (
    <article className="detail">
      <nav className="detail__crumbs" aria-label="Breadcrumb">
        <Link to="/">Situations</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{situation.text}</span>
      </nav>

      {section && <SectionHeader section={section} as="h2" />}

      <SituationCard situation={situation} linkToDetail={false} headingLevel="h1" />

      <p className="detail__back">
        <Link to={section ? `/?section=${section.id}` : '/'}>
          ← More {section ? section.shortLabel : ''} situations
        </Link>
      </p>
    </article>
  );
}
