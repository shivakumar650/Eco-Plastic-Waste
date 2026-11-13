import React, { useCallback, useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const itemFields = {
  campaign: { owner: 'organizer', title: 'title' },
  resource: { owner: 'author', title: 'title' },
  agency: { owner: 'submittedBy', title: 'name' },
};

const AdminModeration = ({ type }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState('');
  const [notes, setNotes] = useState({});
  const fields = itemFields[type];

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setItems(await adminService.getPending(type));
    } catch (requestError) {
      console.error(`Failed to load pending ${type}s:`, requestError);
      setError(`Pending ${type}s could not be loaded.`);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const updateStatus = async (item, status) => {
    try {
      setProcessingId(item._id);
      await adminService.updateContentStatus(type, item._id, status, notes[item._id] || '');
      setItems((currentItems) => currentItems.filter(({ _id }) => _id !== item._id));
      toast.success(`${type[0].toUpperCase()}${type.slice(1)} ${status}`);
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || `Could not ${status} ${type}`);
    } finally {
      setProcessingId('');
    }
  };

  return (
    <section>
      <h1 className="text-3xl font-bold capitalize text-gray-900 dark:text-white mb-8">
        {type} moderation
      </h1>
      {loading ? (
        <LoadingSpinner size="lg" text={`Loading pending ${type}s...`} />
      ) : error ? (
        <p role="alert" className="text-red-600 dark:text-red-400">{error}</p>
      ) : items.length === 0 ? (
        <div className="card p-8 text-center text-gray-600 dark:text-gray-400">
          No items are waiting for review.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <article key={item._id} className="card p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {item[fields.title]}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Submitted by {item[fields.owner]?.name || 'Unknown'}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {item.description}
                  </p>
                </div>
                <span className="h-fit rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800">
                  Pending
                </span>
              </div>
              <label className="mt-4 block text-sm text-gray-700 dark:text-gray-300">
                Moderator notes (optional)
                <textarea
                  value={notes[item._id] || ''}
                  onChange={(event) => setNotes((current) => ({
                    ...current,
                    [item._id]: event.target.value,
                  }))}
                  rows={2}
                  maxLength={500}
                  className="form-input mt-1"
                />
              </label>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  disabled={processingId === item._id}
                  onClick={() => updateStatus(item, 'approved')}
                  className="btn-primary disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={processingId === item._id}
                  onClick={() => updateStatus(item, 'rejected')}
                  className="rounded-lg border border-red-300 px-4 py-2 text-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminModeration;
