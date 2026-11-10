import { Link } from 'react-router-dom';
import { Wordmark } from './Wordmark';

const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || '';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div>
            <Wordmark inverse />
            <p className="site-footer__blurb" style={{ marginTop: 'var(--space-3)' }}>
              Small-group tours across Indonesia, led by guides who live there.
            </p>
          </div>

          <div>
            <p className="site-footer__title">Explore</p>
            <ul className="site-footer__list">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/tours">All tours</Link>
              </li>
              <li>
                <Link to="/#destinations">Destinations</Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="site-footer__title">Enquiries</p>
            <ul className="site-footer__list">
              {whatsappNumber ? (
                <li>
                  <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                    Chat on WhatsApp
                  </a>
                </li>
              ) : null}
              {contactEmail ? (
                <li>
                  <a href={`mailto:${contactEmail}`}>Email us</a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} Vacasky. All rights reserved.</span>
          <span>Tours and travel in Indonesia.</span>
        </div>
      </div>
    </footer>
  );
}
