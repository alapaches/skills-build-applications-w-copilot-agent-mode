import { useCallback } from 'react';
import { API_BASE_URL, readCollectionResponse } from '../api.js';
import { useApiCollection } from '../hooks/useApiCollection.js';
import { ResourcePage } from './ResourceTable.jsx';

function Workouts() {
  const loadWorkouts = useCallback(async (signal) => {
    const response = await fetch(`${API_BASE_URL}/api/workouts/`, { signal });
    return readCollectionResponse(response);
  }, []);
  const { records, loading, error } = useApiCollection(loadWorkouts);

  return (
    <ResourcePage
      description="Explore ideas for your next session and find a workout that fits."
      error={error}
      loading={loading}
      title="Workouts"
    >
      {records.length === 0 ? (
        <p className="empty-state mb-0">No workouts available right now.</p>
      ) : (
        <div className="row g-3">
          {records.map((workout) => (
            <div className="col-12 col-md-6 col-xl-4" key={workout._id || workout.id || workout.name}>
              <article className="workout-card h-100">
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <span className="workout-target">{workout.target || 'Workout'}</span>
                  <span className="difficulty">{workout.difficulty || 'beginner'}</span>
                </div>
                <h2>{workout.name || 'Workout'}</h2>
                <p>{workout.description || 'A session to help you keep moving.'}</p>
                <p className="workout-duration">{workout.durationMinutes ?? '—'} min</p>
                {Array.isArray(workout.exercises) && workout.exercises.length > 0 && (
                  <ul className="exercise-list">
                    {workout.exercises.map((exercise, index) => <li key={`${exercise}-${index}`}>{exercise}</li>)}
                  </ul>
                )}
              </article>
            </div>
          ))}
        </div>
      )}
    </ResourcePage>
  );
}

export default Workouts;
