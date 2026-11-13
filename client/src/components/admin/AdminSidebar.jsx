import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-white text-xl font-bold">Admin Panel</span>
      </div>
      <nav className="mt-8">
        <div className="px-4 py-2 text-gray-400 text-sm font-medium uppercase tracking-wider">
          Navigation
        </div>
        {[
          { to: '/admin', label: 'Dashboard', end: true },
          { to: '/admin/users', label: 'Users' },
          { to: '/admin/campaigns', label: 'Campaigns' },
          { to: '/admin/resources', label: 'Resources' },
          { to: '/admin/agencies', label: 'Agencies' },
          { to: '/admin/audit-logs', label: 'Audit Logs' },
        ].map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) => (
              `block px-4 py-2 text-gray-300 hover:bg-gray-700 ${isActive ? 'bg-gray-700 text-white' : ''}`
            )}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;