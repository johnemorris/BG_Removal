# Package 1A — behavioral testing foundation

Completed independently before the framework migration on October 28, 2026.
Starting checkout: clean `cc3964b8dcdb7151096148f9d9b2d4752fb2952d`;
no subsequent commits or user edits existed. No commits were made.

## Changes

- `package.json` / lockfile: pinned Vitest 5.0.5 and Playwright 1.64.1;
  `npm test` runs assertions, with separate watch, typecheck and smoke scripts.
- `vitest.config.mts`, `tests/setup.ts`, helpers and deterministic PNG/RGBA
  fixtures: Node tests, explicit browser boundary doubles, blocked default fetch.
- `tests/{geometry,zip,processing,api}.test.ts`: production imports tested directly,
  with no engine extraction or application behavior change.
- `playwright.config.ts`, `tests/browser/routes.spec.ts`, `.gitignore`: an owned
  production server on loopback port 3100; external browser requests blocked;
  inference stubbed using the local cutout fixture.
- Node 24.22.1 was installed for the maintained test tools; Node types aligned
  to 24. Runtime pinning and the framework upgrade belong to 1B.

## Passing evidence

- `npm test`: 16 passing assertions across four files (12 pending cases in the
  final 1A suite). Geometry alpha threshold/origin and source dimensions;
  correct-bound smart-padding centering, fill/clamping/aspect preservation;
  existing preset dimensions; distinct-name ZIP byte/CRC integrity and invalid
  base64 errors; image decoding/context failures and successful processing
  request/dimensions; API missing credentials, content type, missing image and
  failed worker/cleanup boundaries.
- `npm run typecheck`: exit 0.
- `npm run lint` under Next 14.2.35: exit 0, eleven existing image warnings.
- `npm run build` under Next 14.2.35: exit 0 with font-network access. An offline
  attempt exposed the existing Google Fonts dependency; addressed in 1B.
- `PLAYWRIGHT_CHANNEL=chrome npm run test:smoke`: six passing checks: all five
  primary routes, hydration/mobile navigation and the desktop Studio local upload
  → mocked cutout → export dialog → free PNG download journey. No Python, model
  download, payment credentials, real processing service or external image fetch.

## Pending coverage is not passing coverage

Run `RUN_PENDING_REGRESSIONS=1 npm test` to execute desired behavior against the
current bugs. This diagnostic command deliberately exits nonzero until those
phases land. Normal `npm test` explicitly reports these cases as skipped.
No test expects a bug to be correct.

| Issue | Pending desired behavior | Owning phase |
| --- | --- | --- |
| R01 | Invalid key and internal-header bypass both rejected (2 cases) | 2 |
| R04 | Failed inference rejects without reporting completion | 3 |
| R05 | Loopback URL rejected before fetching (fetch mock only) | 3 |
| R06 | Invalid image bytes and negative feather rejected before inference (2) | 3 |
| R21 | Unsupported encoding rejected | 3 |
| R17 | Opaque 100×100, single pixel, empty mask, downsampled dimensions (4) | 4 |
| R13 | Both same-stem files survive ZIP export | 5 |

The empty-mask test proposes `null`; Phase 4 must finalize an explicit empty-result
type. The unsafe URL case assumes HTTP 400; Phase 3 may deliberately disable all
remote imports and revise the documented error contract. Other known defects
(credit accounting, preview parity, batch races, checkout, mobile canvas layout)
remain in the review registry; these smoke checks do not certify them.

Unit canvas doubles test logic, not decoded alpha accuracy or real canvas scaling.
Browser smoke asserts a valid PNG download, not pixel parity or segmentation quality.
Broader fixture/quality testing remains assigned to the relevant later phases.
