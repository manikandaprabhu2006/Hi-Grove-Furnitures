import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ShoppingBag } from 'lucide-react';
import SEO from '../components/SEO';
import { Empty } from '../components/Bits';
import { Summary } from './Cart';
import { useStore } from '../store/StoreContext';
import { placeOrder } from '../services/orders';
import { inr } from '../lib/format';

const STEPS = ['Details', 'Address', 'Delivery', 'Payment'];
const rules = {
  name: (v) => (v.trim().length < 2 ? 'Enter your full name.' : ''),
  phone: (v) => (!/^[6-9]\d{9}$/.test(v) ? 'Enter a 10-digit Indian mobile number.' : ''),
  email: (v) => (!/^\S+@\S+\.\S+$/.test(v) ? 'Enter a valid email address.' : ''),
  line1: (v) => (v.trim().length < 1 ? 'Enter your house or flat number.' : ''),
  street: (v) => (v.trim().length < 3 ? 'Enter your street.' : ''),
  area: (v) => (v.trim().length < 2 ? 'Enter your area.' : ''),
  city: (v) => (v.trim().length < 2 ? 'Enter your city.' : ''),
  district: (v) => (v.trim().length < 2 ? 'Enter your district.' : ''),
  state: (v) => (v.trim().length < 2 ? 'Enter your state.' : ''),
  pin: (v) => (!/^[1-9]\d{5}$/.test(v) ? 'Enter a valid 6-digit PIN code.' : ''),
};
const GROUPS = [['name', 'phone', 'email'], ['line1', 'street', 'area', 'city', 'district', 'state', 'pin']];

export default function Checkout() {
  const { lines, totals, settings, clearCart, cart, toast } = useStore();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [v, setV] = useState({ name: '', phone: '', email: '', line1: '', street: '', area: '', city: '', district: '', state: 'Tamil Nadu', pin: '' });
  const [err, setErr] = useState({});
  const methods = Object.entries(settings.payment || {});
  const firstOn = methods.find(([, m]) => m.enabled)?.[0] || '';
  const [pay, setPay] = useState(firstOn);
  const [busy, setBusy] = useState(false);

  if (!lines.length) return (<div className="wrap section--tight"><SEO title="Checkout" description="Checkout" noindex /><Empty icon={ShoppingBag} title="YOUR CART IS WAITING FOR SOMETHING BEAUTIFUL." cta="EXPLORE COLLECTION" /></div>);

  const field = (k, label, props = {}) => (
    <div className={`field ${err[k] ? 'has-err' : ''}`}>
      <label htmlFor={k}>{label}</label>
      <input id={k} name={k} value={v[k]} onChange={(e) => { setV({ ...v, [k]: e.target.value }); if (err[k]) setErr({ ...err, [k]: '' }); }} aria-invalid={!!err[k]} aria-describedby={err[k] ? `${k}-e` : undefined} {...props} />
      {err[k] && <p id={`${k}-e`} className="error small">{err[k]}</p>}
    </div>
  );

  const next = () => {
    if (step < 2) {
      const e = {}; GROUPS[step].forEach((k) => { const m = rules[k](v[k]); if (m) e[k] = m; });
      setErr(e); if (Object.keys(e).length) return;
    }
    setStep(step + 1);
  };

  const submit = async () => {
    if (!pay) return;
    setBusy(true);
    try {
      const order = await placeOrder({
        customer: { name: v.name, phone: v.phone, email: v.email },
        address: { line1: v.line1, street: v.street, area: v.area, city: v.city, district: v.district, state: v.state, pin: v.pin },
        delivery: 'Standard delivery', paymentMethod: pay, totals, couponCode: totals.coupon?.code || cart.coupon,
      });
      clearCart();
      nav(`/orders/${order.id}`, { state: { placed: true } });
    } catch (e) { toast('We could not place your order. Please try again.', 'warn'); setBusy(false); }
  };

  return (
    <>
      <SEO title="Checkout" description="Secure checkout for Hi Grove Furnitures." noindex />
      <div className="checkout wrap">
        <header className="checkout__head"><Link to="/cart" className="link">Back to cart</Link><h1 className="h1">Checkout</h1></header>
        <ol className="steps" aria-label="Checkout steps">
          {STEPS.map((s, i) => (
            <li key={s} className={i === step ? 'is-on' : i < step ? 'is-done' : ''}>
              <button onClick={() => i < step && setStep(i)} disabled={i >= step} aria-current={i === step ? 'step' : undefined}><span className="steps__n">{i < step ? <Check size={14} /> : `0${i + 1}`}</span>{s}</button>
            </li>
          ))}
        </ol>
        <div className="cartgrid">
          <div className="panel">
            {step === 0 && (<><h2 className="h3">Your details</h2>{field('name', 'Full name', { autoComplete: 'name' })}{field('phone', 'Mobile number', { inputMode: 'numeric', maxLength: 10, autoComplete: 'tel-national' })}{field('email', 'Email', { type: 'email', autoComplete: 'email' })}</>)}
            {step === 1 && (<><h2 className="h3">Delivery address</h2>{field('line1', 'House / Flat', { autoComplete: 'address-line1' })}{field('street', 'Street', { autoComplete: 'address-line2' })}{field('area', 'Area')}<div className="two">{field('city', 'City', { autoComplete: 'address-level2' })}{field('district', 'District')}</div><div className="two">{field('state', 'State', { autoComplete: 'address-level1' })}{field('pin', 'PIN code', { inputMode: 'numeric', maxLength: 6, autoComplete: 'postal-code' })}</div></>)}
            {step === 2 && (
              <><h2 className="h3">Delivery method</h2>
                <label className="opt is-on"><input type="radio" checked readOnly /><span><b>Standard delivery</b><small>{totals.shipping ? inr(totals.shipping) : 'Free'}. Our team confirms the delivery date after you order.</small></span></label></>
            )}
            {step === 3 && (
              <><h2 className="h3">Payment</h2>
                <div className="opts" role="radiogroup" aria-label="Payment method">
                  {methods.map(([k, m]) => (
                    <label key={k} className={`opt ${pay === k ? 'is-on' : ''} ${!m.enabled ? 'is-off' : ''}`}>
                      <input type="radio" name="pay" disabled={!m.enabled} checked={pay === k} onChange={() => setPay(k)} />
                      <span><b>{m.label}</b><small>{m.enabled ? (k === 'cod' ? 'Pay when your order is delivered.' : 'Available') : 'Not available yet'}</small></span>
                    </label>
                  ))}
                </div>
                {!firstOn && <p className="error">No payment method is switched on yet. Please contact us to place your order.</p>}
                <p className="small muted">We never ask for card or bank details on this site in demo mode. Orders are saved in this browser only.</p></>
            )}
            <div className="panel__foot">
              {step > 0 && <button className="btn btn--ghost" onClick={() => setStep(step - 1)}>BACK</button>}
              {step < 3 ? <button className="btn btn--gold" onClick={next}>CONTINUE</button> : <button className="btn btn--gold" disabled={!pay || busy} onClick={submit}>{busy ? 'PLACING…' : 'PLACE ORDER'}</button>}
            </div>
          </div>
          <Summary totals={totals} />
        </div>
      </div>
    </>
  );
}
