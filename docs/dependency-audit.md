# Phase 1 dependency and advisory disposition

Verified October 28, 2026 against the original `cc3964b` lockfile and the final
Phase 1 lockfile. These findings identify affected packages; they do not prove
that every advisory was exploitable in this prototype.

## Final result

- `npm audit --json`: exit 0, **0 findings**, including development dependencies.
- `npm audit --omit=dev --json`: exit 0, **0 production findings**.
- Original lockfile: 9 affected package entries (1 critical, 7 high, 1 moderate).
  Entries include propagated findings, not 9 distinct root advisories.
- No `npm audit fix --force`, forced peer resolution, or package overrides were used.
- New framework: exact Next 16.4.3 / React and React DOM 19.3.1.
  Confirmed `sharp@0.35.5`, nested PostCSS 8.5.23, root PostCSS 8.5.32,
  source-map-js 1.2.2, selector-parser 6.1.5, lint-only Zod 4.6.7.
- `@imgly/background-removal` and `onnxruntime-web` had no source/script/config
  imports or dynamic uses: repository scan outside manifests/lockfiles/docs and
  generated output found no matches. Actual processing imports `bgRemoval.ts`,
  which calls the Node API/Python subprocess. Removing those unused JS packages
  does not change Python inference. The obsolete `@types/jszip` stub was also
  removed; JSZip includes its own declarations.

## Official runtime and advisory checks

- [Next support policy](https://nextjs.org/support-policy): 16.x Active LTS,
  14.x unsupported.
- [Next 16.4.3 release](https://github.com/vercel/next.js/releases/tag/v16.4.3):
  current stable patch, also confirmed against the npm dist-tag.
- [Next 16 migration guide](https://nextjs.org/docs/app/guides/upgrading/version-16):
  explicit Webpack option, standalone ESLint CLI, Node/TypeScript requirements.
- [Node release policy](https://nodejs.org/en/about/previous-releases): Node 24
  LTS; pin 24.22.1, replacing the shell's EOL Node 25.
- [Maintainer advisory index](https://github.com/vercel/next.js/security/advisories)
  additionally checked for recent issues beyond the old lockfile's audit range:
  [typed-array cache RCE](https://github.com/vercel/next.js/security/advisories/GHSA-673q-mjm6-r5xr)
  is fixed in 16.4.1; no `use cache` functions exist here.
  [Image optimizer SSRF](https://github.com/vercel/next.js/security/advisories/GHSA-cjq9-62q9-8jv4)
  is outside the patched installed range. The application route's independent
  R05 SSRF remains unresolved and is **not** fixed by a framework upgrade.

## Individual baseline advisories

Each row was reviewed for the affected chain, application surface and resolution.
Next-related rows are resolved by 16.4.3 and confirmed absent from the final audit;
feature absence is contextual evidence, not a substitute for patching.

| Package / advisory | Severity | Finding | Exposure review and disposition |
| --- | --- | --- | --- |
| glob / [GHSA-5j98-mcp5-4vw2](https://github.com/advisories/GHSA-5j98-mcp5-4vw2) | high | glob CLI: Command injection via -c/--cmd executes matches with shell:true | Dev-only Next lint chain; project does not invoke glob CLI --cmd. Old chain removed. |
| next / [GHSA-9g9p-9gw9-jx7f](https://github.com/advisories/GHSA-9g9p-9gw9-jx7f) | moderate | Next.js self-hosted applications vulnerable to DoS via Image Optimizer remotePatterns configuration | Runtime: remotePatterns exists; retain patched framework even though current previews use raw img. |
| next / [GHSA-h25m-26qc-wcjf](https://github.com/advisories/GHSA-h25m-26qc-wcjf) | high | Next.js HTTP request deserialization can lead to DoS when using insecure React Server Components | Runtime: App Router/RSC boundary; patched framework required. |
| next / [GHSA-ggv3-7p47-pfv8](https://github.com/advisories/GHSA-ggv3-7p47-pfv8) | moderate | Next.js: HTTP request smuggling in rewrites | No application rewrites configured; patched framework removes affected range. |
| next / [GHSA-3x4c-7xq6-9pq8](https://github.com/advisories/GHSA-3x4c-7xq6-9pq8) | moderate | Next.js: Unbounded next/image disk cache growth can exhaust storage | Optimizer cache resource risk; patched framework required. |
| next / [GHSA-q4gf-8mx6-v5v3](https://github.com/advisories/GHSA-q4gf-8mx6-v5v3) | high | Next.js has a Denial of Service with Server Components | Runtime: App Router/RSC availability risk; patched framework required. |
| next / [GHSA-8h8q-6873-q5fj](https://github.com/advisories/GHSA-8h8q-6873-q5fj) | high | Next.js Vulnerable to Denial of Service with Server Components | Runtime: App Router/RSC availability risk; patched framework required. |
| next / [GHSA-3g8h-86w9-wvmq](https://github.com/advisories/GHSA-3g8h-86w9-wvmq) | low | Next.js's Middleware / Proxy redirects can be cache-poisoned | No middleware/proxy configured; patched framework removes affected range. |
| next / [GHSA-ffhc-5mcf-pf4q](https://github.com/advisories/GHSA-ffhc-5mcf-pf4q) | moderate | Next.js vulnerable to cross-site scripting in App Router applications using CSP nonces | No CSP nonce implementation found; patched framework removes affected range. |
| next / [GHSA-vfv6-92ff-j949](https://github.com/advisories/GHSA-vfv6-92ff-j949) | low | Next.js vulnerable to cache poisoning via collisions in React Server Component cache-busting | App Router cache transport; patched framework required. |
| next / [GHSA-gx5p-jg67-6x7h](https://github.com/advisories/GHSA-gx5p-jg67-6x7h) | moderate | Next.js has cross-site scripting in beforeInteractive scripts with untrusted input | No beforeInteractive scripts found; patched framework removes affected range. |
| next / [GHSA-h64f-5h5j-jqjh](https://github.com/advisories/GHSA-h64f-5h5j-jqjh) | moderate | Next.js has a Denial of Service in the Image Optimization API | Optimizer resource risk; patched framework required. |
| next / [GHSA-c4j6-fc7j-m34r](https://github.com/advisories/GHSA-c4j6-fc7j-m34r) | high | Next.js vulnerable to server-side request forgery in applications using WebSocket upgrades | No custom WebSocket upgrade server found; patched framework removes affected range. |
| next / [GHSA-wfc6-r584-vfw7](https://github.com/advisories/GHSA-wfc6-r584-vfw7) | moderate | Next.js vulnerable to cache poisoning in React Server Component responses | App Router cache transport; patched framework required. |
| next / [GHSA-36qx-fr4f-26g5](https://github.com/advisories/GHSA-36qx-fr4f-26g5) | high | Next.js has a Middleware / Proxy bypass in Pages Router applications using i18n | App Router only, no Pages/i18n middleware; patched framework removes affected range. |
| next / [GHSA-m99w-x7hq-7vfj](https://github.com/advisories/GHSA-m99w-x7hq-7vfj) | high | Next.js: Denial of Service in App Router using Server Actions | No Server Actions found; patched framework removes affected range. |
| next / [GHSA-89xv-2m56-2m9x](https://github.com/advisories/GHSA-89xv-2m56-2m9x) | high | Next.js: Server-Side Request Forgery in Server Actions on custom servers | No custom server/Server Actions found; patched framework removes affected range. |
| next / [GHSA-68g3-v927-f742](https://github.com/advisories/GHSA-68g3-v927-f742) | moderate | Next.js: Cache confusion of response bodies for requests with bodies | Framework request/cache handling; patched framework required. |
| next / [GHSA-4633-3j49-mh5q](https://github.com/advisories/GHSA-4633-3j49-mh5q) | moderate | Next.js: Cache confusion of response bodies for requests with bodies containing invalid UTF-8 byte sequences | Framework request/cache handling; patched framework required. |
| next / [GHSA-4c39-4ccg-62r3](https://github.com/advisories/GHSA-4c39-4ccg-62r3) | moderate | Next.js: Unbounded Server Action payload in Edge runtime | No Edge Server Actions found; patched framework removes affected range. |
| next / [GHSA-p9j2-gv94-2wf4](https://github.com/advisories/GHSA-p9j2-gv94-2wf4) | high | Next.js: Server-Side Request Forgery in rewrites via attacker-controlled destination hostname | No application rewrites configured; patched framework removes affected range. |
| next / [GHSA-955p-x3mx-jcvp](https://github.com/advisories/GHSA-955p-x3mx-jcvp) | moderate | Next.js: Unauthenticated disclosure of internal Server Function endpoints | No Server Actions found; patched framework removes affected range. |
| next / [GHSA-p293-qw3h-jr36](https://github.com/advisories/GHSA-p293-qw3h-jr36) | critical | Next.js: Unauthenticated Remote Code Execution on windows-hosted servers | Windows-specific framework exposure; patch for portable future hosting. |
| next / [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4) | critical | Next.js: Unauthenticated Remote Code Execution in Image Optimization API when AVIF files are used | Image optimizer native-code exposure; patched framework required. |
| next / [GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw) | critical | Next.js: Unauthenticated Remote Code Execution in Image Optimization API when SVG files are used | Image optimizer native-code exposure; verify sharp >=0.35.5 as well. |
| next / [GHSA-p3m5-59mp-jv5r](https://github.com/advisories/GHSA-p3m5-59mp-jv5r) | high | Next.js: Denial of Service in App Router using Server Actions | No Server Actions found; 16.4.3 exceeds fixed 16.4.1. |
| postcss / [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) | moderate | PostCSS has XSS via Unescaped </style> in its CSS Stringify Output | Old Next-nested CSS build pipeline; no uploaded CSS ingestion. New nested postcss 8.5.23. |
| postcss / [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q) | high | PostCSS: Arbitrary file read and information disclosure via attacker-controlled sourceMappingURL in CSS comments | Old Next-nested source-map parsing; no uploaded CSS ingestion. New nested postcss 8.5.23. |
| postcss / [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp) | moderate | PostCSS: incomplete fix of GHSA-6g55-p6wh-862q — attacker-controlled sourceMappingURL reads arbitrary .map files when `from` is unset | Old Next-nested source-map parsing; new nested postcss 8.5.23 exceeds <=8.5.22. |
| postcss / [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849) | high | PostCSS: Path Traversal in Previous Source Map Auto-Loading (sourceMappingURL) leads to Arbitrary .map File Disclosure | Old Next-nested source-map parsing; new nested postcss 8.5.23. |
| postcss-selector-parser / [GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf) | moderate | PostCSS: Quadratic complexity in flat selector parsing allows CPU exhaustion | Dev-only Tailwind/PostCSS chain; no untrusted CSS. Targeted semver update 6.1.4 -> 6.1.5. |
| source-map-js / [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) | high | source-map-js allows event-loop denial of service through indexed source-map section offsets | CSS/source-map build chain; update to 1.2.2 via resolved dependencies. |
| zod / [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) | high | Zod can exhaust memory while validating oversized constrained collections | Unused imgly browser-inference chain removed after source scan. New lint-only Zod resolves 4.6.7. |

`@imgly/background-removal` propagates the Zod finding; `eslint-config-next` and
`@next/eslint-plugin-next` propagate the glob finding. Those parent entries are
removed/upgraded with their respective chains, rather than independently waived.

## Remaining tooling and application limitations

ESLint **9.39.5 is EOL**, per the [official support policy](https://eslint.org/version-support/).
It is the newest release satisfying the current official Next configuration's
React 7.37.5, jsx-a11y 6.10.2 and import 2.32.0 plugin peer ranges. ESLint 10.13.0
was evaluated; npm reported incompatible plugin peers, so it was not retained.
This is a dev-tool support limitation, with no reported audit vulnerability;
move to maintained ESLint when that plugin chain supports it or in a separately
reviewed lint-stack replacement. Do not hide the issue with `--force`.
TypeScript 5.9.3 is pinned for compatibility with Next's >=5.1 requirement and
current compiler options; a TypeScript-major migration is not required here.

Final lint exits 0 with 14 warnings: eleven existing raw-image notices, one
internal-navigation notice, and two newly detected existing localStorage effects.
The effect rule is warning-level only in Header and KeyManager pending Phase 2;
all other files retain Next's default rule severity. Blob/data canvas images in
BatchQueue, CollageCanvas/Sidebar, BrushEditorModal and SplitComparison need raw
image decoding/alpha; BackgroundSelector/ImageUploader also mix remote sample
and local uploads. Their proxy/optimization choices need a separate image-loading
review, not a mechanical replacement. Pricing navigation belongs to later UI work.

Zero package advisories does not resolve the review's application authentication,
remote ingestion, fake accounting/payments, HD ownership or export-correctness
issues. Public paid launch remains blocked by those later phases. Audits are a
point-in-time result; rerun them before a release.
