// Rebuilds data/coa_reports.{json,csv} from the live lab-report page (https://vortexresearch.net/coa/).
// Usage: node scripts/build.js            (needs Node 18+, no dependencies)
// Only compounds in INCLUDE are published here; everything else stays on the site's /coa/ page.
const fs = require('fs');
const path = require('path');

const INCLUDE = ['MOTS-C', 'GHK-Cu', 'BPC-157 + TB-500', '5-Amino-1MQ', 'KPV', 'NAD+', 'Selank', 'Semax'];
const LABS = {
  ils: { name: 'ILS Laboratories', location: 'San Diego, CA, USA' },
  freedom: { name: 'Freedom Diagnostics', location: null },
};
const ROOT = path.join(__dirname, '..');

const dec = (s) => s.replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const isoDate = (us) => { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(us || ''); return m ? `${m[3]}-${m[1]}-${m[2]}` : null; };
const num = (s) => { const m = /([\d.]+)/.exec(s || ''); return m ? Number(m[1]) : null; };
const assay = (a) => dec(a).replace(/^Fentanyl screen$/i, 'Contaminant screen');

async function main() {
  const res = await fetch('https://vortexresearch.net/coa/?v=' + Date.now(), {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36' },
  });
  const html = await res.text();
  if (/Checking your browser/i.test(html)) throw new Error('Host bot challenge; retry later or from a browser session.');

  const rows = [];
  for (const part of html.split(/<article[^>]*class="[^"]*vx-card/).slice(1)) {
    const tag = part.slice(0, part.indexOf('>'));
    const title = ((part.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/) || [])[1] || '').replace(/<[^>]+>/g, '').trim();
    const vAttr = (tag.match(/data-variants="([^"]*)"/) || [])[1];
    if (!INCLUDE.includes(title) || !vAttr) continue;
    for (const v of JSON.parse(dec(vAttr))) {
      const lab = LABS[v.lab] || { name: v.lab, location: null };
      rows.push({
        compound: title === 'MOTS-C' ? 'MOTS-c' : title,
        size_label: v.label.replace(/\s*·.*$/, ''),
        lot: v.lot,
        report_type: v.vortex ? 'Tested for Vortex Research' : 'Partner-facility report (supplier lot)',
        lab: lab.name,
        lab_location: lab.location,
        test_date: isoDate(v.date),
        purity_hplc_pct: num(v.purity),
        net_content_mg: num(v.net),
        net_content_split: v.net_split ? dec(v.net_split) : null,
        coa_number: v.id,
        access_code: v.code || null,
        verify_url: v.verify || null,
        report_pdf: v.pdf || null,
        report_image: v.src || null,
        assays: (v.assays || []).map(assay),
        product_page: v.shop || null,
      });
    }
  }
  rows.sort((a, b) => a.compound.localeCompare(b.compound) || (a.test_date || '').localeCompare(b.test_date || ''));

  const meta = {
    name: 'Vortex Research lot report dataset',
    source: 'https://vortexresearch.net/coa/',
    generated: new Date().toISOString().slice(0, 10),
    license: 'CC BY 4.0',
    notice: 'Research-use-only materials. Not for human or veterinary use. Figures are copied from third-party laboratory reports; the linked report is the authoritative record.',
    count: rows.length,
  };
  fs.writeFileSync(path.join(ROOT, 'data', 'coa_reports.json'), JSON.stringify({ meta, reports: rows }, null, 2) + '\n');

  const cols = ['compound', 'size_label', 'lot', 'report_type', 'lab', 'lab_location', 'test_date', 'purity_hplc_pct', 'net_content_mg', 'net_content_split', 'coa_number', 'access_code', 'verify_url', 'report_pdf', 'assays', 'product_page'];
  const cell = (x) => { const s = Array.isArray(x) ? x.join('; ') : x == null ? '' : String(x); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  fs.writeFileSync(path.join(ROOT, 'data', 'coa_reports.csv'), [cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\n') + '\n');
  console.log(`Wrote ${rows.length} reports (${new Set(rows.map((r) => r.compound)).size} compounds).`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
