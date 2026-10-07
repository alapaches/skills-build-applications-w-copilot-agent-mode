import { useCallback } from 'react';
import { API_BASE_URL, formatReference, readCollectionResponse } from '../api.js';
import { useApiCollection } from '../hooks/useApiCollection.js';
import { ResourcePage, ResourceTable } from './ResourceTable.jsx';

function Activities() {
  const loadActivities = useCallback(async (signal) => {
    const response = await fetch(`${API_BASE_URL}/api/activities/`, { signal });
    return readCollectionResponse(response);
  }, []);
  const { records, loading, error } = useApiCollection(loadActivities);

  return (
    <ResourcePage
      description="Every session adds up. Track the effort behind your progress."
      error={error}
      loading={loading}
      title="Activities"
    >
      <ResourceTable
        columns={[
          { key: 'activityType', label: 'Activity' },
          { key: 'userId', label: 'Athlete', render: formatReference },
          { key: 'durationMinutes', label: 'Duration', render: (value) => value ? `${value} min` : '—' },
          { key: 'distanceKilometers', label: 'Distance', render: (value) => value == null ? '—' : `${value} km` },
          { key: 'points', label: 'Points' },
          { key: 'completedAt', label: 'Completed', render: (value) => value ? new Date(value).toLocaleDateString() : '—' },
        ]}
        emptyMessage="No activities yet. Your next workout can be the first!"
        records={records}
      />
    </ResourcePage>
  );
}

export default Activities;
