import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  FileCheck2,
  UserCheck,
  PlusCircle,
  History,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const role = user?.role;

  const getAdminItems = () => [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
    { id: 'donors', label: 'Donors', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'requests', label: 'Requests', icon: FileCheck2 },
  ];

  const getDonorItems = () => [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: UserCheck },
    { id: 'history', label: 'Donations', icon: History },
  ];

  const getHospitalItems = () => [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'new-request', label: 'Request Blood', icon: PlusCircle },
    { id: 'my-requests', label: 'Track Requests', icon: Activity },
  ];

  const navItems =
    role === 'ADMIN'
      ? getAdminItems()
      : role === 'DONOR'
      ? getDonorItems()
      : getHospitalItems();

  return (
    <aside className="w-full md:w-56 bg-white border border-gray-200 rounded-lg p-3 shrink-0 shadow-sm">
      <div className="mb-3 px-2">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Portal • <span className="text-gray-900 font-extrabold">{role}</span>
        </p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold transition-colors text-left ${
                isActive
                  ? 'bg-red-600 text-white'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
