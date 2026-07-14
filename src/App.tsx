import { Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { Nav } from './components/Nav';
import { Landing } from './pages/Landing';
import { Resume } from './pages/Resume';
import { Snake } from './pages/Snake';
import { Minesweeper } from './pages/Minesweeper';
import { FindTheCat } from './pages/FindTheCat';
import { Connect4 } from './pages/Connect4';

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <div className="page">
      <Nav theme={theme} onToggle={toggle} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/ops" element={<Resume mode="ops" />} />
        <Route path="/engineering" element={<Resume mode="engineering" />} />
		<Route path="/games/find-the-cat" element={<FindTheCat />} />
        <Route path="/games/snake" element={<Snake />} />
		<Route path="/games/minesweeper" element={<Minesweeper />} />
		<Route path="/games/connect4" element={<Connect4 />} />
      </Routes>
    </div>
  );
}
