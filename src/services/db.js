/**
 * Storage adapter (DEMO). Everything the UI reads or writes goes through here, as Promises,
 * so swapping localStorage for a real REST/Supabase backend only means re-implementing this file
 * (see README.md). Never put passwords, payment credentials or real customer PII in here.
 */
import { useEffect, useState, useCallback } from 'react';
import { SEED, SINGLES, buildOrders } from '../data/seed';
import { uid } from '../lib/format';

const P = 'hgf:v1:';
const mem = {};

function persist(name, value) {
  mem[name] = value;
  try {
    localStorage.setItem(P + name, JSON.stringify(value));
  } catch (e) {
    const err = new Error('STORAGE_FULL');
    err.cause = e;
    throw err;
  }
}

function read(name) {
  if (mem[name] !== undefined) return mem[name];
  let v = null;
  try {
    const s = localStorage.getItem(P + name);
    v = s ? JSON.parse(s) : null;
  } catch { /* ignore */ }
  if (v == null) {
    v = name === 'orders' ? buildOrders() : structuredClone(SEED[name] ?? SINGLES[name] ?? []);
    try { persist(name, v); } catch { mem[name] = v; }
  }
  mem[name] = v;
  return v;
}

const emit = (name) => window.dispatchEvent(new CustomEvent('hgf:change', { detail: name }));

export function collection(name) {
  const commit = (next) => { persist(name, next); emit(name); };
  return {
    peek: () => read(name),
    list: async () => read(name),
    get: async (id) => read(name).find((x) => x.id === id) || null,
    create: async (item) => {
      const rec = { id: item.id || uid(name.slice(0, 3)), createdAt: new Date().toISOString(), ...item };
      commit([rec, ...read(name)]);
      return rec;
    },
    update: async (id, patch) => {
      let out = null;
      commit(read(name).map((x) => (x.id === id ? (out = { ...x, ...patch, updatedAt: new Date().toISOString() }) : x)));
      return out;
    },
    remove: async (id) => { commit(read(name).filter((x) => x.id !== id)); return true; },
    replace: async (arr) => { commit(arr); return arr; },
  };
}

export function single(name) {
  return {
    peek: () => read(name),
    get: async () => read(name),
    set: async (patch) => { const next = { ...read(name), ...patch }; persist(name, next); emit(name); return next; },
    replace: async (v) => { persist(name, v); emit(name); return v; },
  };
}

const repos = {};
export const repo = (name) => (repos[name] ||= (Array.isArray(SEED[name]) || name === 'orders' ? collection(name) : single(name)));
export const resetDemoData = () => {
  Object.keys(localStorage).filter((k) => k.startsWith(P)).forEach((k) => localStorage.removeItem(k));
  Object.keys(mem).forEach((k) => delete mem[k]);
  window.location.reload();
};

/** React binding: returns the current records and stays in sync with writes (also across tabs). */
export function useRepo(name) {
  const r = repo(name);
  const [data, setData] = useState(() => r.peek());
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let live = true;
    const pull = () => (r.list ? r.list() : r.get()).then((d) => live && setData(d));
    pull().then(() => live && setLoading(false));
    const on = (e) => { if (e.detail === name) setData(r.peek()); };
    const onStorage = (e) => {
      if (e.key === P + name) { delete mem[name]; setData(r.peek()); }
    };
    window.addEventListener('hgf:change', on);
    window.addEventListener('storage', onStorage);
    return () => { live = false; window.removeEventListener('hgf:change', on); window.removeEventListener('storage', onStorage); };
  }, [name, r]);
  return [data, loading];
}

/** Small persisted state for non-sensitive UI state (cart lines, wishlist ids). */
export function usePersisted(key, initial) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(P + key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  const set = useCallback((next) => {
    setV((cur) => {
      const val = typeof next === 'function' ? next(cur) : next;
      try { localStorage.setItem(P + key, JSON.stringify(val)); } catch { /* ignore */ }
      return val;
    });
  }, [key]);
  return [v, set];
}
