import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LocaleContext } from '../contexts/LocaleContext';
import { LogOut, Globe, Key, X } from 'lucide-react';
import { authAPI } from '../services/api';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { locale, setLocale, t } = useContext(LocaleContext);
  const navigate = useNavigate();
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetForm, setResetForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleResetPassword = async () => {
    setResetError('');
    setResetSuccess('');

    if (!resetForm.oldPassword || !resetForm.newPassword || !resetForm.confirmPassword) {
      setResetError('All fields are required');
      return;
    }

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setResetError('New passwords do not match');
      return;
    }

    try {
      await authAPI.resetPassword(
        user.id,
        resetForm.oldPassword,
        resetForm.newPassword,
        resetForm.confirmPassword
      );
      setResetSuccess('Password reset successfully');
      setTimeout(() => {
        setShowResetModal(false);
        setResetForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }, 2000);
    } catch (error) {
      setResetError(error.response?.data?.error || 'Password reset failed');
    }
  };

  return (
    <header className="bg-white border-b shadow-sm ml-64">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-end items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocale(locale === 'en' ? 'ru' : 'en')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
          >
            <Globe size={14} />
            {locale.toUpperCase()}
          </button>

          {user && (
            <>
              <span className="text-sm text-gray-700 font-medium">{user.username}</span>
              <button
                onClick={() => setShowResetModal(true)}
                className="flex items-center gap-1 text-sm text-gray-700 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
                title="Change password"
              >
                <Key size={14} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-gray-700 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                <LogOut size={14} />
                {locale === 'en' ? 'Logout' : 'Выход'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {locale === 'en' ? 'Reset Password' : 'Сброс пароля'}
              </h2>
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setResetForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                  setResetError('');
                  setResetSuccess('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {resetError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {resetError}
              </div>
            )}
            {resetSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                {resetSuccess}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {locale === 'en' ? 'Old Password' : 'Старый пароль'}
                </label>
                <input
                  type="password"
                  value={resetForm.oldPassword}
                  onChange={(e) => setResetForm({ ...resetForm, oldPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {locale === 'en' ? 'New Password' : 'Новый пароль'}
                </label>
                <input
                  type="password"
                  value={resetForm.newPassword}
                  onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {locale === 'en' ? 'Confirm Password' : 'Подтвердите пароль'}
                </label>
                <input
                  type="password"
                  value={resetForm.confirmPassword}
                  onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleResetPassword}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 font-medium"
                >
                  {locale === 'en' ? 'Reset' : 'Сбросить'}
                </button>
                <button
                  onClick={() => {
                    setShowResetModal(false);
                    setResetForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                    setResetError('');
                    setResetSuccess('');
                  }}
                  className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 font-medium"
                >
                  {locale === 'en' ? 'Cancel' : 'Отмена'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
