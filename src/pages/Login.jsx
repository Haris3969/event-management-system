import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../features/authSlice';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { user, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) navigate(location.state?.from || '/events', { replace: true });
  }, [user, navigate, location.state]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) found.email = 'Enter a valid email.';
    if (!form.password) found.password = 'Password is required.';
    setErrors(found);
    if (Object.keys(found).length === 0) dispatch(login(form));
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2>Login</h2>
      {error && <p className="alert alert-error">{error}</p>}
      <label>
        Email
        <input type="email" name="email" value={form.email} onChange={handleChange} />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </label>
      <label>
        Password
        <input type="password" name="password" value={form.password} onChange={handleChange} />
        {errors.password && <span className="field-error">{errors.password}</span>}
      </label>
      <button type="submit" className="btn">Login</button>
      <p className="muted">
        No account? <Link to="/register">Register</Link>
      </p>
    </form>
  );
}
