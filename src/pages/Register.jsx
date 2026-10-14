import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../features/authSlice';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { user, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) navigate('/events', { replace: true });
  }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = {};
    if (form.name.trim().length < 2) found.name = 'Name must be at least 2 characters.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) found.email = 'Enter a valid email.';
    if (form.password.length < 6) found.password = 'Password must be at least 6 characters.';
    setErrors(found);
    if (Object.keys(found).length === 0) dispatch(register(form));
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2>Register</h2>
      {error && <p className="alert alert-error">{error}</p>}
      <label>
        Name
        <input type="text" name="name" value={form.name} onChange={handleChange} />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </label>
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
      <button type="submit" className="btn">Create account</button>
      <p className="muted">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}
