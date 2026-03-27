import React, { useState } from 'react';
import { 
  Users, 
  Settings, 
  Shield, 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Building,
  Filter,
  Download,
  MoreVertical
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for users
  const users = [
    {
      id: 1,
      name: 'Иван Петров',
      email: 'ivan.petrov@company.com',
      department: 'IT Отдел',
      status: 'active',
      lastLogin: '2024-01-15 14:30',
      role: 'Администратор'
    },
    {
      id: 2,
      name: 'Мария Сидорова',
      email: 'maria.sidorova@company.com',
      department: 'Финансы',
      status: 'active',
      lastLogin: '2024-01-14 09:15',
      role: 'Пользователь'
    },
    {
      id: 3,
      name: 'Алексей Кузнецов',
      email: 'alexey.kuznetsov@company.com',
      department: 'HR',
      status: 'inactive',
      lastLogin: '2024-01-10 16:45',
      role: 'Менеджер'
    },
    {
      id: 4,
      name: 'Елена Волкова',
      email: 'elena.volkova@company.com',
      department: 'Маркетинг',
      status: 'active',
      lastLogin: '2024-01-15 11:20',
      role: 'Пользователь'
    }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50';
  };

  const getStatusIcon = (status) => {
    return status === 'active' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />;
  };

  return (
    <div className="flex h-screen bg-gray-100" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800" style={{ color: '#333333' }}>AD Admin</h1>
              <p className="text-sm text-gray-500" style={{ color: '#6B7280' }}>Active Directory</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {[
              { id: 'users', label: 'Пользователи', icon: Users },
              { id: 'groups', label: 'Группы', icon: Users },
              { id: 'computers', label: 'Компьютеры', icon: Settings },
              { id: 'policies', label: 'Политики', icon: Shield }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: activeTab === item.id ? '#E5F1FB' : '',
                  color: activeTab === item.id ? '#0078D4' : '#4A4A4A'
                }}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800" style={{ color: '#333333' }}>Администратор</p>
              <p className="text-xs text-gray-500" style={{ color: '#6B7280' }}>admin@company.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Поиск пользователей, групп, компьютеров..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5E7EB',
                    color: '#333333'
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ color: '#333333' }}>
              Пользователи Active Directory
            </h2>
            <p className="text-gray-600" style={{ color: '#6B7280' }}>
              Управление пользователями и их правами доступа
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Всего пользователей', value: '1,247', color: 'bg-blue-50', textColor: 'text-blue-700' },
              { label: 'Активных', value: '1,156', color: 'bg-green-50', textColor: 'text-green-700' },
              { label: 'Неактивных', value: '91', color: 'bg-orange-50', textColor: 'text-orange-700' },
              { label: 'Администраторов', value: '12', color: 'bg-purple-50', textColor: 'text-purple-700' }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <p className="text-sm text-gray-600 mb-2" style={{ color: '#6B7280' }}>{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800" style={{ color: '#333333' }}>Список пользователей</h3>
              <button 
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                style={{ backgroundColor: '#0078D4' }}
              >
                <Plus className="w-4 h-4" />
                <span>Добавить пользователя</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Пользователь', 'Email', 'Отдел', 'Статус', 'Последний вход', 'Роль', 'Действия'].map((header) => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" style={{ color: '#4A4A4A' }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900" style={{ color: '#333333' }}>{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700" style={{ color: '#4A4A4A' }}>{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700" style={{ color: '#4A4A4A' }}>
                          <Building className="w-4 h-4 inline mr-1" />
                          {user.department}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {getStatusIcon(user.status)}
                          <span className="ml-1">{user.status === 'active' ? 'Активен' : 'Неактивен'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700" style={{ color: '#4A4A4A' }}>
                        {user.lastLogin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-900 font-medium">Редактировать</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
