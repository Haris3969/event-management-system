import { useDispatch, useSelector } from 'react-redux';
import { cancelRegistration } from '../features/registrationsSlice';
import { isPast } from '../api/ticketmaster';
import EventCard from '../components/EventCard';

const NONE = [];

export default function MyEvents() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const registered = useSelector((state) => state.registrations.byUser[user.email]) || NONE;

  const upcoming = registered.filter((e) => !isPast(e));
  const completed = registered.filter((e) => isPast(e));

  return (
    <section>
      <h2>My Events</h2>
      {registered.length === 0 && <p className="muted">You have not registered for any events yet.</p>}

      {upcoming.length > 0 && (
        <>
          <h3>Upcoming</h3>
          <div className="grid">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event}>
                <button
                  className="btn btn-danger"
                  onClick={() => dispatch(cancelRegistration({ email: user.email, id: event.id }))}
                >
                  Cancel
                </button>
              </EventCard>
            ))}
          </div>
        </>
      )}

      {completed.length > 0 && (
        <>
          <h3>Completed</h3>
          <div className="grid">
            {completed.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
