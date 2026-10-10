import { define, educationsSchema } from "./schema";

export const education = define(
  educationsSchema,
  [
    {
      institution: "Carnegie Mellon University",
      location: "Pittsburgh, PA",
      degree: "M.S. Computational Data Science",
      end: "Dec 2026",
      sortKey: "2026-12",
      expected: true,
      coursework: [
        "Large Language Model Systems",
        "Introduction to Machine Learning",
        "LLMs and Their Applications",
        "AI Agents",
        "Introduction to Deep Learning",
        "Deep Reinforcement Learning and Control",
      ],
    },
    {
      institution: "Vellore Institute of Technology",
      location: "Vellore, India",
      degree: "B.Tech Computer Science Engineering",
      end: "Jun 2025",
      sortKey: "2025-06",
      expected: false,
      coursework: [
        "Design and Analysis of Algorithms",
        "Artificial Intelligence",
        "Big Data Analytics",
      ],
    },
  ],
  "content/education.ts",
);
