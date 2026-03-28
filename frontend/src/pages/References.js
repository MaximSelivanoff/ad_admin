import React, { useEffect, useState } from 'react';
import { referencesAPI } from '../services/api';
import { Edit2, Trash2, Plus, X } from 'lucide-react';

const References = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [locations, setLocations] = useState([]);
  
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', description: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      const [dept, loc, role] = await Promise.all([
        referencesAPI.getDepartments(),
        referencesAPI.getLocations(),
        referencesAPI.getRoles()
      ]);
      setDepartments(dept.data);
      setLocations(loc.data);
      setRoles(role.data);
    } catch (error) {
      setError('Failed to load references');
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({ name: '', code: '', description: '', address: '' });
    setEditingItem(null);
    setShowForm(false);
    setError('');
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowForm(true);
    setError('');
  };

  const handleSave = async () => {
    if (!formData.name || !formData.code) {
      setError('Name and code are required');
      return;
    }

    try {
      const data = { name: formData.name, code: formData.code };
      if (formData.description) data.description = formData.description;
      if (activeTab === 'locations' && formData.address) data.address = formData.address;

      if (editingItem) {
        if (activeTab === 'departments') {
          await referencesAPI.updateDepartment(editingItem.id, data);
        } else if (activeTab === 'locations') {
          await referencesAPI.updateLocation(editingItem.id, data);
        } else if (activeTab === 'roles') {
          await referencesAPI.updateRole(editingItem.id, data);
        }
        setSuccess('Item updated successfully');
      } else {
        if (activeTab === 'departments') {
          await referencesAPI.createDepartment(data);
        } else if (activeTab === 'locations') {
          await referencesAPI.createLocation(data);
        } else if (activeTab === 'roles') {
          await referencesAPI.createRole(data);
        }
        setSuccess('Item created successfully');
      }

      await loadData();
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete ${item.name}?`)) return;

    try {
      if (activeTab === 'departments') {
        await referencesAPI.deleteDepartment(item.id);
      } else if (activeTab === 'locations') {
        await referencesAPI.deleteLocation(item.id);
      } else if (activeTab === 'roles') {
        await referencesAPI.deleteRole(item.id);
      }
      setSuccess('Item deleted successfully');
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Delete failed');
    }
  };

  const currentData = 
    activeTab === 'departments' ? departments :
    activeTab === 'locations' ? locations :
    roles;

  return (
    <div className="p-4 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">References Management</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        {['departments', 'locations', 'roles'].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); resetForm(); }}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Table */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          <div className="bg-white border rounded-md shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Code</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{item.name}</td>
                      <td className="px-4 py-2 text-gray-600">{item.code}</td>
                      <td className="px-4 py-2 text-gray-600 text-xs max-w-xs truncate">
                        {item.description || '-'}
                      </td>
                      <td className="px-4 py-2 text-center flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="lg:col-span-1 bg-white border rounded-md shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">
                {editingItem ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
              </h3>
              <button
                onClick={resetForm}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Engineering"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., ENG"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional description"
                  rows="2"
                />
              </div>

              {activeTab === 'locations' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 123 Main St"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default References;
