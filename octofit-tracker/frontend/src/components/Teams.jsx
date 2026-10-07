import { useCallback } from 'react';
import { API_BASE_URL, readCollectionResponse } from '../api.js';
import { useApiCollection } from '../hooks/useApiCollection.js';
import { ResourcePage } from './ResourceTable.jsx';

function Teams() {
  const loadTeams = useCallback(async (signal) => {
    const response = await fetch(`${API_BASE_URL}/api/teams/`, { signal });
    return readCollectionResponse(response);
  }, []);
  const { records, loading, error } = useApiCollection(loadTeams);

  return (
    <ResourcePage
      description="Find your crew, encourage each other, and make progress together."
      error={error}
      loading={loading}
      title="Teams"
    >
      {records.length === 0 ? (
        <p className="empty-state mb-0">No teams yet. Your crew is waiting to be created.</p>
      ) : (
        <div className="row g-3">
          {records.map((team) => (
            <div className="col-12 col-md-6" key={team._id || team.id || team.name}>
              <article className="team-card h-100">
                <span className="team-icon" aria-hidden="true">✦</span>
                <h2>{team.name || 'Unnamed team'}</h2>
                <p>{team.description || 'A team ready to move together.'}</p>
                <span className="member-count">{team.memberIds?.length ?? team.members?.length ?? 0} members</span>
              </article>
            </div>
          ))}
        </div>
      )}
    </ResourcePage>
  );
}

export default Teams;
