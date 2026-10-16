import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container page-block empty-state-card">
      <h1>404</h1>
      <p>The page you are looking for cannot be found.</p>
      <Link to="/" className="primary-btn">Go home</Link>
    </div>
  );
}
