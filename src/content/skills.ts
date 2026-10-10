import { define, skillGroupsSchema } from "./schema";

/**
 * Ordered by demonstrated depth. Things with shipped code behind them come
 * first. Not alphabetical, deliberately.
 */
export const skillGroups = define(
  skillGroupsSchema,
  [
    {
      name: "Languages",
      skills: ["Python", "Go", "Java", "TypeScript", "C++", "SQL", "CUDA"],
    },
    {
      name: "LLM Systems & Serving",
      note: "Inference-time performance and the plumbing around it.",
      skills: [
        "SGLang",
        "vLLM",
        "PyTorch",
        "HuggingFace",
        "CUDA kernels",
        "KV-cache / RadixAttention",
        "LoRA / PEFT",
        "GRPO",
      ],
    },
    {
      name: "Applied LLMs & Agents",
      skills: [
        "Anthropic API",
        "Gemini API",
        "OpenAI API",
        "LangChain (ReAct)",
        "RAG",
        "Tool-use loops",
        "LLM-as-judge evaluation",
        "Modal",
      ],
    },
    {
      name: "Machine Learning",
      skills: [
        "XGBoost",
        "scikit-learn",
        "Random Forests",
        "Fine-tuning",
        "Cross-validation design",
        "SMOTE / class imbalance",
        "Bootstrap CIs & permutation tests",
      ],
    },
    {
      name: "Backend & Orchestration",
      skills: [
        "FastAPI",
        "Spring Boot",
        "Apache Temporal",
        "Redis / ARQ",
        "Postgres",
        "MongoDB",
        "Supabase",
      ],
    },
    {
      name: "Infrastructure",
      skills: [
        "AWS (EKS, Lambda, RDS, Bedrock)",
        "Terraform",
        "GCP",
        "Docker",
        "Kubernetes",
        "Railway",
        "CI/CD",
        "Git",
      ],
    },
  ],
  "content/skills.ts",
);
