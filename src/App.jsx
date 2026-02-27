import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CommandPalette from './components/CommandPalette';
import HomePage from './pages/HomePage';
import TrendsPage from './pages/TrendsPage';
import PathwaysPage from './pages/PathwaysPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import ToolsPage from './pages/ToolsPage';
import CommunityPage from './pages/CommunityPage';

const routes = [
  { key: 'home', label: 'Home', path: '#/' },
  { key: 'trends', label: 'Trends & Insights', path: '#/trends' },
  { key: 'pathways', label: 'Skills & Pathways', path: '#/pathways' },
  { key: 'opportunities', label: 'Jobs & Economy', path: '#/opportunities' },
  { key: 'tools', label: 'Tools', path: '#/tools' },
  { key: 'community', label: 'Community', path: '#/community' }
];

const routeToPage = (hash) => {
  const value = hash.replace('#', '') || '/';
  if (value === '/') return 'home';
  if (value.startsWith('/trends')) return 'trends';
  if (value.startsWith('/pathways')) return 'pathways';
  if (value.startsWith('/opportunities')) return 'opportunities';
  if (value.startsWith('/tools')) return 'tools';
  if (value.startsWith('/community')) return 'community';
  return 'home';
};

export default function App() {
  const [currentPage, setCurrentPage] = useState(routeToPage(window.location.hash));
  const [openPalette, setOpenPalette] = useState(false);

  useEffect(() => {
    const onHashChange = () => setCurrentPage(routeToPage(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    if (!window.location.hash) {
      window.location.hash = '#/';
    }
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const onKeydown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpenPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, []);

  const commandItems = useMemo(
    () => routes.map((route) => ({
      id: route.key,
      title: route.label,
      action: () => {
        window.location.hash = route.path;
        setOpenPalette(false);
      }
    })),
    []
  );

  return (
    <div className="app-shell">
      <Navbar routes={routes} currentPage={currentPage} onCommandOpen={() => setOpenPalette(true)} />
      <main>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'trends' && <TrendsPage />}
        {currentPage === 'pathways' && <PathwaysPage />}
        {currentPage === 'opportunities' && <OpportunitiesPage />}
        {currentPage === 'tools' && <ToolsPage />}
        {currentPage === 'community' && <CommunityPage />}
      </main>
      <Footer />
      <CommandPalette
        isOpen={openPalette}
        items={commandItems}
        onClose={() => setOpenPalette(false)}
      />
    </div>
  );
}
