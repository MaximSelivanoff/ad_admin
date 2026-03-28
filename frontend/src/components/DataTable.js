import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Pagination from './Pagination';

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  selectedRow = null,
  onRowClick = () => {},
  onRowAction = () => {},
  pagination = { total: 0, totalPages: 1 },
  onPageChange = () => {},
  onLimitChange = () => {},
  onSort = null, // Callback для бэкэнд-сортировки
  page = 1,
  limit = 20,
  emptyMessage = 'No data found',
  serverSort = null, // { field, order } для индикации бэкэнд-сортировки
  hideActions = false // Hide the actions column
}) => {
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('ASC');

  // Функция для определения типа данных
  const getDataType = (value) => {
    if (value === null || value === undefined) return 'string';
    if (typeof value === 'number') return 'number';
    if (value instanceof Date) return 'date';
    if (typeof value === 'string') {
      // Проверяем ISO дату
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'date';
      return 'string';
    }
    return 'string';
  };

  // Функция для преобразования значения к сортируемому виду
  const parseValue = (value, dataType) => {
    if (value === null || value === undefined) return '';
    
    switch (dataType) {
      case 'number':
        return Number(value);
      case 'date':
        return new Date(value).getTime();
      default:
        return String(value).toLowerCase();
    }
  };

  // Сортировка данных (локальная)
  const sortedData = useMemo(() => {
    if (!sortBy || onSort) return data; // Если есть onSort callback, не сортируем локально

    const sorted = [...data].sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      const dataType = getDataType(valueA || valueB);

      const parsedA = parseValue(valueA, dataType);
      const parsedB = parseValue(valueB, dataType);

      if (parsedA < parsedB) return sortOrder === 'ASC' ? -1 : 1;
      if (parsedA > parsedB) return sortOrder === 'ASC' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortBy, sortOrder, onSort]);

  // Обработчик клика на заголовок колонки
  const handleHeaderClick = (columnKey, isSortable) => {
    if (!isSortable) return;

    if (onSort) {
      // Используем бэкэнд-сортировку
      const currentField = serverSort?.field;
      const currentOrder = serverSort?.order;

      if (currentField === columnKey) {
        if (currentOrder === 'ASC') {
          onSort(columnKey, 'DESC');
        } else {
          onSort(null, 'ASC');
        }
      } else {
        onSort(columnKey, 'ASC');
      }
    } else {
      // Локальная сортировка
      if (sortBy === columnKey) {
        if (sortOrder === 'ASC') {
          setSortOrder('DESC');
        } else {
          setSortBy(null);
          setSortOrder('ASC');
        }
      } else {
        setSortBy(columnKey);
        setSortOrder('ASC');
      }
    }
  };

  // Получить иконку сортировки для колонки
  const getSortIcon = (columnKey) => {
    const currentSort = onSort ? serverSort : { field: sortBy, order: sortOrder };
    if (currentSort?.field !== columnKey) return null;
    return currentSort.order === 'ASC' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  // Форматирование значения ячейки
  const formatCellValue = (row, column) => {
    if (column.formatter) {
      return column.formatter(row);
    }
    
    const value = row[column.key];
    
    if (value === null || value === undefined) return '—';
    
    // Форматирование дат
    if (column.key.includes('Date') || column.key.includes('At')) {
      if (typeof value === 'string') {
        return new Date(value).toLocaleDateString();
      }
      return value.toLocaleDateString();
    }
    
    return String(value);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden flex flex-col h-full">
      {/* Таблица */}
      <div className="overflow-auto flex-1">
        <table className="w-full text-xs md:text-sm">
          <thead className="bg-gray-50 text-gray-700 uppercase sticky top-0">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-3 py-2 text-left ${column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                  onClick={() => handleHeaderClick(column.key, column.sortable !== false)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {!hideActions && (onRowAction || onRowClick) && <th className="px-3 py-2 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={hideActions ? columns.length : columns.length + 1} className="p-4 text-center text-gray-600">
                  Loading...
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={hideActions ? columns.length : columns.length + 1} className="p-4 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className={`border-t hover:bg-gray-50 cursor-pointer ${
                    selectedRow?.id === row.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-3 py-2 truncate text-xs">
                      {formatCellValue(row, column)}
                    </td>
                  ))}
                  {!hideActions && (onRowAction || onRowClick) && (
                    <td className="px-3 py-2 text-center">
                      {onRowAction && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRowAction(row);
                          }}
                          className="text-red-600 hover:text-red-700 text-xs font-medium"
                          title="Delete"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      <Pagination
        page={page}
        totalPages={pagination.totalPages}
        limit={limit}
        total={pagination.total}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
};

export default DataTable;
