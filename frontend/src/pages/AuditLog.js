import React, { useEffect, useState } from 'react';
import { auditAPI } from '../services/api';
import { X, Download } from 'lucide-react';
import DataTable from '../components/DataTable';
import { exportToExcel } from '../utils/excelExporter';

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
  const [sort, setSort] = useState({ field: null, order: 'DESC' });

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
        ...(activeSort.field && { sort: activeSort.field, order: activeSort.order })
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

  const handleSort = (field, order) => {
    const newSort = { field, order };
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
    {
      key: 'createdAt',
      label: 'Time',
      sortable: true,
      formatter: (row) => new Date(row.createdAt).toLocaleString()
    },
    {
      key: 'username',
      label: 'Changed By',
      sortable: true,
      formatter: (row) => row.User?.username || 'System'
    },
    {
      key: 'action',
      label: 'Action',
      sortable: true,
      formatter: (row) => (
        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getActionBadgeStyle(row.action)}`}>
          {row.action}
        </span>
      )
    },
    {
      key: 'entityType',
      label: 'Entity',
      sortable: false,
      formatter: (row) => <span className="text-gray-600">{row.entityType}</span>
    },
    {
      key: 'entityId',
      label: 'Description',
      sortable: false,
      formatter: (row) => <span className="text-gray-500 truncate">{row.entityType} #{row.entityId}</span>
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-[calc(100vh-80px)] overflow-hidden">
      {/* Filters + Table */}
      <div className="lg:col-span-2 flex flex-col min-h-0">
        {/* Header with Export */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Audit Log</h1>
          <button
            onClick={() => exportToExcel('AuditLog', columns, logs)}
            className="inline-flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 px-3 py-1.5 rounded-md text-sm"
          >
            <Download size={16} /> Export
          </button>
        </div>
        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-md p-3 mb-4">
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={filter.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              />
              <select
                value={filter.action}
                onChange={(e) => updateFilter('action', e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
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
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Changed by username..."
                value={filter.changedBy}
                onChange={(e) => updateFilter('changedBy', e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="date"
                value={filter.startDate}
                onChange={(e) => updateFilter('startDate', e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="date"
                value={filter.endDate}
                onChange={(e) => updateFilter('endDate', e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              />
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={logs}
          loading={loading}
          selectedRow={selectedLog}
          onRowClick={setSelectedLog}
          onSort={handleSort}
          serverSort={sort.field ? sort : null}
          pagination={pagination}
          onPageChange={(p) => loadLogs(p, limit)}
          onLimitChange={(l) => loadLogs(1, l)}
          page={page}
          limit={limit}
          emptyMessage="No audit events found"
          hideActions={true}
        />
      </div>

      {/* Details Panel */}
      {selectedLog && (
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-md shadow-sm p-4 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4 pb-4 border-b">
            <h3 className="font-semibold text-gray-800">{selectedLog.action} Details</h3>
            <button
              onClick={() => setSelectedLog(null)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-2 text-xs mb-4 pb-4 border-b">
              <span className="font-semibold text-gray-700">Timestamp</span>
              <span className="text-gray-900">{new Date(selectedLog.createdAt).toLocaleString()}</span>
              
              <span className="font-semibold text-gray-700">Changed By</span>
              <span className="text-gray-900">{selectedLog.User?.username || 'System'}</span>
              
              <span className="font-semibold text-gray-700">Email</span>
              <span className="text-gray-900">{selectedLog.User?.email || '-'}</span>
              
              <span className="font-semibold text-gray-700">Action</span>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium w-fit ${getActionBadgeStyle(selectedLog.action)}`}>
                {selectedLog.action}
              </span>
              
              <span className="font-semibold text-gray-700">Entity</span>
              <span className="text-gray-900">{selectedLog.entityType} #{selectedLog.entityId}</span>
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
                <p className="text-gray-900 mt-1">Password reset for user</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLog;
