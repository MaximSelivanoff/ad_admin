import React, { useState, useMemo, useCallback } from 'react';
import { Search, Filter, ChevronDown, ChevronRight, User, Mail, Phone, Building, MapPin, Calendar, Edit3, Trash2, Plus, Eye } from 'lucide-react';

const App = () => {
  // Mock data for departments and users
  const departments = [
    { id: 'it', name: 'IT Department', count: 156 },
    { id: 'support', name: 'Technical Support', count: 89 },
    { id: 'dev', name: 'Development', count: 234 },
    { id: 'ops', name: 'Operations', count: 67 },
    { id: 'security', name: 'Security', count: 45 },
    { id: 'network', name: 'Network Team', count: 32 },
    { id: 'db', name: 'Database Admins', count: 18 },
    { id: 'cloud', name: 'Cloud Infrastructure', count: 56 },
  ];

  const mockUsers = [
    { id: 1, name: 'Alex Johnson', email: 'alex.johnson@company.com', phone: '+1-555-0123', department: 'it', position: 'IT Manager', location: 'New York', status: 'active', lastLogin: '2024-01-15', role: 'admin' },
    { id: 2, name: 'Sarah Miller', email: 'sarah.miller@company.com', phone: '+1-555-0124', department: 'support', position: 'Senior Support Engineer', location: 'Chicago', status: 'active', lastLogin: '2024-01-16', role: 'user' },
    { id: 3, name: 'Mike Chen', email: 'mike.chen@company.com', phone: '+1-555-0125', department: 'dev', position: 'Lead Developer', location: 'San Francisco', status: 'active', lastLogin: '2024-01-14', role: 'developer' },
    { id: 4, name: 'Emma Davis', email: 'emma.davis@company.com', phone: '+1-555-0126', department: 'ops', position: 'Operations Manager', location: 'Boston', status: 'inactive', lastLogin: '2024-01-10', role: 'manager' },
    { id: 5, name: 'David Wilson', email: 'david.wilson@company.com', phone: '+1-555-0127', department: 'security', position: 'Security Analyst', location: 'Austin', status: 'active', lastLogin: '2024-01-16', role: 'security' },
    { id: 6, name: 'Lisa Thompson', email: 'lisa.thompson@company.com', phone: '+1-555-0128', department: 'network', position: 'Network Engineer', location: 'Seattle', status: 'active', lastLogin: '2024-01-15', role: 'engineer' },
    { id: 7, name: 'Robert Brown', email: 'robert.brown@company.com', phone: '+1-555-0129', department: 'db', position: 'Database Administrator', location: 'Denver', status: 'active', lastLogin: '2024-01-13', role: 'dba' },
    { id: 8, name: 'Jennifer Lee', email: 'jennifer.lee@company.com', phone: '+1-555-0130', department: 'cloud', position: 'Cloud Architect', location: 'Miami', status: 'active', lastLogin: '2024-01-16', role: 'architect' },
  ];

  // State management
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    role: 'all'
  });
  const [columnWidths, setColumnWidths] = useState({
    name: 180,
    email: 200,
    department: 100,
    position: 160,
    location: 80,
    role: 80,
    status: 60,
    lastLogin: 80,
    actions: 100
  });

  // Filter users based on selections
  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment;
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filters.status === 'all' || user.status === filters.status;
      const matchesRole = filters.role === 'all' || user.role === filters.role;
      
      return matchesDepartment && matchesSearch && matchesStatus && matchesRole;
    });
  }, [selectedDepartment, searchTerm, filters]);

  // Handle column resize
  const handleResize = useCallback((column, delta) => {
    setColumnWidths(prev => ({
      ...prev,
      [column]: Math.max(60, prev[column] + delta)
    }));
  }, []);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-1 py-0.5 rounded text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status === 'active' ? 'Active' : 'Inactive'}
      </span>
    );
  };

  // Role badge component
  const RoleBadge = ({ role }) => {
    const roleLabels = {
      admin: 'Admin',
      user: 'User',
      developer: 'Dev',
      manager: 'Mgr',
      security: 'Sec',
      engineer: 'Eng',
      dba: 'DBA',
      architect: 'Arch'
    };
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      user: 'bg-gray-100 text-gray-800',
      developer: 'bg-green-100 text-green-800',
      manager: 'bg-blue-100 text-blue-800',
      security: 'bg-red-100 text-red-800',
      engineer: 'bg-yellow-100 text-yellow-800',
      dba: 'bg-indigo-100 text-indigo-800',
      architect: 'bg-teal-100 text-teal-800'
    };
    return (
      <span className={`px-1 py-0.5 ${colors[role] || 'bg-gray-100 text-gray-800'} rounded text-xs font-medium`}>
        {roleLabels[role] || role}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Departments */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-2 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900 mb-2">Departments</h2>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
            <input
              type="text"
              placeholder="Search departments..."
              className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="px-2 py-1">
            <button
              onClick={() => setSelectedDepartment('all')}
              className={`w-full text-left px-2 py-1 rounded text-xs font-medium transition-colors ${
                selectedDepartment === 'all' 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>All Departments</span>
                <span className="bg-gray-200 text-gray-700 px-1 py-0.5 rounded text-xs">
                  {mockUsers.length}
                </span>
              </div>
            </button>
          </div>
          
          <div className="space-y-0.5 px-1">
            {departments.map(dept => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`w-full text-left px-2 py-1 rounded text-xs font-medium transition-colors flex items-center ${
                  selectedDepartment === dept.id 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Building className="w-3 h-3 mr-2 text-gray-500" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{dept.name}</div>
                  <div className="text-xs text-gray-500">{dept.count} users</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-2">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-bold text-gray-900">User Management</h1>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors text-xs">
              <Plus className="w-3 h-3" />
              Add User
            </button>
          </div>
          
          {/* Search and Filters */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users by name, email, or position..."
                className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-1">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <select
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="developer">Developer</option>
                <option value="manager">Manager</option>
                <option value="security">Security</option>
                <option value="engineer">Engineer</option>
                <option value="dba">DBA</option>
                <option value="architect">Architect</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="flex-1 overflow-hidden bg-white">
          <div className="h-full overflow-auto">
            <table className="w-full min-w-full">
              <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
                <tr>
                  {[
                    { key: 'name', label: 'Name', icon: User },
                    { key: 'email', label: 'Email', icon: Mail },
                    { key: 'department', label: 'Department', icon: Building },
                    { key: 'position', label: 'Position' },
                    { key: 'location', label: 'Location', icon: MapPin },
                    { key: 'role', label: 'Role' },
                    { key: 'status', label: 'Status' },
                    { key: 'lastLogin', label: 'Last Login', icon: Calendar },
                    { key: 'actions', label: 'Actions' }
                  ].map(({ key, label, icon: Icon }) => (
                    <th 
                      key={key} 
                      className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{ width: columnWidths[key] }}
                    >
                      <div className="flex items-center gap-1">
                        {Icon && <Icon className="w-2.5 h-2.5" />}
                        {label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr 
                    key={user.id} 
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedUser?.id === user.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="px-2 py-1.5 whitespace-nowrap" style={{ width: columnWidths.name }}>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-blue-600" />
                        </div>
                        <div className="ml-2">
                          <div className="text-xs font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-1.5 whitespace-nowrap" style={{ width: columnWidths.email }}>
                      <div className="text-xs text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-2 py-1.5 whitespace-nowrap" style={{ width: columnWidths.department }}>
                      <div className="text-xs text-gray-900 capitalize">{user.department}</div>
                    </td>
                    <td className="px-2 py-1.5 whitespace-nowrap" style={{ width: columnWidths.position }}>
                      <div className="text-xs text-gray-900">{user.position}</div>
                    </td>
                    <td className="px-2 py-1.5 whitespace-nowrap" style={{ width: columnWidths.location }}>
                      <div className="text-xs text-gray-900">{user.location}</div>
                    </td>
                    <td className="px-2 py-1.5 whitespace-nowrap" style={{ width: columnWidths.role }}>
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-2 py-1.5 whitespace-nowrap" style={{ width: columnWidths.status }}>
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-2 py-1.5 whitespace-nowrap" style={{ width: columnWidths.lastLogin }}>
                      <div className="text-xs text-gray-900">{user.lastLogin}</div>
                    </td>
                    <td className="px-2 py-1.5 whitespace-nowrap" style={{ width: columnWidths.actions }}>
                      <div className="flex gap-1">
                        <button className="p-0.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button className="p-0.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <button className="p-0.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                          <Eye className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-6 text-gray-500 text-xs">
                No users found matching your criteria
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Detail Panel */}
      {selectedUser && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">User Details</h3>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">{selectedUser.name}</h4>
                <p className="text-gray-600 text-xs">{selectedUser.position}</p>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-900">{selectedUser.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-900">{selectedUser.phone}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Building className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-900 capitalize">{selectedUser.department}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-900">{selectedUser.location}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 text-gray-500">👤</span>
                <RoleBadge role={selectedUser.role} />
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-900">Last login: {selectedUser.lastLogin}</span>
              </div>
              
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-700">Status:</span>
                  <StatusBadge status={selectedUser.status} />
                </div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-gray-200">
              <h5 className="font-medium text-gray-900 mb-1 text-xs">Quick Actions</h5>
              <div className="space-y-1">
                <button className="w-full text-left px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors">
                  Edit User Profile
                </button>
                <button className="w-full text-left px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors">
                  Disable Account
                </button>
                <button className="w-full text-left px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded transition-colors">
                  Reset Password
                </button>
                <button className="w-full text-left px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded transition-colors">
                  View Access Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
