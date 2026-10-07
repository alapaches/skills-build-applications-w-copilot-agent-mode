import { useCallback } from 'react';
import { API_BASE_URL, formatReference, readCollectionResponse } from '../api.js';
import { useApiCollection } from '../hooks/useApiCollection.js';
import { ResourcePage, ResourceTable } from './ResourceTable.jsx';

function Leaderboard() {
  const loadLeaderboard = useCallback(async (signal) => {
    const response = await fetch(`${API_BASE_URL}/api/leaderboard/`, { signal });
    return readCollectionResponse(response);
  }, []);
  const { records, loading, error } = useApiCollection(loadLeaderboard);
  const rankedRecords = [...records].sort((first, second) => (second.points ?? 0) - (first.points ?? 0));

  return (
    <ResourcePage
      description="Celebrate the consistency, effort, and points earned by your community."
      error={error}
      loading={loading}
      title="Leaderboard"
    >
      <ResourceTable
        columns={[
          { key: 'rank', label: 'Rank', render: (_value, _record, index) => index + 1 },
          { key: 'userId', label: 'Athlete', render: formatReference },
          { key: 'teamId', label: 'Team', render: formatReference },
          { key: 'points', label: 'Points', render: (value) => <strong className="points-value">{value ?? 0}</strong> },
        ]}
        emptyMessage="The leaderboard is ready for its first entry."
        records={rankedRecords}
      />
    </ResourcePage>
  );
}

export default Leaderboard;
