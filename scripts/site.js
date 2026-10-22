// Builds docs/index.html (the GitHub Pages view of the dataset) from data/coa_reports.json.
// Usage: node scripts/site.js   (Node 18+, no dependencies)
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data', 'coa_reports.json'), 'utf8'));
const rows = data.reports;
const meta = data.meta;
const repo = 'https://github.com/vrtx-research/coa-dataset';
const pages = 'https://vrtx-research.github.io/coa-dataset/';

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const short = t => t.startsWith('Tested for') ? 'Vortex' : 'Partner facility';

const purities = rows.map(r => r.purity_hplc_pct).sort((a, b) => a - b);
const labs = [...new Set(rows.map(r => r.lab))];

const tr = rows.map(r => `<tr>
<td><a href="${esc(r.product_page)}">${esc(r.compound)}</a></td>
<td>${esc(r.size_label)}</td>
<td><code>${esc(r.lot)}</code></td>
<td>${esc(short(r.report_type))}</td>
<td>${esc(r.lab)}</td>
<td>${esc(r.test_date)}</td>
<td class="n">${r.purity_hplc_pct.toFixed(2)}%</td>
<td class="n">${esc(r.net_content_mg)} mg</td>
<td>${r.assays.length}</td>
<td><a href="${esc(r.verify_url)}" rel="nofollow">verify</a></td>
</tr>`).join('\n');

const ld = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: meta.name,
  description: 'Machine-readable copies of third-party laboratory reports for Vortex Research peptide lots: lab, test date, HPLC purity, measured net content, assays run, and a link to verify each report on the issuing lab\'s portal.',
  url: pages,
  sameAs: repo,
  license: 'https://creativecommons.org/licenses/by/4.0/',
  isAccessibleForFree: true,
  creator: { '@type': 'Organization', name: 'Vortex Research', url: 'https://vortexresearch.net/' },
  dateModified: meta.generated,
  keywords: ['certificate of analysis', 'HPLC purity', 'peptide', 'net content', 'lot report', 'analytical testing'],
  variableMeasured: ['purity_hplc_pct', 'net_content_mg', 'assays', 'test_date'],
  distribution: [
    { '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: 'https://raw.githubusercontent.com/vrtx-research/coa-dataset/main/data/coa_reports.csv' },
    { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: 'https://raw.githubusercontent.com/vrtx-research/coa-dataset/main/data/coa_reports.json' }
  ]
};

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Peptide lot report dataset | Vortex Research</title>
<meta name="description" content="Open CC BY 4.0 dataset of ${rows.length} third-party peptide lot reports: HPLC purity, net content, assays and lab verify links.">
<link rel="canonical" href="${pages}">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>
:root{--purple:#7C5CFA;--ink:#14121C;--body:#5A5670;--muted:#8D89A3;--line:#E4DEF9;--wash:#F3F0FE}
*{box-sizing:border-box}body{margin:0;background:#fff;color:var(--ink);font:16px/1.6 Manrope,system-ui,-apple-system,Segoe UI,Arial,sans-serif}
main{max-width:1080px;margin:0 auto;padding:40px 16px 64px}
h1{font-size:32px;line-height:1.15;letter-spacing:-.02em;margin:0 0 12px}h2{font-size:21px;margin:40px 0 10px}
p,li{color:var(--body)}a{color:var(--purple)}code{font-family:"JetBrains Mono",Consolas,monospace;font-size:13px}
.eyebrow{text-transform:uppercase;letter-spacing:.3em;font-size:12px;color:var(--muted);margin:0 0 10px}
.stats{display:flex;flex-wrap:wrap;gap:12px;margin:24px 0}.stat{background:var(--wash);border:1px solid var(--line);border-radius:12px;padding:12px 16px}
.stat b{display:block;font-size:22px;color:var(--ink)}.stat span{font-size:13px;color:var(--muted)}
.wrap{overflow-x:auto;border:1px solid var(--line);border-radius:12px}
table{border-collapse:collapse;width:100%;font-size:14px;min-width:820px}th,td{padding:9px 12px;border-bottom:1px solid var(--line);text-align:left;white-space:nowrap}
th{background:var(--wash);font:600 14px/1.6 inherit}td.n{font-variant-numeric:tabular-nums}tr:last-child td{border-bottom:0}
.note{font-size:13px;color:var(--muted);border-top:1px solid var(--line);margin-top:40px;padding-top:16px}
</style>
</head>
<body>
<main>
<p class="eyebrow">Open data · CC BY 4.0</p>
<h1>Peptide lot report dataset</h1>
<p>Machine-readable copies of the third-party laboratory reports that <a href="https://vortexresearch.net/">Vortex Research</a> publishes for its research peptide lots. Each row is one report: the lab, the test date, HPLC purity, measured net content, the assays run, and a link to check the report on the lab's own portal. The report images and PDFs are on the <a href="https://vortexresearch.net/coa/">Vortex Research lab report page</a>.</p>

<div class="stats">
<div class="stat"><b>${rows.length}</b><span>reports</span></div>
<div class="stat"><b>${purities[0].toFixed(2)}–${purities[purities.length - 1].toFixed(2)}%</b><span>HPLC purity range</span></div>
<div class="stat"><b>${labs.length}</b><span>issuing labs</span></div>
<div class="stat"><b>${esc(meta.generated)}</b><span>last updated</span></div>
</div>

<h2>Reports</h2>
<div class="wrap"><table>
<thead><tr><th>Compound</th><th>Size</th><th>Lot</th><th>Report</th><th>Lab</th><th>Tested</th><th>HPLC purity</th><th>Net content</th><th>Assays</th><th>Check</th></tr></thead>
<tbody>
${tr}
</tbody></table></div>

<h2>Download</h2>
<ul>
<li><a href="https://raw.githubusercontent.com/vrtx-research/coa-dataset/main/data/coa_reports.csv">coa_reports.csv</a>: one row per report, assays separated by <code>; </code></li>
<li><a href="https://raw.githubusercontent.com/vrtx-research/coa-dataset/main/data/coa_reports.json">coa_reports.json</a>: the same data with a <code>meta</code> block</li>
<li>Companion identity data (sequence, formula, mass): <a href="https://vrtx-research.github.io/peptide-identity-reference/">peptide identity reference</a></li>
<li>Articles built on this data: <a href="https://vortexresearchjournal.wordpress.com/">Vortex Research Journal</a></li>
<li>Source, field definitions and build scripts: <a href="${repo}">github.com/vrtx-research/coa-dataset</a></li>
</ul>

<h2>Report types</h2>
<p><b>Vortex</b> reports were commissioned by Vortex Research for its own lot. <b>Partner facility</b> reports were issued for the supplying facility's lot and are republished with that label. They describe the lot Vortex stocks but name the facility, not Vortex.</p>

<h2>Reading the numbers</h2>
<p>HPLC purity is the main-peak area percent. It is a purity figure, not an identity or content figure. Net content is the measured peptide mass per vial. The two are independent, which is why a report lists both. Background reading: <a href="https://vortexresearch.net/blog/how-to-read-a-peptide-coa/">how to read a peptide COA</a> and <a href="https://vortexresearch.net/blog/hplc-peptide-purity/">HPLC peptide purity</a>.</p>

<h2>Verify a row</h2>
<p>Open the row's verify link and enter the COA number and access code from the CSV if asked. Compare the lot, date, purity and net content. If anything differs, the lab portal is the record. Please <a href="${repo}/issues">open an issue</a> so the row can be corrected.</p>

<h2>Cite</h2>
<p><code>Vortex Research (${meta.generated.slice(0, 4)}). Peptide lot report dataset [Data set]. ${pages}</code></p>

<p class="note">Research use only. Vortex Research materials are sold for in-vitro laboratory research by qualified researchers. Not for human or veterinary use. Not a drug, dietary supplement or cosmetic. Statements have not been evaluated by the FDA. This repository lists a subset of the compounds on the lab report page, which is the complete set; each report applies only to the lot it names.</p>
</main>
</body>
</html>
`;

fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs', 'index.html'), html);
fs.writeFileSync(path.join(root, 'docs', '.nojekyll'), '');
console.log('docs/index.html written,', rows.length, 'rows');
