import fs from 'fs';
 
/* ---------------- LOAD DB ---------------- */
 
const DB_PATH = './db.json';
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
 
/* ---------------- CONFIG ---------------- */
 
const CONFIG = {
  slabs: [
    { upTo: 100_000, rate: 0.02 },
    { upTo: 500_000, rate: 0.016 },
    { upTo: 1_000_000, rate: 0.013 },
    { upTo: Infinity, rate: 0.011 }
  ],
  tenureMultipliers: {
    3: 1.0,
    5: 0.92,
    10: 0.85
  },
  roundingNearest: 10,
  minPremium: 1000
};
 
/* ---------------- HELPERS ---------------- */
 
const roundToNearest = (value, nearest = 10) =>
  Math.round(value / nearest) * nearest;
 
function computeBaseAnnualPremium(sumInsured) {
  const si = Number(sumInsured);
  if (!Number.isFinite(si) || si <= 0) return CONFIG.minPremium;
 
  let premium = 0;
  let lastCap = 0;
 
  for (const { upTo, rate } of CONFIG.slabs) {
    const portion = Math.min(si, upTo) - lastCap;
    if (portion <= 0) break;
 
    premium += portion * rate;
    lastCap = upTo;
    if (si <= upTo) break;
  }
 
  return roundToNearest(
    Math.max(premium, CONFIG.minPremium),
    CONFIG.roundingNearest
  );
}
 
function buildPremiumByTenure(sumInsured) {
  const base = computeBaseAnnualPremium(sumInsured);
  const premiums = {};
 
  for (const [tenure, multiplier] of Object.entries(CONFIG.tenureMultipliers)) {
    premiums[tenure] = roundToNearest(
      Math.max(base * multiplier, CONFIG.minPremium),
      CONFIG.roundingNearest
    );
  }
 
  return premiums;
}
 
/* ---------------- EXECUTION ---------------- */
 
if (!Array.isArray(db.policiesCatalog)) {
  throw new Error('db.json must contain policiesCatalog array');
}
 
db.policiesCatalog.forEach(policy => {
  policy.premiumByTenure = buildPremiumByTenure(policy.sumInsured);
});
 
/* ✅ Persist changes */
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
 
console.log('✅ policiesCatalog enriched and saved');