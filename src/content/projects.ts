import { byRecency, define, projectsSchema } from "./schema";

/**
 * Projects.
 *
 * `tier` drives layout, not order:
 *   featured  -> large treatment on the home page + a detail route
 *   secondary -> compact card in the grid + a detail route
 *   minor     -> one-line entry in the "also built" list, no detail route
 *
 * HOUSE STYLE. Two rules, both load-bearing:
 *
 *   1. Layered. The first sentence of every `summary` must land for a recruiter
 *      with no ML background. The technical specifics live below it, in
 *      `approach` / `architecture` / `technicalDepth`, where an engineer will
 *      look for them. Neither audience should have to read the other's copy.
 *
 *   2. No em dashes anywhere. Use a period, a comma, a colon, or parentheses.
 *
 * EVERY NUMBER IS TRACEABLE to a repo file, a PR body, or the resume. Claims
 * that could not be verified were dropped or moved into `caveats`, which renders
 * only in development. See VERIFICATION.md before editing.
 */
const data = [
  /* ------------------------------------------------------------------------ */
  {
    slug: "kv-cache-eviction",
    title: "Prefix Cache Eviction for LLM Serving",
    tagline:
      "A better rule for what an LLM server throws away. 37.7% faster first response.",
    tier: "featured",
    category: "ml-systems",
    start: "Jan 2026",
    end: "Present",
    sortKey: "2026-01",
    status: "in-review",
    collaborative: true,

    summary:
      "An AI server keeps a copy of prompt text it has already processed, so sending the same instructions again costs nothing. That memory fills up, and the standard rule for what to delete is naive: it drops whatever was used least recently, with no idea that one item might be shared by dozens of waiting requests. We wrote a rule that checks how much a cached prefix is actually being reused before deciding, and put it up for review in SGLang.",

    problem:
      "SGLang stores prompt prefixes in a tree, so a single node can be the shared ancestor of many in-flight requests. LRU treats it like any other leaf. Evict it and every request underneath recomputes its prefill from scratch, which surfaces as a latency spike exactly when the server is busiest.",

    approach:
      "The shipped policy scores each node as `last_access_time - alpha * log1p(hit_count)`, with alpha = 2.0. SGLang evicts the lowest score first, so a heavily reused prefix ages out earlier than an equally recent one nobody has touched. That reads backwards until you notice those prefixes have already paid for themselves, and on a finite workload the space is worth more to the requests still arriving. Setting alpha = 0 collapses exactly to LRU, which is the property the unit tests pin down.",

    architecture:
      "The SGLang change is small on purpose: one new strategy class, four lines wiring it into the radix cache, the policy name added to server args, and four unit tests. 52 lines across four files, nothing in the attention kernel, and no change to model output. The earlier vLLM prototype was the opposite shape, roughly 1,450 lines of new eviction, prefetch, scoring and instrumentation code behind 53 unit tests.",

    technicalDepth:
      "The most useful thing this produced was a failure. After about 30 hours of GPU time across 100+ benchmark configurations, the vLLM prototype's eviction path had fired zero times: `total_evictions` is 0 in all 57 benchmark records. The cause is structural, not a bug. vLLM's V1 scheduler preempts requests before the block pool can oversubscribe, so the condition the policy existed to handle cannot occur. That also means the +9% throughput those runs showed had nothing to do with eviction, so we wrote it up as a root cause analysis rather than reporting the number. Moving to SGLang, whose radix cache does evict under pressure, is what made the measurement possible at all.",

    highlights: [
      "Co-authored SGLang PR #23781, adding a `wlfu` eviction strategy to RadixAttention in 52 lines across 4 files, with no attention-kernel changes.",
      "On the PR's shared-prefix benchmark (Qwen2.5-7B-Instruct, A100-40GB, 2048 prompts): P99 time-to-first-token 715.8ms down to 445.9ms, mean 103.2ms down to 79.6ms, output throughput up 0.7%.",
      "Diagnosed why the vLLM prototype could never work, and documented it: V1 preempts before the block pool oversubscribes, making the eviction path unreachable by construction.",
      "Three-person project for CMU 11-868 (Large Language Model Systems) with Akshara N S and Tejas Goyal.",
    ],

    metrics: [
      {
        value: "-37.7%",
        label: "P99 first-token latency",
        note: "715.8ms to 445.9ms vs. LRU",
        emphasis: true,
      },
      {
        value: "-22.8%",
        label: "Mean first-token latency",
        note: "103.2ms to 79.6ms",
        emphasis: true,
      },
      { value: "+0.7%", label: "Throughput", note: "no regression" },
      {
        value: "0 / 57",
        label: "Evictions in the vLLM prototype",
        note: "the negative result that redirected the work",
      },
    ],

    stack: ["SGLang", "vLLM V1", "PyTorch", "CUDA", "Python", "SLURM", "pytest"],

    links: [
      {
        label: "SGLang PR #23781",
        href: "https://github.com/sgl-project/sglang/pull/23781",
        icon: "pr",
        external: true,
      },
      {
        label: "vLLM prototype",
        href: "https://github.com/rishirajFS/vllm-kv-tier",
        icon: "github",
        external: true,
      },
    ],

    caveats:
      "ATTRIBUTION: PR #23781 was opened by teammate tejas-goyal; Rishi is credited as author #2 in the PR body, not as a commit author. Wording is deliberately 'co-authored', never 'submitted'. Only WLFU reached upstream, so Weighted Segmented LRU is NOT claimed here. TTFT figures come from the PR body; the resume's 39.6%/26% differ from the PR's 37.7%/22.8%, so reconcile or supply the raw benchmark output. PR is currently mergeable=false with no human review. See VERIFICATION.md section 1.",
  },

  /* ------------------------------------------------------------------------ */
  {
    // DELIBERATELY BRIEF. This paper is unpublished, so everything on this page
    // is held at the level already circulating in Rishi's resume. No statistics,
    // no methodology detail, no repository link. Do not expand it from the repo.
    slug: "personalized-sycophancy",
    title: "Personalized Sycophancy",
    tagline:
      "Measuring how AI assistants stop being honest as a conversation goes on.",
    tier: "featured",
    category: "research",
    start: "Apr 2026",
    end: "Present",
    sortKey: "2026-04",
    status: "in-review",

    summary:
      "Ask a model to judge an awkward situation and it will answer straight. Tell it the situation is yours, defend yourself for a turn or two, and the same model quietly changes its verdict. This is a benchmark for that drift, built to find not just whether it happens but where in a conversation it starts. First-author work with Prof. Maarten Sap at CMU's Language Technologies Institute.",

    problem:
      "Sycophancy is usually tested in a single exchange: state an opinion, watch the model agree. Real advice conversations are longer, and the failure that matters is gradual. A model that is honest at the first turn and agreeable by the fifth.",

    approach:
      "A 100-scenario benchmark that walks each situation through a multi-turn advice conversation and probes the model's verdict at every turn, so drift is measured as a trajectory rather than a single before-and-after. The paper is in preparation and results are available on request.",

    technicalDepth:
      "Measuring the drift is straightforward. Attributing it is not. Probing a model's verdict mid-conversation risks altering the very conversation you are trying to measure, and a five-turn effect could originate at any of the five turns. Designing around both problems is what lets the benchmark point at the self-justification turn, the moment a user starts defending their own behavior, as the point most strongly associated with the shift.",

    highlights: [
      "First author, advised by Prof. Maarten Sap at CMU's Language Technologies Institute. Paper in preparation.",
      "Built a 100-scenario benchmark quantifying sycophantic drift across multi-turn advice conversations.",
      "Isolated the self-justification turn as the point most strongly associated with that drift.",
    ],

    // Two, not three: the featured card lays metrics out two per row, so an odd
    // count strands the last one against empty space.
    metrics: [
      {
        value: "100",
        label: "Scenarios in the benchmark",
        note: "drift measured per turn, not end to end",
        emphasis: true,
      },
      {
        value: "In preparation",
        label: "First-author paper",
        note: "results available on request",
      },
    ],

    stack: [
      "Python",
      "LLM evaluation",
      "Benchmark design",
      "Multi-turn probing",
      "Statistical testing",
    ],

    links: [],

    caveats:
      "HELD BACK ON PURPOSE. The paper is unpublished, so this page carries only what the resume already says: 100 scenarios, multi-turn drift, the self-justification turn. The research repo is public but is NOT linked here, and none of its statistics, model names, pipeline details, or ablation design appear on this page. Do not add them before the paper is out. Separately, 'SOCIALDRIFT-100' appears nowhere in the repo, so the benchmark name is avoided entirely, and the paper title plus Prof. Sap's name as advisor still need his sign-off. See VERIFICATION.md section 2.",
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: "self-healing-agent",
    title: "Self-Healing Agent",
    tagline:
      "Reads production error logs, writes the fix and a test, waits for a human to approve.",
    tier: "featured",
    category: "agents",
    start: "Dec 2025",
    sortKey: "2025-12",
    status: "shipped",

    summary:
      "When software breaks in production, someone has to read the crash report, find the file, work out the fix, and write a test proving it stays fixed. Most of that is mechanical. This agent does the mechanical part and then stops: it posts the proposed patch to Slack and will not touch the repository until a person clicks approve.",

    problem:
      "Most error monitoring stops at the alert. The expensive judgment, deciding whether a fix is actually correct, is exactly the part you want a human doing, and the tedium around it is what eats their attention before they get there.",

    approach:
      "Two model stages keep cost proportional to signal. Claude Haiku separates real bugs from noise on a 256-token budget, and only survivors reach Claude Sonnet with 8,192 tokens and the relevant source files, asked for a unified diff plus a pytest regression test. Deduplication runs before either model. Nothing is written anywhere until a Slack Block Kit card is approved; on approval the agent branches off main, applies the patch, commits the test, opens the pull request, then follows the merge back into its own incident table.",

    architecture:
      "About 2,430 lines of Python and a 107-line schema, split by responsibility: ingestion (CloudWatch polling, traceback parsing into typed events), analysis (fingerprinting, then the Haiku and Sonnet prompts), integrations (GitHub, Slack), and Supabase persistence driven by two explicit state machines, seven states for error events and five for fix proposals. An orchestrator runs the polling loop while a separate webhook server owns the Slack callback, so an approval click is handled asynchronously and never blocks ingestion. Concurrency caps at five open proposals.",

    technicalDepth:
      "The fingerprint is the load-bearing piece: a 16-character truncation of `sha256(error_type | file | line)` taken at the innermost stack frame. Two traces from one bug are never byte-identical, since line numbers shift and request IDs and timestamps vary, so the fingerprint has to capture the shape and nothing incidental. Too strict and every occurrence opens a new incident and the Slack channel becomes unusable. Too loose and distinct bugs collapse into one, and the agent confidently patches the wrong thing. Deduplication, the concurrency cap, and recurrence detection all sit downstream of that one hash being right.",

    highlights: [
      "Deterministic 16-character fingerprint over the innermost stack frame, so a recurring bug maps to one open incident instead of a hundred alerts.",
      "Two-stage pipeline with asymmetric budgets: 256 output tokens for triage, 8,192 for patch generation, and a 150,000-token cap on source context.",
      "Human-in-the-loop Slack approval with signed callbacks and a 300-second replay window.",
      "Twelve explicit persisted states across two machines, which is what makes recurrence detection possible.",
    ],

    metrics: [
      {
        value: "16 char",
        label: "Incident fingerprint",
        note: "sha256 over the innermost frame",
        emphasis: true,
      },
      {
        value: "256 to 8,192",
        label: "Triage vs. patch token budget",
        note: "Haiku, then Sonnet",
      },
      { value: "7 + 5", label: "Persisted state-machine states" },
      { value: "0", label: "Repo writes before human approval" },
    ],

    stack: [
      "Python",
      "Claude API",
      "AWS CloudWatch",
      "Supabase",
      "Slack Block Kit",
      "GitHub API",
      "pytest",
    ],

    repo: "rishirajFS/self-healing-agent",
    links: [
      {
        label: "Source",
        href: "https://github.com/rishirajFS/self-healing-agent",
        icon: "github",
        external: true,
      },
    ],

    caveats:
      "The resume's 'fix proposal in roughly two minutes' is NOT verifiable: no timing instrumentation, benchmark, or latency figure exists anywhere in the repo. `_CLAUDE_TIMEOUT = 120.0` is a per-call ceiling on one Sonnet request, not an observed latency, and the default poll interval is 60s. Deliberately omitted here. Also no test suite (test_seed.py is a seeder). See VERIFICATION.md section 3.",
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: "poker-ai",
    title: "27-Card Heads-Up Poker AI",
    tagline: "A poker bot for a 27-card variant. 59.6% win rate over 381 matches.",
    tier: "featured",
    category: "applied-ml",
    start: "Mar 2026",
    end: "Mar 2026",
    sortKey: "2026-03",
    status: "shipped",

    summary:
      "Built for CMU's AI poker tournament, on a stripped-down 27-card deck. With about a second and a half to act, you cannot simulate your way to a decision, so the real work is deciding which parts of the game to solve exactly, which to look up from a table built in advance, and which to learn. It won 59.6% of 381 rated matches at 1,000 hands each.",

    problem:
      "A per-hand time budget rules out running simulations at every decision point, and the game is far too large to solve outright. The engineering is in carving it into pieces that each want a different treatment.",

    approach:
      "Two hand-rank tables get built once at startup, 80,730 five-card entries and 888,030 seven-card entries, for a one-time cost of 3.6 seconds and about 212MB. Postflop, the remaining space is small enough to enumerate exactly rather than sample: 23,256 board and opponent-holding matchups in 6.7ms, so there is no rollout variance to reason about. Strategy sits on top as a Neural Fictitious Self-Play agent trained toward equilibrium. The shipped agent is a single 2,188-line class with no ML dependency at inference time.",

    technicalDepth:
      "Reservoir sampling is what keeps NFSP honest. Its average-policy network is meant to approximate the average of every historical strategy, and it is that average, not the latest policy, that converges toward Nash. Train it on a recency-biased replay buffer and it approximates the recent strategy instead, so the agent chases its own tail and the equilibrium guarantee quietly evaporates. Reservoir sampling gives every past hand an equal chance of sitting in the 2,000,000-sample buffer, which is the distribution the theory actually assumes.",

    highlights: [
      "59.6% match win rate, 227 wins to 154 losses across 381 rated matches at 1,000 hands each.",
      "Net rating of +1 over those matches: the win rate was well above even, but narrow losses cost disproportionate ELO, which is what the analysis scripts were built to diagnose.",
      "Exact postflop equity by enumerating all 23,256 matchups in 6.7ms, against a 1.5s per-hand budget.",
      "Iterated from v9 to v42+ with archived snapshots, driven by per-opponent match analysis.",
    ],

    metrics: [
      {
        value: "59.6%",
        label: "Match win rate",
        note: "227 to 154 over 381 rated matches",
        emphasis: true,
      },
      {
        value: "6.7 ms",
        label: "Exact equity lookup",
        note: "23,256 matchups, no sampling",
        emphasis: true,
      },
      { value: "888,030", label: "Precomputed hand ranks" },
      { value: "2M", label: "Reservoir-sampled training buffer" },
    ],

    stack: ["Python", "PyTorch", "NFSP", "Monte Carlo", "Game theory"],

    repo: "rishirajFS/pokerai",
    links: [
      {
        label: "Source",
        href: "https://github.com/rishirajFS/pokerai",
        icon: "github",
        external: true,
      },
    ],

    caveats:
      "The repo consistently calls this the 'CMU AI Poker Tournament 2026'. There is no Jump Trading branding anywhere in it (the only 'Jump' string is an opponent team named JumpStreet). 'Competition Finalist' is also unverifiable: no standings or finals log is committed. This page therefore leads with the verified 381-match ledger. Settle the sponsor wording and supply finalist evidence before claiming either. See VERIFICATION.md section 4.",
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: "harbor",
    title: "HARBOR",
    tagline:
      "Predicting depression from phone sensor data, and the negative result from testing it honestly.",
    tier: "secondary",
    category: "applied-ml",
    start: "Jan 2026",
    end: "Present",
    sortKey: "2026-01-02",
    status: "active",

    summary:
      "Phones passively record how much you move, how much you sleep, how often you unlock them. This pipeline predicts depression severity from 50+ such signals across 218 students and 35,000+ observations. The result worth reporting is not an accuracy score. It is that testing the model on people it had never seen, rather than on new days from people it already knew, made the published benchmark numbers fall apart.",

    problem:
      "Papers in this area routinely split sensor data by observation rather than by person, so the same participant's Tuesday sits in training and their Thursday in the test set. The model can then score well by recognizing individuals instead of learning anything about depression. The published numbers are real. They just do not mean what they appear to mean.",

    approach:
      "Rebuild the evaluation first: cross-validation split by participant, with zero overlap between folds, which is the only split that answers the question a deployment would ask. Establish gradient-boosted and classical baselines against that honest split, then LoRA fine-tune MedGemma-27B on a single A100 and compare against the same baseline rather than the inflated one.",

    technicalDepth:
      "The whole project is an argument about a train/test split, which is why it produces a documented negative result instead of a leaderboard entry. Once no participant appears on both sides, performance falls to roughly what you would expect of a model that has to generalize across people, and a 27B medical model fine-tuned on the same data does not rescue it. That is the finding.",

    highlights: [
      "50+ passive sensor features across 218 students and 35,000+ observations.",
      "Cross-validation split by participant with zero overlap, replacing observation-level splits.",
      "Exposed a generalization failure the standard split had been hiding in published benchmarks.",
      "LoRA fine-tuned MedGemma-27B on a single A100 against the honest baseline, a documented negative result.",
    ],

    metrics: [
      { value: "218", label: "Participants" },
      { value: "35K+", label: "Observations" },
      { value: "50+", label: "Sensor features" },
      { value: "MedGemma-27B", label: "LoRA fine-tune", note: "single A100" },
    ],

    stack: ["Python", "XGBoost", "scikit-learn", "PyTorch", "LoRA", "MedGemma"],

    links: [],

    caveats:
      "ZERO public footprint. No repo, no writeup, nothing findable across seven distinct searches, so everything here comes from the resume alone and is unverified. To keep it on the site, supply a public or redacted repo, a short PDF, or two or three figures (the participant-disjoint vs. random-split comparison, and the MedGemma result against the honest baseline). Confirm the dataset name and any data-use or IRB restriction before publishing the 218/35K counts. See VERIFICATION.md section 6.",
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: "pa-broadband-inequality",
    title: "Mapping Pennsylvania's Digital Divide",
    tagline: "Where the internet is actually slow, against who lives there.",
    tier: "secondary",
    category: "data",
    start: "Apr 2026",
    end: "Apr 2026",
    sortKey: "2026-04-01",
    status: "shipped",

    summary:
      "A dashboard joining 70,105 real speed-test measurements to Census demographics across 1,410 Pennsylvania ZIP areas. The question it asks is whether slow service tracks income, race and education rather than just terrain and distance, and it answers with maps, partial-dependence plots, and a gradient-boosted model over 14 demographic features.",

    approach:
      "Ookla speed-test tiles are pulled from S3 and spatially joined to Census ZCTA geometry with GeoPandas, then merged with 21 American Community Survey variables. An XGBoost regressor over 14 features is tuned by a 12-configuration, 5-fold grid search, with partial dependence used to read the demographic gradients rather than trusting importance ranks alone.",

    highlights: [
      "70,105 speed-test tiles spatially joined to Census geometry, covering 1,410 of Pennsylvania's 1,832 ZIP areas.",
      "21 Census variables reduced to 14 model features spanning income, race, education, geography and infrastructure.",
      "Four-page Streamlit app with interactive choropleths, about 2,080 lines of Python.",
    ],

    metrics: [
      { value: "1,410", label: "ZIP areas with measured data" },
      { value: "70,105", label: "Speed-test tiles joined" },
      { value: "14", label: "Model features", note: "from 21 Census variables" },
    ],

    stack: [
      "Python",
      "Streamlit",
      "Plotly",
      "GeoPandas",
      "XGBoost",
      "scikit-learn",
    ],

    repo: "rishirajFS/pa-broadband-inequality",
    links: [
      {
        label: "Source",
        href: "https://github.com/rishirajFS/pa-broadband-inequality",
        icon: "github",
        external: true,
      },
    ],

    caveats:
      "BLOCKING. The repo's 'FCC coverage' layer is SYNTHETIC: _generate_fcc_estimates() seeds np.random.seed(42) and derives advertised speed as the measured speed times a random density-banded multiplier, with provider_count and technology also randomized. So the 'FCC vs Reality' page compares measured speeds against a random multiple of themselves, and the reported rural-vs-urban gap just restates the generator's own parameters. The random provider_count is also the #3 model feature (~8.5% importance). This page has been rewritten to claim only the Ookla and Census work and mentions no FCC data. Separately: metrics.json is not committed, so R2=0.27 / RMSE 88.6 exist only as prose and are not shown; and the committed artifacts say 217 Mbps statewide median while Proposal.md says 105 Mbps. Rotate the committed Census API key. See VERIFICATION.md section 5.",
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: "claude-session-manager",
    title: "Session Chainer",
    tagline: "A macOS daemon that opens your Claude session window while you sleep.",
    tier: "secondary",
    category: "tools",
    start: "Apr 2026",
    end: "Apr 2026",
    sortKey: "2026-04-05",
    status: "shipped",

    summary:
      "Claude's usage windows last five hours and start whenever you send your first message, so a 9am start gives you three of them and they end wherever your day happened to begin. This runs quietly in the background and sends one throwaway character the moment each window opens, including overnight, so you wake up already inside one. 582 lines of standard library, no dependencies, built in a single evening.",

    approach:
      "A launchd agent installed at login forks a watcher that sleeps in jittered 15 to 20 minute intervals, randomized per iteration to bound worst-case lag after a reset, and checks whether the current window has expired. When it has, it shells out to the already-authenticated Claude CLI, so no API key is involved. Session state is tracked on disk, so `--status` reports live time remaining and `--reset` re-anchors the clock after a manual session.",

    technicalDepth:
      "It is a small program whose entire value is in the boundary conditions. The watcher has to be idempotent across sleep and wake, must not double-fire when the user opened Claude before the timer did, and has to survive a laptop closed across a window boundary. `--reset` exists precisely because a wrong assumption about session start silently burns a whole window, and the tool ships a `--verify` mode to confirm the CLI and the web app really do share one session pool before you trust it with your day.",

    highlights: [
      "Chains 4 or more windows per day instead of 3, with the first already running when you wake up.",
      "582 lines of Python with zero runtime dependencies. Every import is standard library.",
      "33 unit tests, all passing, plus a `--verify` mode that checks the core assumption before you rely on it.",
      "launchd agent for start-on-login, with `--status` and `--reset` for the cases the timer cannot see.",
    ],

    metrics: [
      { value: "33 / 33", label: "Tests passing", emphasis: true },
      { value: "0", label: "Runtime dependencies", note: "standard library only" },
      { value: "582", label: "Lines of Python" },
      { value: "1 evening", label: "Built in", note: "6 commits, one sitting" },
    ],

    stack: ["Python", "launchd", "macOS", "Claude CLI", "pytest"],

    repo: "rishirajFS/claude-session-manager",
    links: [
      {
        label: "Source",
        href: "https://github.com/rishirajFS/claude-session-manager",
        icon: "github",
        external: true,
      },
    ],

    caveats:
      "Repo hygiene before linking: CLAUDE.md is a stale design doc that documents a queue_parser.py which does not exist and claims an ANTHROPIC_API_KEY is required (it is not). install.sh points at daemon.py while the README describes watcher.py. The queue feature is a stub. None of those claims are repeated here. See VERIFICATION.md section 7.",
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: "cement-demand-forecasting",
    title: "National Cement Demand Forecasting",
    tagline:
      "Replaced the spreadsheet a national industry was forecasting with. 15% more accurate.",
    tier: "minor",
    category: "applied-ml",
    start: "Jan 2025",
    end: "May 2025",
    sortKey: "2025-01",
    status: "shipped",

    summary:
      "Built at Brandidea Granular Analytics: an end-to-end pipeline for national cement demand, feeding an executive dashboard with a district-level map of India. XGBoost beat the incumbent analyst-built Excel baseline by 15% RMSE, on features from web scrapers I wrote myself.",

    metrics: [
      { value: "15%", label: "Lower error than the Excel baseline", emphasis: true },
    ],

    stack: ["Python", "XGBoost", "Random Forest", "Power BI"],
    highlights: [],
    links: [],
  },
] as const;

export const projects = define(projectsSchema, data, "content/projects.ts");

/* ------------------------------------------------------------------- queries */

export const featuredProjects = projects.filter((p) => p.tier === "featured");
export const secondaryProjects = projects.filter((p) => p.tier === "secondary");
export const minorProjects = projects.filter((p) => p.tier === "minor");

/** Everything that gets its own /projects/[slug] route. */
export const detailedProjects = projects.filter((p) => p.tier !== "minor");

export const projectsByRecency = [...projects].sort(byRecency);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const projectCategories = [
  { id: "ml-systems", label: "ML Systems" },
  { id: "research", label: "Research" },
  { id: "agents", label: "Agents" },
  { id: "applied-ml", label: "Applied ML" },
  { id: "data", label: "Data" },
  { id: "tools", label: "Tools" },
] as const;
