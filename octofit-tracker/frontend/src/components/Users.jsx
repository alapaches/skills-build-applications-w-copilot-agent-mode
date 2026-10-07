import { useCallback } from 'react';
import { API_BASE_URL, formatReference, readCollectionResponse } from '../api.js';
import { useApiCollection } from '../hooks/useApiCollection.js';
import { ResourcePage, ResourceTable } from './ResourceTable.jsx';

function Users() {
  const loadUsers = useCallback(async (signal) => {
    const response = await fetch(`${API_BASE_URL}/api/users/`, { signal });
    return readCollectionResponse(response);
  }, []);
  const { records, loading, error } = useApiCollection(loadUsers);

  return (
    <ResourcePage
      description="Meet the athletes building healthy habits together."
      error={error}
      loading={loading}
      title="Users"
    >
      <ResourceTable
        columns={[
          { key: 'displayName', label: 'Name', render: (value, user) => value || user.username || '—' },
          { key: 'email', label: 'Email' },
          { key: 'teamId', label: 'Team', render: formatReference },
        ]}
        emptyMessage="No athletes to show yet."
        records={records}
      />
    </ResourcePage>
  );
}

export default Users;
