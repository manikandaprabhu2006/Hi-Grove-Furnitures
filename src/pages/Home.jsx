import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gem, Hammer, Infinity as Inf, Home as HomeIcon, ShieldCheck, Headphones, Star } from 'lucide-react';
import SEO from '../components/SEO';
import HeroScene from '../components/HeroScene';
import CraftSection from '../components/CraftSection';
import Carousel from '../components/Carousel';
import Countdown from '../components/Countdown';
import { ProductGrid } from '../components/ProductCard';
import { ProductSkeletons } from '../components/Bits';
import ProductImage from '../components/ProductImage';
import { useStore } from '../store/StoreContext';
import { useRepo } from '../services/db';
import { whatsappUrl } from '../lib/format';

function WoodSection() {
  const ref = useRef(null);
  const move = (e) => {
    const el = ref.current; if (!el) return;
    const b = el.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
    el.style.setProperty('--mx', `${x * 100}%`); el.style.setProperty('--my', `${y * 100}%`);
    el.style.setProperty('--bx', `${(x - 0.5) * -40}px`); el.style.setProperty('--by', `${(y - 0.5) * -24}px`);
  };
  const traits = [
    ['Natural grain', 'No two boards match. The rings and cathedral patterns make each piece one of a kind.'],
    ['Rich texture', 'Fine, even pores and a smooth surface that feels good to touch.'],
    ['Strength', 'Teak is a dense hardwood, well suited to furniture that is used every day.'],
    ['Warm appearance', 'A golden-brown tone that deepens gently over the years.'],
    ['Timeless appeal', 'Wood that suits a traditional home as easily as a modern one.'],
  ];
  return (
    <section className="woodsec" ref={ref} onPointerMove={move} aria-labelledby="wood-h">
      <div className="woodsec__tex" aria-hidden="true" /><div className="woodsec__light" aria-hidden="true" />
      <div className="wrap woodsec__in">
        <h2 id="wood-h" className="display display--wood">THE BEAUTY OF REAL WOOD</h2>
        <p className="lead">Teak has been used in Indian homes for generations. Move your cursor across the wood and watch the grain catch the light.</p>
        <dl className="traits">
          {traits.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}
        </dl>
      </div>
    </section>
  );
}

export default function Home() {
  const { categories, products, collections, home, liveOffers, ratings, loading, allProducts } = useStore();
  const [testimonials] = useRepo('testimonials');
  const [banners] = useRepo('banners');
  const [tab, setTab] = useState('loved');

  const featured = useMemo(() => {
    const col = collections.find((c) => c.slug === home.featuredCollection);
    const list = col ? col.productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) : products.filter((p) => p.featured);
    return list.slice(0, 8);
  }, [collections, products, home.featuredCollection]);

  const tabs = useMemo(() => {
    const premium = collections.find((c) => c.slug === 'premium');
    return {
      loved: ['Most Loved', [...products].filter((p) => p.bestSeller).sort((a, b) => (ratings[b.id]?.avg || 0) - (ratings[a.id]?.avg || 0))],
      new: ['New Arrivals', products.filter((p) => p.newArrival)],
      premium: ['Premium Collection', premium ? premium.productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) : []],
      under: ['Under ₹25,000', products.filter((p) => p.price < 25000).sort((a, b) => b.price - a.price)],
    };
  }, [products, collections, ratings]);

  const limited = liveOffers.find((o) => o.placement === 'limited' && o.endDate) || liveOffers.find((o) => o.placement === 'limited');
  const heroLines = home.heroHeading.split('\n');
  const why = [
    [Gem, 'Premium materials', 'Thoughtfully selected materials.'],
    [Hammer, 'Crafted with care', 'Attention to details and finish.'],
    [Inf, 'Timeless design', 'Furniture designed to complement changing interiors.'],
    [HomeIcon, 'Built for everyday living', 'Designed around comfort and functionality.'],
    [ShieldCheck, 'Secure shopping', 'Simple and reliable ecommerce experience.'],
    [Headphones, 'Customer support', 'Easy assistance for product and order queries.'],
  ];
  const midBanner = banners.find((b) => b.status === 'active' && b.placement === 'home-mid');
  const shownTestimonials = testimonials.filter((t) => t.status === 'active');

  return (
    <>
      <SEO title="Premium Teak Wood Furniture in Tamil Nadu" description="Hi Grove Furnitures, Tirunelveli. Premium teak wood sofas, beds, dining tables and more, crafted for Indian homes. Shop online across Tamil Nadu." />

      <section className="hero grain-bg" aria-labelledby="hero-h">
        <div className="hero__in wrap">
          <div className="hero__copy">
            <motion.h1 id="hero-h" className="display hero__h" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
              {heroLines.map((l, i) => <span key={i}>{l}</span>)}
            </motion.h1>
            <motion.p className="hero__p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>{home.heroText}</motion.p>
            <motion.div className="row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }}>
              <Link to={home.ctaHref} className="btn btn--gold">{home.ctaLabel}</Link>
              <Link to={home.cta2Href} className="btn btn--ghost-light">{home.cta2Label}</Link>
            </motion.div>
          </div>
          <div className="hero__visual">
            {home.heroMedia ? <img src={home.heroMedia} alt="Hi Grove Furnitures showroom" /> : <HeroScene />}
          </div>
        </div>
      </section>

      {limited && (
        <div className="offerband">
          <div className="wrap offerband__in">
            <span><b>{limited.name}.</b> {limited.description}</span>
            <Countdown end={limited.endDate} />
            <Link to="/offers" className="offerband__link">See offers</Link>
          </div>
        </div>
      )}

      <WoodSection />

      <section className="section wrap" aria-labelledby="cat-h">
        <header className="sec-head"><h2 id="cat-h" className="h2">Shop by room</h2></header>
        <div className="cats">
          {categories.map((c, i) => (
            <Link key={c.id} to={`/category/${c.slug}`} className={`cat cat--${i}`} data-cursor="VIEW">
              <div className="cat__img"><ProductImage image={c.image} product={{ name: c.name, color: 'Natural Teak' }} /></div>
              <div className="cat__body">
                <h3>{c.name}</h3>
                <p>{c.subcategories.join(', ')}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section wrap" aria-labelledby="feat-h">
        <header className="sec-head sec-head--row"><h2 id="feat-h" className="h2">SIGNATURE TEAK COLLECTION</h2><Link to="/shop" className="link">View all furniture</Link></header>
        {loading ? <ProductSkeletons n={8} /> : <ProductGrid items={featured} />}
      </section>

      <section className="section section--tint" aria-labelledby="best-h">
        <div className="wrap">
          <header className="sec-head sec-head--row">
            <h2 id="best-h" className="h2">Best sellers</h2>
            <div className="tabs" role="tablist" aria-label="Product lists">
              {Object.entries(tabs).map(([k, [label]]) => (
                <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>{label}</button>
              ))}
            </div>
          </header>
          {tabs[tab][1].length ? <Carousel key={tab} items={tabs[tab][1]} /> : <p className="muted">Nothing here yet.</p>}
        </div>
      </section>

      <CraftSection />

      <section className="section wrap" aria-labelledby="why-h">
        <header className="sec-head"><h2 id="why-h" className="h2">Why Hi Grove Furnitures</h2></header>
        <div className="why">
          {why.map(([Icon, t, d]) => (
            <div className="why__item" key={t}><Icon size={26} strokeWidth={1.4} /><h3>{t}</h3><p>{d}</p></div>
          ))}
        </div>
      </section>

      {midBanner && (
        <section className="wrap section--tight">
          <div className="promo">
            <div><h2 className="h2">{midBanner.title}</h2><p>{midBanner.text}</p></div>
            <a className="btn btn--gold" href={midBanner.href === 'whatsapp' ? whatsappUrl('Hello, I would like a custom size piece.') : midBanner.href} target={midBanner.href === 'whatsapp' ? '_blank' : undefined} rel="noreferrer">{midBanner.ctaLabel}</a>
          </div>
        </section>
      )}

      {home.showTestimonials && shownTestimonials.length > 0 && (
        <section className="section wrap" aria-labelledby="tm-h">
          <header className="sec-head"><h2 id="tm-h" className="h2">What customers say</h2></header>
          <div className="tms">
            {shownTestimonials.map((t) => (
              <figure className="tm" key={t.id}>
                <div className="tm__stars" aria-label={`${t.rating} out of 5`}>{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={15} className={i <= t.rating ? 'on' : ''} />)}</div>
                <blockquote>{t.review}</blockquote>
                <figcaption><b>{t.name}</b>, {t.location}<span>{t.product}</span></figcaption>
                {t.sample && <em className="tm__tag">Sample review</em>}
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="cta grain-bg" aria-labelledby="cta-h">
        <div className="wrap cta__in">
          <h2 id="cta-h" className="display">BRING HOME THE WARMTH OF TEAK.</h2>
          <Link to="/shop" className="btn btn--gold">EXPLORE FURNITURE</Link>
        </div>
      </section>
    </>
  );
}
