import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface NotFoundProps {
  title?: string;
  message?: string;
}

export function NotFound({
  title = 'Page not found',
  message = 'That link doesn’t match anything here.',
}: NotFoundProps) {
  useDocumentTitle(title);
  return (
    <div className="notfound">
      <p className="notfound__code">404</p>
      <h1 className="notfound__title">{title}</h1>
      <p className="notfound__msg">{message}</p>
      <div className="notfound__actions">
        <Link className="btn btn--primary" to="/">
          Go to Situations
        </Link>
        <Link className="btn btn--ghost" to="/tools">
          Browse Tools
        </Link>
      </div>
    </div>
  );
}
