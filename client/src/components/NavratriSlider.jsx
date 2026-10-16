import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import dussehraBanner from '../assets/dussehra-banner.svg';
import diwaliBanner from '../assets/diwali-banner.svg';

const slides = [
  {
    eyebrow: 'Festival special · nine nights of celebration',
    title: 'Happy Navaratri',
    text: 'Wishing you nine nights filled with color, music, and joyful moments.',
    image: 'https://images.unsplash.com/photo-1790030838058-bdbb9f3fb8b3?auto=format&fit=crop&w=1800&q=85',
    alt: 'Women in traditional saris dancing with dandiya sticks',
    action: 'Celebrate with us',
    href: '/products',
  },
  {
    eyebrow: 'The triumph of good over evil',
    title: 'Happy Dussehra',
    text: 'May this Dussehra fill your home with courage, happiness, and new beginnings.',
    image: dussehraBanner,
    alt: 'Colorful Dussehra illustration with a glowing sunset, festive lights, and a traditional effigy',
    action: 'Celebrate Dussehra',
    href: '/products/decorations',
  },
  {
    eyebrow: 'A festival of light, love, and togetherness',
    title: 'Happy Diwali',
    text: 'May your celebrations shine bright with beautiful moments and joyful memories.',
    image: diwaliBanner,
    alt: 'Glowing Diwali illustration with a traditional diya, rangoli, and festive fireworks',
    action: 'Celebrate Diwali',
    href: '/products',
  },
];

export default function NavratriSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const moveSlide = (direction) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  };

  const slide = slides[activeSlide];

  return (
    <section className="navratri-slider" aria-label="Festival celebration banner" aria-roledescription="carousel">
      <article className="navratri-slide" role="group" aria-roledescription="slide" aria-label={`${activeSlide + 1} of ${slides.length}`}>
        <img key={slide.image} className="navratri-slide-image" src={slide.image} alt={slide.alt} />
        <div className="navratri-slide-shade" />
        <div className="navratri-slide-content">
          <span className="navratri-eyebrow"><Sparkles size={15} /> {slide.eyebrow}</span>
          <h2>{slide.title}</h2>
          <p>{slide.text}</p>
          <Link to={slide.href} className="navratri-cta">
            {slide.action} <ArrowRight size={17} />
          </Link>
        </div>
      </article>

      <button type="button" className="navratri-arrow previous" onClick={() => moveSlide(-1)} aria-label="Previous slide">
        <ChevronLeft size={22} />
      </button>
      <button type="button" className="navratri-arrow next" onClick={() => moveSlide(1)} aria-label="Next slide">
        <ChevronRight size={22} />
      </button>

      <div className="navratri-controls" aria-label="Carousel controls">
        <div className="navratri-indicators">
          {slides.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className={`navratri-indicator ${index === activeSlide ? 'active' : ''}`}
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === activeSlide ? 'true' : undefined}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
        <button
          type="button"
          className="navratri-play-toggle"
          aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
          onClick={() => setIsPlaying((playing) => !playing)}
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
        </button>
      </div>
    </section>
  );
}