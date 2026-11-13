import React, { useCallback, useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const result = await adminService.getAuditLogs({ limit: 100 });
      setLogs(result.logs);
    } catch (requestError) {
      console.error('Failed to load audit logs:', requestError);
      setError('Audit logs could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return (
    <section>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Audit logs</h1>
      {loading ? (
        <LoadingSpinner size="lg" text="Loading audit logs..." />
      ) : error ? (
        <p role="alert" className="text-red-600 dark:text-red-400">{error}</p>
      ) : logs.length === 0 ? (
        <div className="card p-8 text-center text-gray-600 dark:text-gray-400">No audit events found.</div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <article key={log._id} className="card p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <strong className="capitalize text-gray-900 dark:text-white">
                  {log.action.replace(/_/g, ' ')}
                </strong>
                <time className="text-sm text-gray-500" dateTime={log.createdAt}>
                  {new Date(log.createdAt).toLocaleString()}
                </time>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {log.admin?.name || 'Unknown admin'} · {log.targetType}
              </p>
              {log.details?.adminNotes && (
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{log.details.adminNotes}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminAuditLogs;
