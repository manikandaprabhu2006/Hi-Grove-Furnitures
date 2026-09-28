import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE = (import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/$/, '');
const BRAND = 'Hi Grove Furnitures';

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

export default function SEO({ title, description, image = '/brand/og.jpg', path, noindex = false, jsonLd, type = 'website' }) {
  const { pathname } = useLocation();
  useEffect(() => {
    const full = title ? (title.includes(BRAND) ? title : `${title} | ${BRAND}`) : `${BRAND} | Premium Teak Wood Furniture, Tamil Nadu`;
    const url = SITE + (path ?? pathname);
    const img = image.startsWith('http') ? image : SITE + image;
    document.title = full;
    setMeta('name', 'description', description || '');
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:description', description || '');
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('property', 'og:site_name', BRAND);
    setMeta('name', 'twitter:card', 'summary_large_image');
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = url;
    let ld = document.getElementById('ld-json');
    if (jsonLd) {
      if (!ld) { ld = document.createElement('script'); ld.id = 'ld-json'; ld.type = 'application/ld+json'; document.head.appendChild(ld); }
      ld.textContent = JSON.stringify(jsonLd);
    } else if (ld) ld.remove();
  }, [title, description, image, path, pathname, noindex, jsonLd, type]);
  return null;
}
