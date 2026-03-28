import React, { useEffect, useState } from 'react';
import { auditAPI } from '../services/api';
import { X } from 'lucide-react';
import TableHeader from '../components/TableHeader';
import Pagination from '../components/Pagination';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    action: '',
    entityType: '',
    changedBy: '',
    search: '',
    startDate: '',
    endDate: ''
  });
  const [sort, setSort] = useState({ field: 'createdAt', order: 'DESC' });

  const loadLogs = async (pageNum = 1, limitNum = limit, newFilter = null, newSort = null) => {
    try {
      setLoading(true);
      const activeFilter = newFilter || filter;
      const activeSort = newSort || sort;
      const params = {
        page: pageNum,
        limit: limitNum,
        ...(activeFilter.action && { action: activeFilter.action }),
        ...(activeFilter.entityType && { entityType: activeFilter.entityType }),
        ...(activeFilter.changedBy && { changedBy: activeFilter.changedBy }),
        ...(activeFilter.search && { search: activeFilter.search }),
        ...(activeFilter.startDate && { startDate: activeFilter.startDate }),
        ...(activeFilter.endDate && { endDate: activeFilter.endDate }),
        sort: activeSort.field,
        order: activeSort.order
      };
      const response = await auditAPI.get(params);
      setLogs(response.data.data);
      setPagination(response.data.pagination);
      setPage(pageNum);
      setLimit(limitNum);
      setSelectedLog(null);
    } catch (error) {
      console.error('Failed to load audit logs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(1, 20);
  }, []);

  const updateFilter = (key, value) => {
    const newFilter = { ...filter, [key]: value };
    setFilter(newFilter);
    loadLogs(1, limit, newFilter);
  };

  const clearFilters = () => {
    const emptyFilter = {
      action: '',
      entityType: '',
      changedBy: '',
      search: '',
      startDate: '',
      endDate: ''
    };
    setFilter(emptyFilter);
    loadLogs(1, limit, emptyFilter);
  };

  const handleSort = (field) => {
    let newOrder = 'ASC';
    if (sort.field === field && sort.order === 'ASC') {
      newOrder = 'DESC';
    }
    const newSort = { field, order: newOrder };
    setSort(newSort);
    loadLogs(page, limit, null, newSort);
  };

  const getActionBadgeStyle = (action) => {
    const styles = {
      CREATE: 'bg-green-100 text-green-800 border border-green-300',
      UPDATE: 'bg-blue-100 text-blue-800 border border-blue-300',
      DELETE: 'bg-red-100 text-red-800 border border-red-300',
      PASSWORD_RESET: 'bg-orange-100 text-orange-800 border border-orange-300'
    };
    return styles[action] || 'bg-gray-100 text-gray-800 border border-gray-300';
  };

  const hasActiveFilters = filter.action || filter.entityType || filter.changedBy || filter.search || filter.startDate || filter.endDate;

  const columns = [
    { field: 'createdAt', label: 'Time', sortable: true },
    { field: 'username', label: 'Changed By', sortable: true },
    { field: 'action', label: 'Action', sortable: true },
    { field: 'entityType', label: 'Entity', sortable: false },
    { field: 'description', label: 'Description', sortable: false }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-[calc(100vh-80px)] overflow-hidden">
      {/* Filters + Table */}
      <div className="lg:col-span-2 flex flex-col min-h-0">
        {/* Filters */}
        <div className="bg-white border rounded-md p-3 mb-4">
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={filter.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              />
              <select
                value={filter.action}
                onChange={(e) => updateFilter('action', e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="PASSWORD_RESET">Password Reset</option>
              </select>
              <input
                type="text"
                placeholder="Entity type..."
                value={filter.entityType}
                onChange={(e) => updateFilter('entityType', e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Changed by username..."
                value={filter.changedBy}
                onChange={(e) => updateFilter('changedBy', e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              />
              <input
                type="date"
                value={filter.startDate}
                onChange={(e) => updateFilter('startDate', e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              />
              <input
                type="date"
                value={filter.endDate}
                onChange={(e) => updateFilter('endDate', e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              />
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-8 text-gray-600">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="text-gray-600 text-center py-8">No audit events found.</div>
        ) : (
          <div className="bg-white border rounded-md shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="overflow-auto flex-1">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b sticky top-0">
                  <tr>
                    {columns.map(col => (
                      <TableHeader key={col.field} column={col} sort={sort} onSort={handleSort} />
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((entry) => (
                    <tr
                      key={entry.id}
                      onClick={() => setSelectedLog(entry)}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                        {new Date(entry.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-sm font-medium">{entry.User?.username || 'System'}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getActionBadgeStyle(entry.action)}`}>
                          {entry.action}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">{entry.entityType}</td>
                      <td className="px-4 py-2 text-xs text-gray-500 truncate max-w-xs">
                        {entry.entityType} #{entry.entityId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              page={page}
              totalPages={pagination.totalPages}
              limit={limit}
              total={pagination.total}
              onPageChange={(p) => loadLogs(p, limit)}
              onLimitChange={(l) => loadLogs(1, l)}
            />
          </div>
        )}
      </div>

      {/* Details Panel */}
      {selectedLog && (
        <div className="lg:col-span-1 bg-white border rounded-md shadow-sm p-4 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4 pb-4 border-b">
            <h3 className="font-semibold text-gray-800">{selectedLog.action} Details</h3>
            <button
              onClick={() => setSelectedLog(null)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4 text-sm overflow-y-auto flex-1">
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase">Timestamp</label>
              <p className="text-gray-900 mt-1">{new Date(selectedLog.createdAt).toLocaleString()}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase">Changed By</label>
              <p className="text-gray-900 mt-1">{selectedLog.User?.username || 'System'}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase">Email</label>
              <p className="text-gray-900 mt-1">{selectedLog.User?.email || '-'}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase">Action</label>
              <p className={`mt-1 inline-block px-2 py-1 rounded text-xs font-medium ${getActionBadgeStyle(selectedLog.action)}`}>
                {selectedLog.action}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase">Entity</label>
              <p className="text-gray-900 mt-1">{selectedLog.entityType} #{selectedLog.entityId}</p>
            </div>

            {selectedLog.action === 'UPDATE' && selectedLog.details?.before && selectedLog.details?.after && (
              <div className="border-t pt-4">
                <label className="text-xs font-semibold text-gray-700 uppercase">Changes</label>
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                  {Object.entries(selectedLog.details.after).map(([key, newValue]) => {
                    const oldValue = selectedLog.details.before[key];
                    if (oldValue !== newValue) {
                      return (
                        <div key={key} className="border-l-2 border-blue-300 pl-2 text-xs">
                          <p className="font-medium text-gray-700">{key}</p>
                          <p className="text-red-700">Before: {JSON.stringify(oldValue)}</p>
                          <p className="text-green-700">After: {JSON.stringify(newValue)}</p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {(selectedLog.action === 'CREATE' || selectedLog.action === 'DELETE') && selectedLog.details && (
              <div className="border-t pt-4">
                <label className="text-xs font-semibold text-gray-700 uppercase">Details</label>
                <pre className="mt-2 bg-gray-50 p-2 rounded text-xs overflow-auto max-h-32 text-gray-800">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            )}

            {selectedLog.action === 'PASSWORD_RESET' && selectedLog.details && (
              <div className="border-t pt-4">
                <label className="text-xs font-semibold text-gray-700 uppercase">Details</label>
                <p className="text-gray-900 mt-1">
                  Password changed for user: {selectedLog.details.username}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLog;
