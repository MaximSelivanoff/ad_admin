import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Home, Layers, ShieldAlert } from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/references', label: 'References', icon: Layers },
  { to: '/audit', label: 'Audit Log', icon: ShieldAlert }
];

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white border-r shadow-sm fixed top-0 left-0 z-30">
      <div className="px-4 py-1 border-b flex items-center gap-3">
        <img src="/logo.svg" alt="AD Admin Logo" className="w-10 h-10" />
        <div>
          <h1 className="text-lg font-bold text-gray-800">AD Admin</h1>
          <p className="text-xs text-gray-500">Enterprise ITSM</p>
        </div>
      </div>

      <nav className="mt-4 space-y-1 px-2">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-blue-50 text-blue-800' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
