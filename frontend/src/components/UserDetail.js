import React from 'react';
import { X, Mail, Phone, Building, MapPin, User, Calendar } from 'lucide-react';

const UserDetail = ({ user, references, onClose }) => {
  const getDepartmentName = (id) => {
    const dept = references.departments.find(d => d.id === id);
    return dept ? dept.name : '-';
  };

  const getLocationName = (id) => {
    const loc = references.locations.find(l => l.id === id);
    return loc ? loc.name : '-';
  };

  const getRoleName = (id) => {
    const role = references.roles.find(r => r.id === id);
    return role ? role.name : '-';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">User Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header with Name */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-gray-600">@{user.username}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                user.status === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user.status}
              </span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Mail className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{user.phone || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Organization Information */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Organization</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Building className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium text-gray-900">{getDepartmentName(user.departmentId)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{getLocationName(user.locationId)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Work Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Position</p>
                <p className="font-medium text-gray-900">{user.position || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded font-medium">
                  {getRoleName(user.roleId)}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(user.createdAt || user.updatedAt) && (
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-900">System Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Created</p>
                  <p className="text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Last Updated</p>
                  <p className="text-gray-900">
                    {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '-'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
