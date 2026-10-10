# Content verification

Before writing the project pages, every claim from the résumé was checked against
the actual source: repo file trees, commit histories, benchmark result files,
and upstream PRs. Most of it held up, and several repos turned out to contain
*better* material than the résumé does.

Some claims did not hold up. They are listed here because a recruiter who reads
this site can run the same checks in about ten minutes, and a claim that fails
in front of them costs more than the claim was ever worth.

Nothing in this file is published. Each item is also mirrored into the affected
project's `caveats` field in `src/content/projects.ts`, which renders as a warning
box **only in development** (`next dev`), never in a production build.

**Legend:** 🔴 fix before launch · 🟡 decide before launch · 🟢 informational

---

## Update: new résumé (October 2026)

`public/Rishiraj_Nagarajan_Resume.pdf` was replaced with the MLE résumé and the
site content now mirrors it: Different Labs (May to Aug 2026, ended), the 11-868
TA role, the Brandidea RAG bullet, SocialDrift headline results, and two new
featured projects (APIShift, chart validator). Poker, self-healing agent and
broadband moved to secondary; HARBOR moved to the "Earlier" list since the
résumé dropped it. This resolves the old §6 and §8 items for the site.

Still open after the swap:

0. **SGLang PR #23781 is closed, unmerged (2026-08-30).** The site now says
   "proposed upstream ... closed without merging". The résumé still says
   "Upstream SGLang pull request under review", which is no longer true. Fix the
   résumé line before sending it anywhere.

1. **KV cache numbers.** The résumé says 39.6% P99 / 26% mean on MS MARCO and
   "weighting reuse by prefix depth". The PR says 37.7% / 22.8% on a Qwen2.5-7B
   shared-prefix workload with a scalar score. The site keeps the PR figures.
   If the MS MARCO run is real, publish its output and add it; otherwise align
   the résumé down.
2. **Not checkable from public repos:** the chart validator (no repo), the
   APIShift GRPO figures (not in its README), and the 64% / 36K / 73%
   SocialDrift numbers. The 1% to 24% shift is in the llm-sycophancy README.
3. **Different Labs figures** (300 user-hours, 47%, 25%, 10+ organizations)
   describe an employer's system. Confirm clearance.

---

## 1. 🔴 KV cache eviction: attribution and scope

**SGLang PR #23781 exists and is real:** "Add WLFU radix cache eviction policy",
open, 4 files, +52/−3.

Three problems with the résumé wording:

1. **You did not open it.** The PR was opened by GitHub user `tejas-goyal` from
   their own fork. You are credited as author #2 in the PR body
   ("2. Rishi Nagarajan (rishin@andrew.cmu.edu)"), but you are not a commit
   author on either commit and have no `Co-authored-by` trailer. Your
   `rishirajFS` account has **zero** PRs to `sgl-project/sglang`, and you have
   never forked sglang or vllm.
   → The résumé says "Submitted upstream as an SGLang PR." The site says
   **"Co-authored SGLang PR #23781."** Recommend changing the résumé to match.

2. **Only one of the two policies was upstreamed.** There is no public PR for
   Weighted Segmented LRU from your group anywhere in sglang. (The only SLRU PR
   in the repo is #18843 by an unrelated author, closed, and it predates you.)
   → The site claims only WLFU. If you implemented WSLRU, label it
   "implemented, not upstreamed."

3. **"Structure-aware" is not what shipped.** The upstreamed `WLFUStrategy` is
   `last_access_time - alpha * log1p(hit_count)`, a scalar frequency-age penalty. No
   subtree size, depth, or branch-factor term; no radix-tree structural signal.
   → The site describes it accurately as frequency-aware. Consider retitling the
   résumé line.

**Also:** it is a three-person 11-868 project (Akshara N S, Tejas Goyal). The
site says so. The PR is currently `mergeable: false` (conflicts with main) with
zero human reviews, so it is worth rebasing before you point anyone at it.

**Number discrepancy to reconcile:** the résumé says 39.6% P99 / 26% mean TTFT.
The PR body says **37.7% P99 (715.8 → 445.9 ms) / 22.8% mean (103.2 → 79.6 ms)**.
The site uses the PR's numbers because those are the ones a reader can check. If
your 39.6%/26% came from a different run, supply the raw benchmark output.
Otherwise align the résumé down to the PR figures.

---

## 2. 🟡 Sycophancy research: held back until publication

**Decision: this work is deliberately under-described on the site.** The paper is
unpublished, so the project page and the publications entry carry only what
already circulates in the résumé (a 100-scenario benchmark, multi-turn drift, the
self-justification turn) and the research repo is **not linked**.

What that means in practice, and what must stay out until the paper is public:

- No statistics. Not the drift magnitude, the confidence intervals, the effect
  sizes, the ablation split, or the external-validation agreement rates.
- No methodology detail. Not the condition matrix, the judge rubric, the probe
  design, or the GPU pipeline.
- No model names, and no link to the code.

The repo actually contains considerably more than the résumé claims, including a
2⁴ ablation that reassigns most of the headline effect away from the obvious
explanation, validation against real Reddit posts with crowd verdicts,
ordering-robustness runs, and an honest report of one test that did not
reproduce. **That is the strongest material in the portfolio and it is the exact
material being withheld.** When the paper lands, this section is the checklist for
what to put back.

Two items still need a decision:

- **"SOCIALDRIFT-100" appears nowhere in the repo.** `grep -ri socialdrift`
  returns nothing and GitHub code search returns zero. The artifact is real
  (`data/scenarios.json` is exactly 100 scenarios, 20 per category, each with
  matched first/third-person retellings and four drift turns) but in code and
  docs it is only ever "scenarios.json" or "PsychLLM."
  → The site avoids the name entirely. Either rename in the repo so it is
  checkable, or drop the branded name from the résumé too.

- **No paper artifact exists** in the repo. No PDF, no preprint, no draft, only a
  generated `.pptx`. The paper title appears nowhere, and neither does "Maarten
  Sap" (though `SESSION_LOG.md` credits design feedback to "Maarten").
  → Get advisor sign-off before this site publishes the paper title and names
  Prof. Sap as advisor.

---

## 3. 🟡 Self-healing agent: the "two minutes" claim

**Not verifiable from the repo.** There is no timing instrumentation anywhere:
no elapsed-time logging, no benchmark, no latency figure in the README.

Two things push against it:

- `_CLAUDE_TIMEOUT = 120.0` in `analysis/claude_client.py` is exactly two
  minutes, but it is a per-call *timeout ceiling* on one Sonnet request, not an
  observed end-to-end latency.
- `CLOUDWATCH_POLL_INTERVAL_SECONDS` defaults to 60, so detection alone can add
  a minute before triage, GitHub file fetches, and patch generation begin.

→ The claim is **omitted from the site**. Either produce a log or screenshot from
a real run, or drop it from the résumé too.

The architecture numbers the site uses instead are all verified from source and
are frankly more impressive than a latency figure: the 16-hex
`sha256(error_type|file|line)` fingerprint at the innermost frame, the 256 vs.
8,192 token budget asymmetry, the 7+5 state machines, the 5-proposal concurrency
cap, and the 300-second Slack replay window.

**Minor:** there is no test suite (`test_seed.py` is a seeder, not tests). The
site does not claim one.

---

## 4. 🔴 Poker AI: sponsor and finalist standing

- **No Jump Trading branding anywhere in the repo.** It consistently says
  "CMU AI Poker Tournament 2026" / "CMU Poker Bot Competition Game Engine 2026"
  across `gym_env.py`, `prd.md`, `docs/rules.md`, and the notebooks. The only
  "Jump" string in the repo is an opponent team named *JumpStreet*.
  → Sponsorship is plausible but unverifiable here. Settle the public wording.

- **"Competition Finalist" is not verifiable.** `docs/rules.md` defines finals as
  a top-12 round robin on March 21 2026, but no standings file, finals log, or
  results export is committed.
  → The site therefore leads with what *is* verified: **381 rated matches,
  227W/154L (59.6%), net ELO +1**, computed by running the repo's own
  `analyze_elo.py`. Supply a leaderboard screenshot or organizer email and the
  finalist claim can go back in.

**Note on the equity table:** the résumé cites C(27,5) = 80,730. The repo builds
*both* that and a C(27,7) = 888,030 seven-card table. Flop equity is 6.7 ms by
exact enumeration of 23,256 matchups (measured, not estimated; the repo comment
claiming ~4 ms is stale).

---

## 5. 🔴 Broadband dashboard: the FCC data is synthetic

**This is the one to fix in the repo, not just on the site.**

`_generate_fcc_estimates()` in `src/data_pipeline.py` seeds
`np.random.seed(42)` and computes "advertised" speed as the *measured* Ookla
speed × a random uniform multiplier chosen by density band (urban 1.5–2.5×,
suburban 1.8–3.0×, rural 2.0–4.0×). `provider_count` is `np.random.randint`;
`primary_technology` is `np.random.choice`.

Consequences:

- The "FCC vs Reality" page compares measured speeds against **a random multiple
  of those same speeds**. It cannot show anything.
- `Proposal.md` discloses this in Methods and Limitation #4, but its Results
  section then reports "rural gaps of 3–4×, urban 1.5–2.5×" as a *finding*.
  Those are the generator's own parameters restated.
- `provider_count` is one of the 14 model features and ranks **#3 by importance
  (~8.5%)**, so the model is partly fitting noise.

→ The site page has been rewritten to claim **only the Ookla + Census work**,
which is real and solid (70,105 tiles spatially joined, 1,410 of 1,832 ZCTAs,
21 ACS variables → 14 features, 12-config × 5-fold grid search). It makes no
mention of FCC data. Either wire up real FCC Broadband Data Collection files or
delete that page from the dashboard and the Results section.

**Also:**
- `data/models/metrics.json` is not committed, so R² = 0.27 / RMSE 88.6 / MAE 65.1
  exist only as prose in `Proposal.md`. Not shown on the site.
- The committed artifacts say **217 Mbps** statewide median download; `Proposal.md`
  Results says **105 Mbps**. They contradict each other. Resolve before quoting.
- 🔴 **Rotate the 40-hex Census API key committed in `.env.example`.**

---

## 6. 🔴 HARBOR: zero public footprint

Seven distinct searches found nothing: no repo among your 25 public ones, no org
memberships to hide it in, no code-search hits for `harbor`, `medgemma`, or
`studentlife`, and no global repo matches.

Everything on that page comes from the résumé alone and is **unverified**. The
site keeps it at `secondary` tier with a caveat.

To keep it credible, supply one of:
- a public or redacted repo,
- a 1–2 page PDF writeup,
- or 2–3 figures: the patient-disjoint vs. random-split CV comparison, and the
  LoRA MedGemma-27B result against the honest baseline.

Also **confirm the dataset name and any data-use/IRB restriction** before this
site publishes "218 students, 35K+ observations". If it is StudentLife or a
similar cohort, check the terms.

This is worth the effort. It is the clearest demonstration of the through-line
on the whole site, and right now it is the least substantiated.

---

## 7. 🟢 Session Chainer: repo hygiene only

The code and the README are accurate. `CLAUDE.md` is a stale design doc and
contradicts both:

- It documents a `queue_parser.py` that does not exist.
- It claims `ANTHROPIC_API_KEY` must be set. It must not, since the tool shells out to
  the authenticated `claude` CLI, as the README correctly says.
- It claims rate-limit response headers are used as a cross-check. No HTTP header
  parsing exists anywhere in the repo.
- `install.sh` points launchd at `daemon.py`; the README describes `watcher.py`.
- The queue feature is a stub that prints "Queue execution coming in Phase 3."

None of those claims are repeated on the site. Verified and used instead: 33/33
tests passing, 582 lines, zero runtime dependencies, jittered 15–20 min poll,
built in 6 commits over 22 minutes.

---

## 8. 🟢 External footprint: set expectations honestly

Worth knowing before you describe yourself as an open-source contributor:

- Outside your own repos, your public GitHub footprint is **one merged PR**:
  `AdithyaSuresh17/Kankatti#2` (currency detection module, 2024).
- The two PRs on `self-healing-agent-test` were generated by your own agent, not
  by you.
- Zero comments or reviews on any external issue or PR. Zero gists. No org
  memberships.
- The SGLang contribution is real but is credited in a PR body, not in git
  history.

The site does not overstate this. If upstream contribution matters for the roles
you are targeting, the cheapest fix is to rebase PR #23781 yourself and ask
`tejas-goyal` to add a `Co-authored-by` trailer.

---

## Content you still need to supply

Blocking or near-blocking, roughly in order of leverage:

1. **Résumé PDF is in `public/`**, but confirm it is current, and align its
   numbers with the corrections in §1 and §3.
2. **Real domain.** `site.siteUrl` is a placeholder
   (`https://rishirajnagarajan.com`). It drives OG tags, canonical URLs,
   `sitemap.xml`, and `robots.txt`.
3. **Confirm the LinkedIn vanity URL.** `linkedin.com/in/rishirajn` returns HTTP
   999 to any automated fetch and is not linked from your GitHub profile, so it
   is unverified. Confirm it or the link comes off.
4. **Different Labs clearance.** That whole experience block describes an
   employer's unreleased system. Get explicit approval on what is publishable,
   and decide whether the non-inferiority eval delta can be quoted numerically.
5. **Contact decisions.** Which email is public (`rishi.nagarajan.work@gmail.com`
   vs. `rishin@andrew.cmu.edu`); whether your **phone number** should appear on a
   public page at all (it currently does, in the contact section); and the exact
   availability line.
6. **A headshot** (square, ≥1200×1200, neutral background) if you want one. The
   layout works without.
7. **Project imagery.** Eight cards, no images. The current design uses
   typographic + metric-panel treatments deliberately, so this is optional, but
   a TTFT latency chart, a Slack approval card screenshot, and a broadband
   dashboard screenshot would each earn their space.
8. **Whether the U.S. Army upskilling program can be named publicly.**

Also worth doing: three short write-ups would make the through-line first-hand
rather than asserted: the HARBOR negative result, why the vLLM eviction path was
structurally unreachable, and how the 2⁴ ablation reassigned two-thirds of your
own effect.
