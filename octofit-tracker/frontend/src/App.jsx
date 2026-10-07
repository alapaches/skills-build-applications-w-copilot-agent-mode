import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Teams from './components/Teams.jsx';
import Users from './components/Users.jsx';
import Workouts from './components/Workouts.jsx';

const navigation = [
  { path: '/activities', label: 'Activities' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/teams', label: 'Teams' },
  { path: '/users', label: 'Users' },
  { path: '/workouts', label: 'Workouts' },
];

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <nav className="navbar navbar-expand-lg navbar-dark container py-3" aria-label="Main navigation">
          <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/activities">
            <span className="brand-mark" aria-hidden="true">O</span>
            <span>OctoFit <span className="brand-light">Tracker</span></span>
          </NavLink>
          <div className="navbar-nav ms-lg-auto flex-row flex-wrap gap-1">
            {navigation.map(({ path, label }) => (
              <NavLink
                className={({ isActive }) => `nav-link px-3${isActive ? ' active' : ''}`}
                key={path}
                to={path}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="container page-content">
        <Routes>
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/" element={<Navigate replace to="/activities" />} />
          <Route path="*" element={<Navigate replace to="/activities" />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container">Move together. Get stronger together.</div>
      </footer>
    </div>
  );
}

export default App;
