import { useEffect } from 'react';
import { resumes, person } from '../data/resume';
import type { ResumeMode } from '../data/resume';
import { Hero } from '../components/Hero';
import { Experience } from '../components/Experience';
import { Achievements } from '../components/Achievements';
import { Projects } from '../components/Projects';
import { Skills } from '../components/Skills';
import { Footer } from '../components/Footer';
import { ResumeSwitcher } from '../components/ResumeSwitcher';

export function Resume({ mode }: { mode: ResumeMode }) {
  const data = resumes[mode];
  useEffect(() => {
    document.title = `${person.name} — ${data.profile.title}`;
  }, [mode, data.profile.title]);
  return (
    <>
      <Hero profile={data.profile} />
      <main className="content">
        <ResumeSwitcher current={mode} />
        <Experience roles={data.experience} />
        <Achievements items={data.achievements} />
        <Projects items={data.projects} />
        <Skills groups={data.skills} />
      </main>
      <Footer />
    </>
  );
}