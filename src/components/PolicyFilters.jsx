
import { useReducer, useEffect } from 'react';

const initial = { q: '', status: 'ALL', type: 'ALL', sortBy: 'startDate', sortDir: 'desc' };

function reducer(state, action) {
  switch (action.type) {
    case 'SET_Q': return { ...state, q: action.payload };
    case 'SET_STATUS': return { ...state, status: action.payload };
    case 'SET_TYPE': return { ...state, type: action.payload };
    case 'SET_SORT': return { ...state, sortBy: action.payload.key, sortDir: action.payload.dir };
    case 'RESET': return initial;
    default: return state;
  }
}

export default function PolicyFilters({ onChange }) {
  const [state, dispatch] = useReducer(reducer, initial);
  useEffect(() => { onChange(state); }, [state, onChange]);

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row g-2 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Policy ID or Type"
              value={state.q}
              onChange={(e) => dispatch({ type: 'SET_Q', payload: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={state.status}
              onChange={(e) => dispatch({ type: 'SET_STATUS', payload: e.target.value })}
            >
              <option value="ALL">All</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={state.type}
              onChange={(e) => dispatch({ type: 'SET_TYPE', payload: e.target.value })}
            >
              <option value="ALL">All</option>
              <option value="Health">Health</option>
              <option value="Motor">Motor</option>
              <option value="Life">Life</option>
            </select>
          </div>
          <div className="col-md-2 d-flex gap-2">
            <button className="btn btn-outline-secondary w-100" onClick={() => dispatch({ type: 'RESET' })}>
              <i className="bi bi-arrow-counterclockwise me-1"></i> Reset
            </button>
          </div>
        </div>

        <div className="row g-2 mt-2">
          <div className="col-md-4">
            <label className="form-label">Sort By</label>
            <div className="input-group">
              <select
                className="form-select"
                value={state.sortBy}
                onChange={(e) => dispatch({ type: 'SET_SORT', payload: { key: e.target.value, dir: state.sortDir } })}
              >
                <option value="startDate">Start Date</option>
                <option value="endDate">End Date</option>
                <option value="coverageAmount">Coverage Amount</option>
              </select>
              <button
                className="btn btn-outline-secondary"
                onClick={() => dispatch({ type: 'SET_SORT', payload: { key: state.sortBy, dir: state.sortDir === 'asc' ? 'desc' : 'asc' } })}
              >
                {state.sortDir === 'asc' ? <i className="bi bi-sort-down"></i> : <i className="bi bi-sort-up"></i>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
