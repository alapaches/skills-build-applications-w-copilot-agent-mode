export function ResourceTable({ columns, emptyMessage, records }) {
  if (records.length === 0) {
    return <p className="empty-state mb-0">{emptyMessage}</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead>
          <tr>{columns.map(({ key, label }) => <th key={key} scope="col">{label}</th>)}</tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={record._id || record.id || `${index}`}>
              {columns.map(({ key, render }) => (
                <td key={key}>{render ? render(record[key], record, index) : record[key] ?? '—'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ResourcePage({ children, description, error, loading, title }) {
  return (
    <section aria-labelledby="page-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">OCTOFIT TRACKER</p>
          <h1 id="page-title">{title}</h1>
          <p className="page-description">{description}</p>
        </div>
      </div>
      <div className="content-card">
        {loading ? (
          <div className="loading-state" role="status">
            <span className="spinner-border spinner-border-sm text-success" aria-hidden="true" />
            <span>Loading {title.toLowerCase()}…</span>
          </div>
        ) : error ? (
          <div className="alert alert-danger mb-0" role="alert">
            Could not load {title.toLowerCase()}: {error}
          </div>
        ) : children}
      </div>
    </section>
  );
}
