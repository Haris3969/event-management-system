import { Link } from 'react-router-dom';

export function formatDate(event) {
  if (!event.date) return 'Date TBA';
  const date = new Date(event.date);
  const day = date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  // only show a time when the API provided one
  return event.localTime
    ? `${day}, ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`
    : day;
}

export default function EventCard({ event, children }) {
  return (
    <div className="card">
      {event.image ? (
        <img src={event.image} alt={event.name} className="card-img" loading="lazy" />
      ) : (
        <div className="card-img placeholder">No image</div>
      )}
      <div className="card-body">
        {event.category && <span className="badge">{event.category}</span>}
        <h3>{event.name}</h3>
        <p className="muted">{formatDate(event)}</p>
        <p className="muted">
          {[event.venue, event.city].filter(Boolean).join(', ') || 'Venue TBA'}
        </p>
        <div className="card-actions">
          <Link to={`/events/${event.id}`} className="btn">Details</Link>
          {children}
        </div>
      </div>
    </div>
  );
}
