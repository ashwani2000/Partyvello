import { BadgeCheck, Gift, HeartHandshake, PackageCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const promises = [
  {
    icon: Gift,
    title: 'A thoughtful celebration range',
    text: 'Explore decorations, balloons, cake toppers, tableware, return gifts, and finishing touches in one place.',
  },
  {
    icon: BadgeCheck,
    title: 'Choices for every kind of plan',
    text: 'Find party essentials for a small family birthday, a themed gathering, or a larger event.',
  },
  {
    icon: PackageCheck,
    title: 'Retail and wholesale options',
    text: 'Shop for a single celebration or connect with us about stocking up for your business.',
  },
  {
    icon: HeartHandshake,
    title: 'Here when you need a hand',
    text: 'Our team is available to help with product questions and enquiries before you place an order.',
  },
];

export default function AboutPage() {
  return (
    <div className="container page-block content-page">
      <span className="eyebrow">About Party Vello</span>
      <h1>Celebrations made joyful, simple, and memorable.</h1>
      <div className="content-columns">
        <div>
          <p>
            Party Vello brings together curated birthday décor, party accessories, gifting essentials, and event-ready solutions for modern celebrations.
          </p>
          <p>
            We work with families, retailers, and wholesale partners who need dependable inventory, premium styling, and flexible purchasing options.
          </p>
        </div>
        <div>
          <p>
            Our mission is to make every birthday feel special through quality products, responsive service, and a smooth shopping journey from browsing to checkout.
          </p>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h3>Our mission</h3>
          <p>To create beautiful celebrations through reliable, premium, and affordable party essentials.</p>
        </div>
        <div className="info-card">
          <h3>Our vision</h3>
          <p>To become the preferred destination for birthday supplies and celebration products across retail and wholesale channels.</p>
        </div>
        <div className="info-card">
          <h3>Quality promise</h3>
          <p>Every product is selected to balance design, value, durability, and customer satisfaction.</p>
        </div>
      </div>

      <section className="about-promises">
        <div className="section-heading">
          <span className="eyebrow">The Party Vello experience</span>
          <h2>Little details. Big celebration energy.</h2>
          <p>We make it easier to bring the pieces of a celebration together, from the first idea to the finishing touches.</p>
        </div>
        <div className="about-promises-grid">
          {promises.map(({ icon: Icon, title, text }) => (
            <article className="about-promise-card" key={title}>
              <span className="about-promise-icon"><Icon size={22} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="cta-box">
        <h3>Ready to bring your party vision to life?</h3>
        <div className="cta-actions">
          <Link to="/products" className="primary-btn">Explore products</Link>
          <Link to="/contact" className="secondary-btn">Contact team</Link>
        </div>
      </div>
    </div>
  );
}
