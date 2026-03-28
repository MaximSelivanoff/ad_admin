import React, { useState, useEffect } from 'react';
import { usersAPI, referencesAPI } from '../services/api';
import { Search, Plus, Edit2, Trash2, X, Download } from 'lucide-react';
import DataTable from '../components/DataTable';
import UserForm from '../components/UserForm';
import { exportToExcel } from '../utils/excelExporter';

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

  // Конфигурация колонок для таблицы
  const columns = [
    {
      key: 'user',
      label: 'User',
      sortable: false,
      formatter: (row) => (
        <div className="flex items-center gap-2">
          <img src={row.avatar || `https://i.pravatar.cc/24?u=${row.username}`} alt="avatar" className="w-5 h-5 rounded-full" />
          <div className="leading-tight">
            <div className="font-medium text-gray-800 truncate">{row.firstName} {row.lastName}</div>
            <div className="text-gray-500 text-xs">@{row.username}</div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      formatter: (row) => <span className="truncate text-xs">{row.email}</span>
    },
    {
      key: 'departmentId',
      label: 'Department',
      sortable: true,
      formatter: (row) => <span className="text-xs">{getDepartment(row.departmentId)}</span>
    },
    {
      key: 'roleId',
      label: 'Role',
      sortable: true,
      formatter: (row) => <span className="text-xs">{getRole(row.roleId)}</span>
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      formatter: (row) => (
        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${row.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'lastLoginAt',
      label: 'Last login',
      sortable: true,
      formatter: (row) =>row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleDateString() : '—'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-[calc(100vh-80px)] overflow-hidden">
      {/* Table */}
      <div className="lg:col-span-2 flex flex-col min-h-0">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>
          <div className="flex gap-2">
            <button
              onClick={() => exportToExcel('Users', columns, users)}
              className="inline-flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 px-3 py-1.5 rounded-md text-sm"
            >
              <Download size={16} /> Export
            </button>
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

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          selectedRow={selectedUser}
          onRowClick={selectUser}
          onRowAction={handleDelete}
          pagination={pagination}
          onPageChange={(p) => loadUsers(p, limit)}
          onLimitChange={(l) => loadUsers(1, l)}
          page={page}
          limit={limit}
          emptyMessage="No users found"
        />
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

          <div className="overflow-y-auto flex-1">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b">
              <img src={selectedUser.avatar || `https://i.pravatar.cc/64?u=${selectedUser.username}`} className="w-12 h-12 rounded-full" alt="Avatar" />
              <div>
                <h3 className="font-bold text-gray-800">{selectedUser.firstName} {selectedUser.lastName}</h3>
                <div className="text-gray-500 text-xs">@{selectedUser.username}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 text-xs">
              <div className="grid grid-cols-3 gap-2 pb-2 border-b">
                <span className="font-semibold text-gray-700">Email</span>
                <span className="col-span-2 text-gray-900">{selectedUser.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pb-2 border-b">
                <span className="font-semibold text-gray-700">Phone</span>
                <span className="col-span-2 text-gray-900">{selectedUser.phone || '—'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pb-2 border-b">
                <span className="font-semibold text-gray-700">Position</span>
                <span className="col-span-2 text-gray-900">{selectedUser.position || '—'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pb-2 border-b">
                <span className="font-semibold text-gray-700">Department</span>
                <span className="col-span-2 text-gray-900">{getDepartment(selectedUser.departmentId)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pb-2 border-b">
                <span className="font-semibold text-gray-700">Location</span>
                <span className="col-span-2 text-gray-900">{getLocation(selectedUser.locationId)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pb-2 border-b">
                <span className="font-semibold text-gray-700">Role</span>
                <span className="col-span-2 text-gray-900">{getRole(selectedUser.roleId)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pb-2 border-b">
                <span className="font-semibold text-gray-700">Status</span>
                <span className={`col-span-2 inline-block px-2 py-0.5 rounded text-xs font-medium w-fit ${selectedUser.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {selectedUser.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pb-2 border-b">
                <span className="font-semibold text-gray-700">Last Login</span>
                <span className="col-span-2 text-gray-900">{selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : '—'}</span>
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

