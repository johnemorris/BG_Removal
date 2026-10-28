# ClearCut AI — Phase 1 completion report

October 28, 2026. Phase 1 only; no Phase 2 implementation was started.

## Scope and baseline

Read `AGENTS.md`, the review report and the development plan in full. Initial Git
status was clean at planning baseline `cc3964b8dcdb7151096148f9d9b2d4752fb2952d`.
No subsequent commits or user changes existed. Existing ignored `.kilo` worktrees
were preserved. No commits, pushes, deployment, external provisioning or payment
activation occurred.

R23 is addressed by real behavioral tests. R08's unsupported framework/runtime
and package advisory findings are addressed. R19/R20 were limited to typed test
boundaries; no broad domain-contract refactor was necessary. The application's
unvalidated boundaries remain assigned to their later phases.

## Package 1A — test foundation

Implemented and verified before 1B; the independent scope/evidence and pending
case registry are in [phase-1a.md](phase-1a.md).

- `package.json`, `package-lock.json`: real `vitest run`, separate watch,
  typecheck and Playwright smoke commands; pinned Vitest 5.0.5 / Playwright 1.64.1.
- `vitest.config.mts`, `tests/setup.ts`, `tests/helpers/browser.ts`: isolated
  boundary mocks and fail-closed default network mock.
- `tests/fixtures/*`, `tests/{geometry,zip,processing,api}.test.ts`: deterministic
  alpha/geometry, transforms, archive CRC/bytes, processing errors and request
  validation tests. No production extraction was required.
- `playwright.config.ts`, `tests/browser/routes.spec.ts`, `.gitignore`: owned
  localhost production server, blocked external browser traffic, deterministic
  processing fixture, five route checks and one full basic Studio journey.

Passing coverage: **16 tests across four files**. Pending coverage: **12 explicitly
skipped executable regressions** for R01 (2), R04 (1), R05 (1), R06 (2), R21 (1),
R17 (4), R13 (1). All twelve were enabled separately against the baseline and
failed as expected; that diagnostic result is not passing coverage. No test
accepts unchanged-original success, incorrect alpha bounds or ZIP collisions.

## Package 1B — framework/runtime migration

- Exact **Next.js 16.4.3**, **React / React DOM 19.3.1**, **Node 24.22.1 LTS**,
  **npm 11.19.1**, **TypeScript 5.9.3**, matching Node/React declarations and
  **eslint-config-next 16.4.3**. Verified official Next support/release/advisory
  information and Node LTS status; source links are in the
  [advisory disposition](dependency-audit.md).
- `package.json`: ES modules; explicit supported Webpack flags retain the prior
  bundler behavior; ESLint CLI replaces removed `next lint`.
- `eslint.config.mjs` replaces `.eslintrc.json`, ignores generated output and
  existing ignored `.kilo` worktrees. Two existing localStorage hydration effect
  diagnostics remain visible as scoped warnings for Phase 2.
- **ESLint 9.39.5 is EOL**, retained because official Next lint plugins currently
  exclude ESLint 10 in their peer ranges. No incompatible peer override remains.
  This development-tool support limitation needs a later lint-stack update;
  it is not an unresolved package audit finding. See the full disposition.
- `next.config.mjs`: remove redundant Webpack alias (TS paths already supply it),
  scope build tracing to this repository, retain remote image configuration.
- `tsconfig.json`: React automatic JSX runtime required by Next; narrow source,
  test/config and generated-type discovery to avoid unrelated nested worktrees.
  Strict mode remains enabled.
- `.nvmrc`, `.node-version`, package engines and `packageManager`: reproducible
  runtime selection; updated lockfile verified with a clean offline `npm ci`.
- `src/app/layout.tsx`, `src/styles/fonts.css`, `public/fonts/*`: serve the exact
  seven baseline Inter WOFF2 subsets (218,888 bytes) locally, preserving weights,
  unicode ranges, swap display, fallback metrics and Latin preload. Included
  upstream OFL license. Builds no longer require Google Fonts network access.
- Removed `@imgly/background-removal` and `onnxruntime-web` only after finding no
  executable references. Existing Node/Python inference remains unchanged.
  Removed the unused JSZip type stub; the library supplies its own declarations.
- `README.md` and the architecture facts in `AGENTS.md`: setup, current runtime,
  test commands and the actual inference path. Added
  [architecture-decisions.md](architecture-decisions.md); it explicitly separates
  recommendations from infrastructure that has been built.
- `docs/dependency-audit.md`, `docs/audits/{baseline,phase-1-full,phase-1-production}.json`:
  individual dispositions for all 33 root advisories reported against the original
  lockfile, including propagated parent entries and recent maintainer advisories.

## Marketplace, engine and interface impact

**No marketplace presets or image-processing/engine features were added or
changed.** The six existing preset dimensions and Amazon no-shadow setting have
regression assertions. No alpha-bound, ZIP-collision, segmentation-fallback,
composition, accounting or entitlement bug was fixed ahead of its planned phase.

**No UI design or interaction changes** to Studio, SplitComparison, ExportModal,
BatchQueue or collage. Only shared font delivery changed; font bytes and styling
were preserved. The desktop Studio export screenshot was inspected, and route
smoke checks verify local font loading plus mobile navigation at 390px. They do
not certify the known obstructed mobile editor/collage flows (Phase 8).

## Final verification

All commands ran under Node 24.22.1 / npm 11.19.1, after a clean lockfile install.

| Check | Result |
| --- | --- |
| `npm ci --offline --no-audit` (populated npm cache) | Exit 0; 447 packages installed |
| `npm test` | Exit 0; 16 passed, 12 explicitly pending/skipped |
| `npm run lint` | Exit 0; 0 errors, 14 documented existing/newly detected warnings |
| `npm run typecheck` | Exit 0 |
| `npm run build` | Exit 0 offline; all five pages, not-found and processing API compiled |
| `PLAYWRIGHT_CHANNEL=chrome npm run test:smoke` | Exit 0; 6 passed after migration, also 6 passed on the Next 14 baseline |
| `npm audit --json` | Exit 0; 0 full-tree vulnerabilities |
| `npm audit --omit=dev --json` | Exit 0; 0 production vulnerabilities |
| `git diff --check` | Exit 0 |

The smoke journey uses the real browser decoder/canvas and a mocked segmentation
response: local upload → processing request → export dialog → downloadable PNG.
All five primary routes also hydrate and operate their mobile menu, with no
uncaught page errors. Screenshot output is generated under ignored `test-results/`
on each run. Unit tests neither access the filesystem for inference nor execute
Python, make external requests, download models or require payment credentials.

Initial migration failures were resolved: offline Google font fetching, package
module-format mismatch, and the removed lint command. Turbopack additionally
failed because this sandbox disallows its PostCSS subprocess port binding;
the configured and verified build uses supported Webpack. Initial lint discovery
of the unrelated nested worktree was corrected. These are not remaining failed
required checks. ESLint's compatibility/EOL limitation and lint warnings remain
explicitly recorded.

## Configuration, limitations and rollback

Use `fnm use` / `nvm use`, then `npm ci`. Browser provisioning is a one-time
network step (`npx playwright install chromium`), or use installed Chrome via
`PLAYWRIGHT_CHANNEL=chrome`. Reserve loopback port 3100 and build before smoke.
No application environment variables or external services are needed for Phase 1
checks. Installing npm/browser dependencies and refreshing audits require network;
installed tests and builds are offline. The Python production inference setup is
still not reproducibly packaged; that is explicitly Phase 3 work.

The pending registry and original review still block public paid launch:
authentication bypass, unsafe/unbounded ingestion, false-success fallback,
client-owned accounting, private HD asset delivery, export correctness, batch
races, checkout and mobile/accessibility work remain. Zero dependency findings
does not certify those application controls. Broader representative image quality
and preview/export pixel parity are not part of these smoke tests.

Rollback, if needed: first save/review the current diff and any new user changes.
Restore only the tracked files listed above from `cc3964b`, including the old
`.eslintrc.json`; remove only the listed Phase 1 additions (`tests/`, `docs/`,
`public/fonts/`, `src/styles/fonts.css`, new test/lint configs and runtime pins).
Remove generated `.next` output, select the former runtime, run `npm ci` against
the restored lockfile and rebuild. Do not use a broad `git reset --hard` or
`git clean`, and do not touch existing ignored worktrees. That rollback restores
an unsupported vulnerable framework and is unsuitable for public deployment.
No database, provider or payment rollback is needed because none was provisioned.

## Phase 2 readiness

The repository has a green behavioral/build/browser baseline and a supported web
framework/runtime. It is ready for Phase 2 planning and implementation of durable
identity and authorization once providers/hosting are selected. Carry the two
localStorage hydration warnings and R01 pending fixtures into that work. The
persistent worker, private assets, accounting and composition contract are
documented directions only. **Stopped after Phase 1.**
