import { Sparkles } from 'lucide-react';

export default function DiwaliSaleCard() {
  return (
    <section className="container diwali-sale-section" aria-labelledby="diwali-sale-title">
      <div className="diwali-sale-card">
        <div className="diwali-sale-art" aria-hidden="true">
          <span className="diwali-sale-orbit orbit-one" />
          <span className="diwali-sale-orbit orbit-two" />
          <span className="diwali-sale-star star-one">✦</span>
          <span className="diwali-sale-star star-two">✧</span>
          <span className="diwali-sale-star star-three">✦</span>
          <span className="diwali-sale-star star-four">✧</span>
          <span className="diwali-sale-lamp">
            <span className="diwali-sale-flame" />
            <span className="diwali-sale-bowl" />
            <span className="diwali-sale-base" />
          </span>
          <span className="diwali-sale-reflection" />
        </div>

        <div className="diwali-sale-copy">
          <span className="diwali-sale-eyebrow"><Sparkles size={16} /> A little festive magic is on its way</span>
          <h2 id="diwali-sale-title">Diwali Sale Coming SOON</h2>
          <p>Get ready to light up your celebrations with joyful surprises and festive deals.</p>
        </div>
      </div>
    </section>
  );
}
