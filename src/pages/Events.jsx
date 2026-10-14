import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../features/eventsSlice';
import EventCard from '../components/EventCard';

const CATEGORIES = ['Music', 'Sports', 'Arts & Theatre', 'Film', 'Miscellaneous'];
const EMPTY = { keyword: '', category: '', city: '', startDate: '' };

export default function Events() {
  const dispatch = useDispatch();
  const { list, status, error, page, totalPages } = useSelector((state) => state.events);
  const [filters, setFilters] = useState(EMPTY);
  const [applied, setApplied] = useState(EMPTY);
  const [pageNo, setPageNo] = useState(0);

  useEffect(() => {
    dispatch(fetchEvents({ ...applied, page: pageNo }));
  }, [dispatch, applied, pageNo]);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const apply = (next) => {
    setFilters(next);
    setApplied(next);
    setPageNo(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    apply(filters);
  };

  return (
    <section>
      <h2>Upcoming Events</h2>

      <form className="filters" onSubmit={handleSubmit}>
        <input name="keyword" placeholder="Search events" value={filters.keyword} onChange={handleChange} />
        <input name="city" placeholder="City" value={filters.city} onChange={handleChange} />
        <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
        <button type="submit" className="btn">Search</button>
        <button type="button" className="btn btn-outline" onClick={() => apply(EMPTY)}>Reset</button>
      </form>

      <div className="chips">
        <button
          className={`chip ${applied.category === '' ? 'active' : ''}`}
          onClick={() => apply({ ...filters, category: '' })}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`chip ${applied.category === c ? 'active' : ''}`}
            onClick={() => apply({ ...filters, category: c })}
          >
            {c}
          </button>
        ))}
      </div>

      {status === 'loading' && <p className="muted">Loading events...</p>}
      {status === 'failed' && <p className="alert alert-error">{error}</p>}
      {status === 'succeeded' && list.length === 0 && <p className="muted">No events found.</p>}

      <div className="grid">
        {list.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="btn btn-outline" disabled={page === 0} onClick={() => setPageNo(page - 1)}>
            Previous
          </button>
          <span>Page {page + 1} of {totalPages}</span>
          <button className="btn btn-outline" disabled={page + 1 >= totalPages} onClick={() => setPageNo(page + 1)}>
            Next
          </button>
        </div>
      )}
    </section>
  );
}
