import { NavLink } from 'react-router-dom';
import { Home, Map as MapIcon, PlusCircle, BarChart3, Trophy, Settings } from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Report', path: '/report', icon: <PlusCircle size={20} /> },
    { name: 'Live Map', path: '/map', icon: <MapIcon size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart3 size={20} /> },
    { name: 'Heroes', path: '/heroes', icon: <Trophy size={20} /> },
    { name: 'Admin', path: '/admin', icon: <Settings size={20} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card mx-4 my-3 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          NagrikAI
        </span>
      </div>
      <div className="hidden md:flex gap-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                isActive ? 'text-primary' : 'text-textSecondary'
              )
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
