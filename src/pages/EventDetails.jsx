import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventById } from '../features/eventsSlice';
import { registerForEvent, cancelRegistration } from '../features/registrationsSlice';
import { formatDate } from '../components/EventCard';
import { isPast } from '../api/ticketmaster';

const NONE = [];

export default function EventDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected: event, detailStatus, detailError } = useSelector((state) => state.events);
  const user = useSelector((state) => state.auth.user);
  const registered = useSelector((state) => state.registrations.byUser[user?.email]) || NONE;
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(fetchEventById(id));
  }, [dispatch, id]);

  if (detailStatus === 'loading' || detailStatus === 'idle') return <p className="muted">Loading event...</p>;
  if (detailStatus === 'failed') return <p className="alert alert-error">{detailError}</p>;
  if (!event) return null;

  const isRegistered = registered.some((e) => e.id === event.id);
  const past = isPast(event);

  const handleRegister = () => {
    dispatch(registerForEvent({ email: user.email, event }));
    setMessage('You have registered for this event.');
  };

  const handleCancel = () => {
    dispatch(cancelRegistration({ email: user.email, id: event.id }));
    setMessage('Your registration has been cancelled.');
  };

  return (
    <article className="details">
      <Link to="/events" className="muted">&larr; Back to events</Link>
      {event.image && <img src={event.image} alt={event.name} className="details-img" />}
      <h2>{event.name}</h2>
      <div className="badges">
        {event.category && <span className="badge">{event.category}</span>}
        {event.genre && event.genre !== 'Undefined' && <span className="badge">{event.genre}</span>}
        {event.status && <span className="badge">{event.status}</span>}
      </div>

      <ul className="info">
        <li><strong>Date:</strong> {formatDate(event)}</li>
        <li><strong>Venue:</strong> {event.venue || 'TBA'}</li>
        <li>
          <strong>Location:</strong>{' '}
          {[event.address, event.city, event.state, event.country].filter(Boolean).join(', ') || 'TBA'}
        </li>
        {event.price && <li><strong>Price:</strong> {event.price}</li>}
      </ul>
      {event.info && <p>{event.info}</p>}
      {event.url && (
        <p>
          <a href={event.url} target="_blank" rel="noreferrer">View on Ticketmaster</a>
        </p>
      )}

      {message && <p className="alert alert-success">{message}</p>}

      {!user && (
        <p className="muted">
          <Link to="/login" state={{ from: `/events/${event.id}` }}>Login</Link> to register for this event.
        </p>
      )}
      {user && past && <p className="muted">This event has already taken place.</p>}
      {user && !past && !isRegistered && (
        <button className="btn" onClick={handleRegister}>Register</button>
      )}
      {user && !past && isRegistered && (
        <button className="btn btn-danger" onClick={handleCancel}>Cancel registration</button>
      )}
      {user && isRegistered && past && <p className="muted">You were registered for this event.</p>}
    </article>
  );
}
