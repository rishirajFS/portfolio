import { byRecency, define, projectsSchema } from "./schema";

/**
 * Projects.
 *
 * HOUSE STYLE. Read this before adding anything.
 *
 * One paragraph per project, 55 words or fewer, opening with a verb. State what
 * was built and the one fact that makes it interesting. Numbers go in `metrics`,
 * not in the prose. Context goes in `kind`, not in a sentence.
 *
 * The word limit is enforced by the schema. It exists because this file
 * previously carried five prose blocks per project (summary, problem, approach,
 * architecture, technicalDepth) totalling 500 words on the longest one. Nobody
 * reads 500 words about a cache policy. The cap is what stops them coming back.
 *
 * `note` is the one concession: a single extra paragraph on the detail page for
 * the thing a sharp engineer would actually want to know. 70 words. Omit it
 * rather than pad it.
 *
 * No em dashes. EVERY NUMBER is traceable to a repo file, a PR body, or the
 * resume; claims that could not be verified live in `caveats`, which renders
 * only in development. See VERIFICATION.md.
 */
const data = [
  /* ------------------------------------------------------------------------ */
  {
    slug: "kv-cache-eviction",
    title: "Prefix cache eviction",
    kind: "ML systems · CMU 11-868 · three-person team",
    tier: "featured",
    category: "ml-systems",
    start: "Jan 2026",
    end: "Present",
    sortKey: "2026-01",
    status: "in-review",

    description:
      "Co-authored a frequency-aware eviction policy for SGLang's prefix cache, upstreamed as PR #23781 in 52 lines across four files. Prototyped it first in vLLM, where 100+ benchmark runs showed the eviction path never fired at all.",

    note: "The vLLM prototype was the useful failure. After roughly 30 hours of GPU time, total_evictions was 0 in all 57 benchmark records. The cause is structural: V1 preempts requests before the block pool can oversubscribe, so the condition the policy existed to handle cannot occur. Moving to SGLang, whose radix cache does evict, is what made the measurement possible.",

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
        emphasis: true,
      },
      { value: "+0.7%", label: "Throughput" },
      { value: "0 / 57", label: "Evictions in the vLLM prototype" },
    ],

    stack: ["SGLang", "vLLM", "PyTorch", "CUDA", "Python", "SLURM"],

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
      "ATTRIBUTION: PR #23781 was opened by teammate tejas-goyal; Rishi is credited as author #2 in the PR body, not as a commit author. Wording is deliberately 'co-authored', never 'submitted'. Only WLFU reached upstream, so Weighted Segmented LRU is NOT claimed. TTFT figures come from the PR body; the resume's 39.6%/26% differ from the PR's 37.7%/22.8%, so reconcile or supply the raw output. PR is currently mergeable=false with no human review. See VERIFICATION.md section 1.",
  },

  /* ------------------------------------------------------------------------ */
  {
    // DELIBERATELY THIN. The paper is unpublished, so this stays at the level
    // already circulating in the resume and the repo is not linked. See
    // VERIFICATION.md section 2 before adding anything.
    slug: "personalized-sycophancy",
    title: "Personalized sycophancy",
    kind: "LLM evaluation · CMU Language Technologies Institute",
    tier: "featured",
    category: "research",
    start: "Apr 2026",
    end: "Present",
    sortKey: "2026-04",
    status: "in-review",

    description:
      "Built a 100-scenario benchmark for how language models stop being honest as a conversation goes on. It probes the model's verdict at every turn, so drift is measured as a trajectory, and it isolates the turn where honesty gives way. First author, advised by Prof. Maarten Sap.",

    note: "Measuring the drift is easy. Attributing it is not: probing mid-conversation risks altering the conversation you are measuring, and a five-turn effect could start at any of the five turns. Designing around both is what lets the benchmark point at the self-justification turn, where a user begins defending their own behaviour.",

    metrics: [
      { value: "100", label: "Scenarios", emphasis: true },
      { value: "In preparation", label: "First-author paper" },
    ],

    stack: ["Python", "LLM evaluation", "Benchmark design", "Statistics"],
    links: [],

    caveats:
      "HELD BACK ON PURPOSE. Unpublished paper, so this carries only what the resume says. The research repo is public but is NOT linked, and none of its statistics, model names or ablation design appear here. 'SOCIALDRIFT-100' appears nowhere in the repo so the name is avoided. The paper title and Prof. Sap as advisor still need his sign-off. See VERIFICATION.md section 2.",
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: "self-healing-agent",
    title: "Self-healing agent",
    kind: "Agents · Independent",
    tier: "featured",
    category: "agents",
    start: "Dec 2025",
    sortKey: "2025-12",
    status: "shipped",

    description:
      "Built an agent that reads production error logs and opens pull requests. Claude Haiku triages noise from real bugs, Sonnet writes a minimal diff plus a pytest regression test, and nothing touches the repository until a human approves it in Slack.",

    note: "The fingerprint is the load-bearing piece: 16 characters of sha256 over error type, file and innermost frame. Two traces from one bug are never identical, so it has to catch the shape and nothing incidental. Too strict and every occurrence opens a new incident; too loose and the agent patches the wrong bug.",

    metrics: [
      { value: "16 char", label: "Incident fingerprint", emphasis: true },
      { value: "256 to 8,192", label: "Triage vs. patch tokens" },
      { value: "7 + 5", label: "Persisted states" },
      { value: "0", label: "Repo writes before approval" },
    ],

    stack: [
      "Python",
      "Claude API",
      "AWS CloudWatch",
      "Supabase",
      "Slack",
      "GitHub API",
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
      "The resume's 'fix proposal in roughly two minutes' is NOT verifiable: no timing instrumentation, benchmark or latency figure exists in the repo. _CLAUDE_TIMEOUT = 120.0 is a per-call ceiling, not a measurement, and the poll interval defaults to 60s. Deliberately omitted. Also no test suite. See VERIFICATION.md section 3.",
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: "poker-ai",
    title: "Heads-up poker AI",
    kind: "Applied ML · CMU AI Poker Tournament",
    tier: "featured",
    category: "applied-ml",
    start: "Mar 2026",
    end: "Mar 2026",
    sortKey: "2026-03",
    status: "shipped",

    description:
      "Built a bot for a 27-card poker variant with about a second and a half per decision. Precomputed 888,030 hand ranks at startup, enumerated postflop equity exactly rather than sampling it, and learned only the strategy on top with self-play.",

    note: "Reservoir sampling is what keeps the self-play honest. The average-policy network approximates the average of every historical strategy, and it is that average, not the latest one, that converges toward equilibrium. Train it on a recency-biased buffer and the agent chases its own tail while the guarantee quietly evaporates.",

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
      { value: "2M", label: "Training buffer" },
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
      "The repo consistently says 'CMU AI Poker Tournament 2026'. No Jump Trading branding appears anywhere (the only 'Jump' string is an opponent team named JumpStreet). 'Competition Finalist' is also unverifiable: no standings or finals log is committed. This page leads with the verified 381-match ledger instead. See VERIFICATION.md section 4.",
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: "harbor",
    title: "HARBOR",
    kind: "Applied ML · Carnegie Mellon",
    tier: "secondary",
    category: "applied-ml",
    start: "Jan 2026",
    end: "Present",
    sortKey: "2026-01-02",
    status: "active",

    description:
      "Predicted depression severity from 50+ passive phone-sensor features across 218 students. Splitting the data by participant rather than by observation made the published benchmark numbers fall apart, and a LoRA fine-tune of MedGemma-27B did not rescue them. Reported as a negative result.",

    note: "The whole project is an argument about a train/test split. Papers in this area routinely put the same participant's Tuesday in training and their Thursday in test, so a model can score well by recognising individuals rather than learning anything about depression. The published numbers are real, they just do not mean what they appear to.",

    metrics: [
      { value: "218", label: "Participants" },
      { value: "35K+", label: "Observations" },
      { value: "50+", label: "Sensor features" },
    ],

    stack: ["Python", "XGBoost", "scikit-learn", "PyTorch", "LoRA", "MedGemma"],
    links: [],

    caveats:
      "ZERO public footprint: no repo, no writeup, nothing findable across seven searches. Everything here comes from the resume and is unverified. To keep it, supply a public or redacted repo, a short PDF, or the participant-disjoint vs. random-split comparison. Confirm the dataset name and any IRB restriction before publishing the 218/35K counts. See VERIFICATION.md section 6.",
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: "pa-broadband-inequality",
    title: "Broadband inequality map",
    kind: "Data · Carnegie Mellon",
    tier: "secondary",
    category: "data",
    start: "Apr 2026",
    end: "Apr 2026",
    sortKey: "2026-04-01",
    status: "shipped",

    description:
      "Joined 70,105 Ookla speed-test tiles to Census demographics across 1,410 Pennsylvania ZIP areas, then modelled measured speed against 14 demographic features to see whether slow service tracks income and race rather than terrain. Served as a Streamlit dashboard.",

    metrics: [
      { value: "1,410", label: "ZIP areas measured" },
      { value: "70,105", label: "Speed-test tiles joined" },
      { value: "14", label: "Model features" },
    ],

    stack: ["Python", "Streamlit", "GeoPandas", "XGBoost", "Plotly"],

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
      "BLOCKING. The repo's 'FCC coverage' layer is SYNTHETIC: _generate_fcc_estimates() seeds np.random.seed(42) and derives advertised speed as measured speed times a random multiplier, so the 'FCC vs Reality' page compares measured speeds against a random multiple of themselves. The random provider_count is also the #3 model feature. This page claims only the Ookla and Census work. metrics.json is not committed so R2=0.27 is not shown, and the artifacts say 217 Mbps statewide median while Proposal.md says 105. Rotate the committed Census API key. See VERIFICATION.md section 5.",
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: "claude-session-manager",
    title: "Session chainer",
    kind: "Tools · Independent",
    tier: "secondary",
    category: "tools",
    start: "Apr 2026",
    end: "Apr 2026",
    sortKey: "2026-04-05",
    status: "shipped",

    description:
      "Wrote a macOS daemon that opens each five-hour Claude usage window the moment it becomes available, including overnight, so the windows chain from 5am instead of starting whenever you happen to sit down. 582 lines of standard library, no dependencies.",

    note: "All of the value is in the boundary conditions. It has to be idempotent across sleep and wake, must not double-fire when you opened Claude before the timer did, and has to survive a laptop closed across a window boundary. A wrong assumption about session start silently burns a whole window, which is why it ships a verify mode.",

    metrics: [
      { value: "33 / 33", label: "Tests passing", emphasis: true },
      { value: "0", label: "Runtime dependencies" },
      { value: "582", label: "Lines of Python" },
    ],

    stack: ["Python", "launchd", "macOS", "pytest"],

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
      "Repo hygiene before linking: CLAUDE.md is a stale design doc documenting a queue_parser.py that does not exist and claiming an ANTHROPIC_API_KEY is required (it is not). install.sh points at daemon.py while the README describes watcher.py. The queue feature is a stub. None of those claims are repeated here. See VERIFICATION.md section 7.",
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: "cement-demand-forecasting",
    title: "Cement demand forecasting",
    kind: "Applied ML · Brandidea, internship",
    tier: "minor",
    category: "applied-ml",
    start: "Jan 2025",
    end: "May 2025",
    sortKey: "2025-01",
    status: "shipped",

    description:
      "Replaced the Excel workbook a national industry was forecasting demand with. Built the feature pipeline on web scrapers I wrote, trained XGBoost against the analyst baseline, and fed an executive dashboard with a district-level map of India.",

    metrics: [
      { value: "15%", label: "Lower error than the baseline", emphasis: true },
    ],

    stack: ["Python", "XGBoost", "Power BI"],
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
