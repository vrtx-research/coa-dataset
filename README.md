# Vortex Research lot report dataset

Machine-readable copies of the third-party laboratory reports that [Vortex Research](https://vortexresearch.net/) publishes for its research peptide lots. Each row is one report: the lab, the test date, HPLC purity, measured net content, the assays run, and a link to verify the report on the lab's own portal.

Browse it as a web page at [vrtx-research.github.io/coa-dataset](https://vrtx-research.github.io/coa-dataset/). The human-readable version, with report images and PDFs, is the [lab report page](https://vortexresearch.net/coa/). Background on reading these documents is in the [research library](https://vortexresearch.net/blog/), for example [How to read a peptide COA](https://vortexresearch.net/blog/how-to-read-a-peptide-coa/) and [HPLC peptide purity](https://vortexresearch.net/blog/hplc-peptide-purity/).

> **Research use only.** Vortex Research materials are sold for in-vitro laboratory research by qualified researchers. Not for human or veterinary use. Not a drug, dietary supplement or cosmetic. Statements have not been evaluated by the FDA.

Identity data (sequence, formula, mass, CID, CAS) for the same compounds is in the companion [peptide identity reference](https://github.com/vrtx-research/peptide-identity-reference). Articles built on this dataset are in the [Vortex Research Journal](https://vortexresearchjournal.wordpress.com/).

## Files

| File | What it holds |
|---|---|
| [`data/coa_reports.csv`](data/coa_reports.csv) | One row per report, spreadsheet-friendly. Assays are `; `-separated. |
| [`data/coa_reports.json`](data/coa_reports.json) | The same data with a `meta` block and assays as arrays. |
| [`scripts/build.js`](scripts/build.js) | Rebuilds both files from the live lab report page (Node 18+, no dependencies). |
| [`scripts/site.js`](scripts/site.js) | Rebuilds the GitHub Pages view in `docs/` from the JSON. |
| [`scripts/readme.js`](scripts/readme.js) | Rebuilds the table below from the JSON. |

## Current reports (2026-10-22)

| Compound | Size | Lot | Report | Lab | Tested | HPLC purity | Net content | Check |
|---|---|---|---|---|---|---|---|---|
| 5-Amino-1MQ | 50 mg | `PS07-5AM50` | Partner facility | ILS Laboratories | 2026-08-12 | 99.97% | 51.54 mg | [verify](https://portal.ils-lab.com/verify/Tv30aO9A8ipgyz8D) |
| BPC-157 + TB-500 | 10 / 10 mg | `PS07-BCTB20` | Partner facility | ILS Laboratories | 2026-08-14 | 99.94% | 21.12 mg | [verify](https://portal.ils-lab.com/verify/vSD_MTGAbRcWu6mJ) |
| GHK-Cu | 50 mg | `VR01-GHK` | Vortex | Freedom Diagnostics | 2026-06-20 | 99.85% | 54.92 mg | [verify](https://coas.freedomdiagnosticstesting.com/Vort2606170451.pdf) |
| GHK-Cu | 100 mg | `PS07-GHK100` | Partner facility | ILS Laboratories | 2026-08-12 | 99.34% | 106.36 mg | [verify](https://portal.ils-lab.com/verify/PWpr3NuyAbQLJDXP) |
| KPV | 10 mg | `PS07-KPV10` | Partner facility | ILS Laboratories | 2026-08-12 | 99.44% | 10.66 mg | [verify](https://portal.ils-lab.com/verify/AyA80_P8m6LotjDh) |
| MOTS-c | 10 mg | `Purple cap` | Vortex | ILS Laboratories | 2026-06-24 | 99.94% | 10.5 mg | [verify](https://portal.ils-lab.com/verify/jSzY7oXAeGe5gHyw) |
| NAD+ | 500 mg | `PS07-NAD500` | Partner facility | ILS Laboratories | 2026-08-12 | 99.45% | 511.02 mg | [verify](https://portal.ils-lab.com/verify/e44MM8rdtjEOVAFz) |
| Selank | 10 mg | `PS07-SK10` | Partner facility | ILS Laboratories | 2026-08-12 | 99.38% | 10.3 mg | [verify](https://portal.ils-lab.com/verify/dSQk96S7_CUdJfZU) |
| Semax | 10 mg | `PS07-SX10` | Partner facility | ILS Laboratories | 2026-08-11 | 99.18% | 10.57 mg | [verify](https://portal.ils-lab.com/verify/GdTQE5Urrfm7SfQ8) |

**Report types.** *Vortex* reports were commissioned by Vortex Research for its own lot. *Partner facility* reports were issued for the supplying facility's lot and are republished with that label. They describe the lot Vortex stocks but name the facility, not Vortex.

## Fields

| Field | Meaning |
|---|---|
| `compound`, `size_label` | Material and labelled fill as listed on the product page. |
| `lot` | Lot or batch identifier printed on the report. |
| `report_type` | `Tested for Vortex Research` or `Partner-facility report (supplier lot)`. |
| `lab`, `lab_location` | Issuing laboratory. Location is given only where the report states it. |
| `test_date` | Date on the report (ISO 8601). |
| `purity_hplc_pct` | Main-peak area percent by HPLC. It is a purity figure, not an identity or content figure. |
| `net_content_mg`, `net_content_split` | Measured peptide content per vial; blends list each component. |
| `coa_number`, `access_code`, `verify_url` | Use these on the lab portal to confirm the report is genuine. |
| `report_pdf` | Copy of the report hosted by Vortex Research, where one exists. |
| `assays` | Tests listed on the report. |
| `product_page` | The matching product page. |

## How to verify a row

1. Open `verify_url` and enter the `coa_number` and `access_code` if asked.
2. Check the lot, date, purity and net content against this dataset.
3. If anything differs, the lab portal is the record. Please open an issue so the row can be corrected.

## Scope

This repository lists a subset of the compounds on the [lab report page](https://vortexresearch.net/coa/), which is the complete set. Some lots have no published report, and each report applies only to the lot it names.

## License

Data: [CC BY 4.0](LICENSE). Credit "Vortex Research lot report dataset" with a link to https://vortexresearch.net/coa/.
