import React, { createContext, useState, useMemo } from 'react';

const translations = {
  en: {
    dashboard: 'Dashboard',
    users: 'Users',
    references: 'References',
    auditLog: 'Audit Log',
    addUser: 'Add User',
    searchPlaceholder: 'Search name, email, username, position...',
    selectUserPanel: 'Select a user row to display details here.',
    active: 'Active',
    inactive: 'Inactive',
    userDetails: 'User details',
    quickActions: 'Quick actions',
    editProfile: 'Edit profile',
    toggleStatus: 'Toggle status',
    resetPassword: 'Reset password',
    viewAccessLog: 'View access log',
    loading: 'Loading...',
    noUsers: 'No users',
  },
  ru: {
    dashboard: 'Панель',
    users: 'Пользователи',
    references: 'Справочники',
    auditLog: 'Аудит',
    addUser: 'Добавить пользователя',
    searchPlaceholder: 'Поиск имя, email, username, должность...',
    selectUserPanel: 'Выберите пользователя для просмотра деталей.',
    active: 'Активен',
    inactive: 'Неактивен',
    userDetails: 'Детали пользователя',
    quickActions: 'Быстрые действия',
    editProfile: 'Редактировать',
    toggleStatus: 'Переключить статус',
    resetPassword: 'Сброс пароля',
    viewAccessLog: 'Просмотреть журнал',
    loading: 'Загрузка...',
    noUsers: 'Нет пользователей',
  }
};

export const LocaleContext = createContext({ locale: 'en', setLocale: () => {}, t: translations.en });

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');

  const value = useMemo(() => ({ locale, setLocale, t: translations[locale] }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};
