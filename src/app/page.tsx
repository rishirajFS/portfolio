import { HomeStage } from "@/components/home/home-stage";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Coursework } from "@/components/sections/coursework";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Research } from "@/components/sections/research";
import { Skills } from "@/components/sections/skills";

/**
 * Home page: screen 2a, then the rest of the world below it.
 *
 * The section order is the argument the site makes: hook, who, track record, the
 * work itself, the research, the tools, ask.
 *
 * <HomeStage> is the one client boundary. It owns the hero, the hotbar and the
 * inventory overlay, because those three share a single piece of state (whether
 * 4a is open). Everything below stays a server component.
 */
export default function HomePage() {
  return (
    <>
      <HomeStage />
      <About />
      <Experience />
      <Projects />
      <Research />
      <Skills />
      <Coursework />
      <Contact />
    </>
  );
}
