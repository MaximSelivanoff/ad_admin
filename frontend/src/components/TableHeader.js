import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const TableHeader = ({ column, sort, onSort }) => {
  const isActive = sort.field === column.field;
  const isAsc = isActive && sort.order === 'ASC';

  const handleClick = () => {
    if (column.sortable) {
      onSort(column.field);
    }
  };

  return (
    <th
      onClick={handleClick}
      className={`px-4 py-2 text-left font-semibold text-gray-700 ${
        column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <span>{column.label}</span>
        {column.sortable && (
          <div className="w-4 h-4">
            {isActive ? (
              isAsc ? <ChevronUp size={16} /> : <ChevronDown size={16} />
            ) : (
              <div className="w-4 h-4 opacity-20" />
            )}
          </div>
        )}
      </div>
    </th>
  );
};

export default TableHeader;
