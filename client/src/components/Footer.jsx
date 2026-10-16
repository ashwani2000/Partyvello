import { Globe, Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>Party Vello</h3>
          <p>
            Premium birthday décor, balloon styling, and celebration essentials for joyful events.
          </p>
          <div className="socials">
            <a href="https://facebook.com" aria-label="Facebook"><Globe size={18} /></a>
            <a href="https://instagram.com" aria-label="Instagram"><Sparkles size={18} /></a>
            <a href="mailto:hello@partynest.com" aria-label="Email"><Mail size={18} /></a>
          </div>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4>Policies</h4>
          <ul className="footer-links">
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul className="footer-links contact-list">
            <li><Phone size={15} /> +91-89208-85246</li>
            <li><Mail size={15} /> hello@partynest.com</li>
            <li><MapPin size={15} /> Akabarpur, Behrampur, Ghaziabad, 201009</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 Party Vello. All rights reserved.
      </div>
    </footer>
  );
}
