// Regenerates README.md's report table from data/coa_reports.json. Run after scripts/build.js.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'coa_reports.json'), 'utf8'));

const rows = d.reports.map((x) => [
  x.compound,
  x.size_label,
  '`' + x.lot + '`',
  x.report_type === 'Tested for Vortex Research' ? 'Vortex' : 'Partner facility',
  x.lab,
  x.test_date,
  x.purity_hplc_pct.toFixed(2) + '%',
  x.net_content_mg + ' mg',
  '[verify](' + x.verify_url + ')',
].join(' | ')).map((r) => '| ' + r + ' |').join('\n');

const md = `# Vortex Research lot report dataset

Machine-readable copies of the third-party laboratory reports that [Vortex Research](https://vortexresearch.net/) publishes for its research peptide lots. Each row is one report: the lab, the test date, HPLC purity, measured net content, the assays run, and a link to verify the report on the lab's own portal.

The human-readable version, with report images and PDFs, is the [lab report page](https://vortexresearch.net/coa/). Background on reading these documents is in the [research library](https://vortexresearch.net/blog/), for example [How to read a peptide COA](https://vortexresearch.net/blog/how-to-read-a-peptide-coa/) and [HPLC peptide purity](https://vortexresearch.net/blog/hplc-peptide-purity/).

> **Research use only.** Vortex Research materials are sold for in-vitro laboratory research by qualified researchers. Not for human or veterinary use. Not a drug, dietary supplement or cosmetic. Statements have not been evaluated by the FDA.

## Files

| File | What it holds |
|---|---|
| [\`data/coa_reports.csv\`](data/coa_reports.csv) | One row per report, spreadsheet-friendly. Assays are \`; \`-separated. |
| [\`data/coa_reports.json\`](data/coa_reports.json) | The same data with a \`meta\` block and assays as arrays. |
| [\`scripts/build.js\`](scripts/build.js) | Rebuilds both files from the live lab report page (Node 18+, no dependencies). |
| [\`scripts/readme.js\`](scripts/readme.js) | Rebuilds the table below from the JSON. |

## Current reports (${d.meta.generated})

| Compound | Size | Lot | Report | Lab | Tested | HPLC purity | Net content | Check |
|---|---|---|---|---|---|---|---|---|
${rows}

**Report types.** *Vortex* reports were commissioned by Vortex Research for its own lot. *Partner facility* reports were issued for the supplying facility's lot and are republished with that label. They describe the lot Vortex stocks but name the facility, not Vortex.

## Fields

| Field | Meaning |
|---|---|
| \`compound\`, \`size_label\` | Material and labelled fill as listed on the product page. |
| \`lot\` | Lot or batch identifier printed on the report. |
| \`report_type\` | \`Tested for Vortex Research\` or \`Partner-facility report (supplier lot)\`. |
| \`lab\`, \`lab_location\` | Issuing laboratory. Location is given only where the report states it. |
| \`test_date\` | Date on the report (ISO 8601). |
| \`purity_hplc_pct\` | Main-peak area percent by HPLC. It is a purity figure, not an identity or content figure. |
| \`net_content_mg\`, \`net_content_split\` | Measured peptide content per vial; blends list each component. |
| \`coa_number\`, \`access_code\`, \`verify_url\` | Use these on the lab portal to confirm the report is genuine. |
| \`report_pdf\` | Copy of the report hosted by Vortex Research, where one exists. |
| \`assays\` | Tests listed on the report. |
| \`product_page\` | The matching product page. |

## How to verify a row

1. Open \`verify_url\` and enter the \`coa_number\` and \`access_code\` if asked.
2. Check the lot, date, purity and net content against this dataset.
3. If anything differs, the lab portal is the record. Please open an issue so the row can be corrected.

## Scope

This repository lists a subset of the compounds on the [lab report page](https://vortexresearch.net/coa/), which is the complete set. Some lots have no published report, and each report applies only to the lot it names.

## License

Data: [CC BY 4.0](LICENSE). Credit "Vortex Research lot report dataset" with a link to https://vortexresearch.net/coa/.
`;
fs.writeFileSync(path.join(ROOT, 'README.md'), md);
console.log('README.md written,', d.reports.length, 'rows');
