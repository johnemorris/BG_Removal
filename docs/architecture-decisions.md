# Architecture directions recorded in Phase 1

October 28, 2026. These are recommended boundaries accepted for planning;
**Phase 1 implements none of the later-phase infrastructure below.** Provider
selection still needs to match the eventual deployment environment.

| Decision | Recommended direction | Current implementation / next work |
| --- | --- | --- |
| Inference ownership | Server-side inference for the first paid release | Existing Node route starts `python3` per request. Unused browser inference libraries were removed; no replacement inference system was built. |
| Runtime boundary | Node-capable web tier and a packaged persistent Python worker, bounded concurrency, health checks and model provisioning | Next 16 / Node 24 web tooling is implemented. Persistent worker, queue and reproducible Python packaging remain Phase 3. No arbitrary edge/serverless compatibility is assumed. |
| Identity and accounting | Managed sessions behind an adapter; server-owned ownership and transactional relational records; immutable credit ledger with reservations/idempotent settlement | Auth/database providers remain undecided. Browser localStorage and demo accounting remain untrusted prototypes. Identity is Phase 2; accounting is Phase 6. |
| Assets | Private object storage for originals, masks and full-resolution outputs; bounded previews with ownership checks, expiry and deletion | Storage provider remains undecided. No bucket, credentials, asset service, migrations or retention job exists yet. Phases 3 and 7 own these controls. |
| Composition | Versioned preview/export specification describing backgrounds, source/target geometry, subject placement, shadows, layers and brush edits | Phase 4 will define the actual contract and choose an authoritative renderer after a Python/server-renderer parity spike. Existing canvas engines remain unchanged. |
| Payments | Hosted checkout and verified webhooks, initially test mode; Stripe is a proposal | No provider selected, credentials added or payments activated. Browser checkout is still a demo. Phase 6 must replace it before sale. |

Proposed durable records: owner/session, user, image asset, job, composition
revision, export artifact, grant, reservation, immutable ledger entry,
subscription, webhook receipt and saved preset. Ownership transfer at signup must
be tested. None of these records is implemented by this document.

Phase 1 verification needs no service environment variables, database, storage,
payment secrets, Python installation or model assets. Future provider variables
must be documented when selected, validated at startup and kept out of source
control; placeholder secrets are not configuration.
