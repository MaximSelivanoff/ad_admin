import React, { useState, useEffect } from 'react';
import { usersAPI, referencesAPI } from '../services/api';
import { Search, Plus, Edit2, Trash2, Filter, X } from 'lucide-react';
import UserForm from '../components/UserForm';
import Pagination from '../components/Pagination';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: '', roleId: '', departmentId: '' });
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [references, setReferences] = useState({ departments: [], locations: [], roles: [] });

  useEffect(() => {
    loadReferences();
  }, []);

  useEffect(() => {
    loadUsers(1, limit);
  }, [searchTerm, filters]);

  const loadUsers = async (pageNum = page, limitNum = limit) => {
    setLoading(true);
    try {
      const response = await usersAPI.getAll(pageNum, limitNum, { search: searchTerm, ...filters });
      setUsers(response.data.data);
      setPagination(response.data.pagination);
      setPage(pageNum);
      setLimit(limitNum);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReferences = async () => {
    try {
      const [dept, loc, roles] = await Promise.all([
        referencesAPI.getDepartments(),
        referencesAPI.getLocations(),
        referencesAPI.getRoles()
      ]);
      setReferences({ departments: dept.data, locations: loc.data, roles: roles.data });
    } catch (error) {
      console.error('Failed to load references:', error);
    }
  };

  const handleCreate = async (userData) => {
    try {
      await usersAPI.create(userData);
      setShowForm(false);
      loadUsers(1, limit);
    } catch (error) {
      alert('Failed to create user: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleUpdate = async (userData) => {
    try {
      await usersAPI.update(editingUser.id, userData);
      setEditingUser(null);
      setShowForm(false);
      loadUsers(page, limit);
    } catch (error) {
      alert('Failed to update user: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить пользователя?')) return;

    try {
      await usersAPI.delete(id);
      if (selectedUser?.id === id) setSelectedUser(null);
      loadUsers(page, limit);
    } catch (error) {
      alert('Failed to delete user: ' + (error.response?.data?.error || error.message));
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
  };

  const getLocation = (id) => references.locations.find((loc) => loc.id === id)?.name || '-';
  const getDepartment = (id) => references.departments.find((d) => d.id === id)?.name || '-';
  const getRole = (id) => references.roles.find((r) => r.id === id)?.name || '-';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-[calc(100vh-80px)] overflow-hidden">
      {/* Table */}
      <div className="lg:col-span-2 flex flex-col min-h-0">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>
          <button
            onClick={() => {
              setEditingUser(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-md text-sm"
          >
            <Plus size={16} /> Add User
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-3 mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <Search size={16} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search name, email, username, position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm px-2 py-1 border border-gray-300 rounded"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="text-sm px-2 py-1 border border-gray-300 rounded"
            >
              <option value="">All status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={filters.departmentId}
              onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
              className="text-sm px-2 py-1 border border-gray-300 rounded"
            >
              <option value="">All departments</option>
              {references.departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <select
              value={filters.roleId}
              onChange={(e) => setFilters({ ...filters, roleId: e.target.value })}
              className="text-sm px-2 py-1 border border-gray-300 rounded"
            >
              <option value="">All roles</option>
              {references.roles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-8 text-gray-600">Loading...</div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="overflow-auto flex-1">
              <table className="w-full text-xs md:text-sm">
                <thead className="bg-gray-50 text-gray-700 uppercase sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left">User</th>
                    <th className="px-3 py-2 text-left">Email</th>
                    <th className="px-3 py-2 text-left">Department</th>
                    <th className="px-3 py-2 text-left">Role</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Last login</th>
                    <th className="px-3 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan="7" className="p-4 text-center text-gray-500">No users found</td></tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="border-t hover:bg-gray-50">
                        <td className="px-3 py-2 cursor-pointer" onClick={() => selectUser(user)}>
                          <div className="flex items-center gap-2">
                            <img src={user.avatar || `https://i.pravatar.cc/24?u=${user.username}`} alt="avatar" className="w-5 h-5 rounded-full" />
                            <div className="leading-tight">
                              <div className="font-medium text-gray-800 truncate">{user.firstName} {user.lastName}</div>
                              <div className="text-gray-500 text-xs">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 truncate text-xs">{user.email}</td>
                        <td className="px-3 py-2 text-xs">{getDepartment(user.departmentId)}</td>
                        <td className="px-3 py-2 text-xs">{getRole(user.roleId)}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-600">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : '—'}</td>
                        <td className="px-3 py-2 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => selectUser(user)}
                              className="p-1 rounded hover:bg-gray-200 text-blue-600"
                              title="View"
                            ><Filter size={14} /></button>
                            <button
                              onClick={() => { setEditingUser(user); setShowForm(true); }}
                              className="p-1 rounded hover:bg-gray-200 text-indigo-600"
                              title="Edit"
                            ><Edit2 size={14} /></button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-1 rounded hover:bg-gray-200 text-red-600"
                              title="Delete"
                            ><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              page={page}
              totalPages={pagination.totalPages}
              limit={limit}
              total={pagination.total}
              onPageChange={(p) => loadUsers(p, limit)}
              onLimitChange={(l) => loadUsers(1, l)}
            />
          </div>
        )}
      </div>

      {/* Details Panel */}
      {selectedUser && (
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4 pb-4 border-b">
            <h2 className="font-semibold text-gray-800">User Details</h2>
            <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4 text-sm overflow-y-auto flex-1">
            <div className="flex items-center gap-3 pb-4 border-b">
              <img src={selectedUser.avatar || `https://i.pravatar.cc/64?u=${selectedUser.username}`} className="w-12 h-12 rounded-full" alt="Avatar" />
              <div>
                <h3 className="font-bold text-gray-800">{selectedUser.firstName} {selectedUser.lastName}</h3>
                <div className="text-gray-500 text-xs">@{selectedUser.username}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase">Email</label>
                <p className="text-gray-900 mt-1">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase">Phone</label>
                <p className="text-gray-900 mt-1">{selectedUser.phone || '—'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase">Position</label>
                <p className="text-gray-900 mt-1">{selectedUser.position || '—'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase">Department</label>
                <p className="text-gray-900 mt-1">{getDepartment(selectedUser.departmentId)}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase">Location</label>
                <p className="text-gray-900 mt-1">{getLocation(selectedUser.locationId)}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase">Role</label>
                <p className="text-gray-900 mt-1">{getRole(selectedUser.roleId)}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase">Status</label>
                <p className={`mt-1 inline-block px-2 py-0.5 rounded text-xs font-medium ${selectedUser.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {selectedUser.status}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase">Last Login</label>
                <p className="text-gray-900 mt-1">{selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : '—'}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold text-gray-700 mb-2">Actions</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => { setEditingUser(selectedUser); setShowForm(true); }}
                  className="w-full px-2 py-1 text-xs border rounded bg-gray-50 hover:bg-gray-100 font-medium"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={() => handleDelete(selectedUser.id)}
                  className="w-full px-2 py-1 text-xs border rounded bg-red-50 hover:bg-red-100 text-red-700 font-medium"
                >
                  Mark as Deleted
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <UserForm
          user={editingUser}
          references={references}
          onSubmit={editingUser ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditingUser(null); }}
        />
      )}
    </div>
  );
};

export default Users;

