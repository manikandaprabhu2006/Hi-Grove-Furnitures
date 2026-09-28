import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <section className="nf grain-bg">
      <SEO title="Page not found" description="This page could not be found." noindex />
      <div className="wrap">
        <h1 className="display">THIS PAGE DOESN'T EXIST.<br />BUT YOUR PERFECT FURNITURE MIGHT.</h1>
        <Link to="/shop" className="btn btn--gold">BACK TO COLLECTION</Link>
      </div>
    </section>
  );
}
