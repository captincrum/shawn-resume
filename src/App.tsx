import { Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Experience } from './components/Experience';
import { Achievements } from './components/Achievements';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Footer } from './components/Footer';
import { Snake } from './pages/Snake';
import { Minesweeper } from './pages/Minesweeper';
import { FindTheCat } from './pages/FindTheCat';
import { Connect4 } from './pages/Connect4';

function Home() {
  return (
    <>
      <Hero />
      <main className="content">
        <Experience />
        <Achievements />
        <Projects />
        <Skills />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <div className="page">
      <Nav theme={theme} onToggle={toggle} />
      <Routes>
        <Route path="/" element={<Home />} />
		<Route path="/games/find-the-cat" element={<FindTheCat />} />
        <Route path="/games/snake" element={<Snake />} />
		<Route path="/games/minesweeper" element={<Minesweeper />} />
		<Route path="/games/connect4" element={<Connect4 />} />
      </Routes>
    </div>
  );
}
