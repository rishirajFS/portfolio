import { courseworkClustersSchema, define } from "./schema";

/**
 * Graduate coursework with public implementations. Rendered as a compact,
 * collapsed list. Supporting evidence, not headline work.
 */
export const courseworkClusters = define(
  courseworkClustersSchema,
  [
    {
      id: "llm-systems",
      name: "LLM Systems",
      course: "Large Language Model Systems, CMU",
      language: "Python",
      description:
        "Implementation assignments on the systems side of serving and training language models: kernels, memory, parallelism and throughput.",
      repos: [
        { name: "llmsyshw3", href: "https://github.com/rishirajFS/llmsyshw3" },
        { name: "llmsys_hw3", href: "https://github.com/rishirajFS/llmsys_hw3" },
        {
          name: "llmsyshw_redo",
          href: "https://github.com/rishirajFS/llmsyshw_redo",
        },
        { name: "llmsyshw4", href: "https://github.com/rishirajFS/llmsyshw4" },
      ],
    },
    {
      id: "cloud-computing",
      name: "Cloud Computing",
      course: "Cloud Computing, CMU",
      language: "Java",
      description:
        "Distributed systems built and deployed for real: containerization and Kubernetes orchestration, autoscaling under load, and SQL/NoSQL storage trade-offs at scale.",
      repos: [
        {
          name: "cloud-docker-k8s",
          href: "https://github.com/rishirajFS/cloud-docker-k8s",
        },
        {
          name: "cloud-computing-ELASTICITY",
          href: "https://github.com/rishirajFS/cloud-computing-ELASTICITY",
        },
        {
          name: "cloud-sql-nosql",
          href: "https://github.com/rishirajFS/cloud-sql-nosql",
        },
        { name: "cloud-dock", href: "https://github.com/rishirajFS/cloud-dock" },
        { name: "cloud-hw3", href: "https://github.com/rishirajFS/cloud-hw3" },
      ],
    },
    {
      id: "deep-learning",
      name: "Deep Learning",
      course: "Introduction to Deep Learning (11-785), CMU",
      language: "Python",
      description:
        "Sequence modeling and attention implemented from primitives rather than assembled from library calls.",
      repos: [{ name: "idlhw4", href: "https://github.com/rishirajFS/idlhw4" }],
    },
  ],
  "content/coursework.ts",
);
