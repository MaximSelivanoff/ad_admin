import React, { useState, useEffect } from 'react';
import { metricsAPI } from '../services/api';
import { Users, Building, MapPin, Shield, UserCheck, UserMinus } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    adminUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await metricsAPI.get();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`bg-white rounded-md border px-4 py-3 shadow-sm ${color}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <Icon size={26} className="text-gray-400" />
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>

      {loading ? (
        <div className="text-sm text-gray-600">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total users" value={stats.totalUsers} icon={Users} color="" />
          <StatCard label="Active users" value={stats.activeUsers} icon={UserCheck} color="" />
          <StatCard label="Inactive users" value={stats.inactiveUsers} icon={UserMinus} color="" />
          <StatCard label="Admin users" value={stats.adminCount} icon={Shield} color="" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <a href="/users" className="p-4 bg-white rounded-md shadow-sm border hover:shadow-md">
          <div className="flex items-center gap-2 text-blue-600 font-semibold">Manage Users</div>
          <p className="text-xs text-gray-600 mt-1">Create/edit/delete users and manage assignments.</p>
        </a>
        <a href="/references" className="p-4 bg-white rounded-md shadow-sm border hover:shadow-md">
          <div className="flex items-center gap-2 text-green-600 font-semibold">Manage Departments & Roles</div>
          <p className="text-xs text-gray-600 mt-1">Maintain master data for organization structure.</p>
        </a>
        <a href="/audit" className="p-4 bg-white rounded-md shadow-sm border hover:shadow-md">
          <div className="flex items-center gap-2 text-purple-600 font-semibold">View Audit Activity</div>
          <p className="text-xs text-gray-600 mt-1">Audit logs for compliance and security investigations.</p>
        </a>
      </div>
    </div>
  );
};

export default Dashboard;

