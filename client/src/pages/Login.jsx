import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (redirectUrl) {
        navigate(redirectUrl);
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'provider') {
        navigate('/provider/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo Login Helper
  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="container py-5 my-md-4">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-8">
          <div className="card modern-card p-4 p-md-5 border-0 shadow-lg rounded-4">
            <div className="text-center mb-4">
              <div
                className="bg-primary text-white rounded-3 d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                style={{ width: '50px', height: '50px' }}
              >
                <i className="bi bi-car-front-fill fs-4"></i>
              </div>
              <h3 className="fw-bold mb-1">Welcome Back</h3>
              <p className="text-muted small">Sign in to your CarCare Connect account</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 small d-flex align-items-center mb-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small text-muted">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0 ps-0"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-semibold small text-muted mb-0">Password</label>
                  <a href="#forgot" className="small text-decoration-none text-primary" onClick={(e) => e.preventDefault()}>
                    Forgot?
                  </a>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0 ps-0"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary-modern w-100 py-2 mb-3 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* 1-Click Demo Credentials */}
            <div className="p-3 bg-light rounded-3 mt-2 border">
              <span className="fw-bold small text-dark d-block mb-2 text-center">
                ⚡ Quick Demo 1-Click Fill:
              </span>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                <button
                  type="button"
                  className="demo-pill btn-sm"
                  onClick={() => fillDemo('rajesh.kumar@example.com', 'password123')}
                >
                  <i className="bi bi-person-fill text-primary"></i> Customer
                </button>
                <button
                  type="button"
                  className="demo-pill btn-sm"
                  onClick={() => fillDemo('apex.mechanic@carcare.com', 'password123')}
                >
                  <i className="bi bi-tools text-warning"></i> Provider
                </button>
                <button
                  type="button"
                  className="demo-pill btn-sm"
                  onClick={() => fillDemo('admin@carcare.com', 'password123')}
                >
                  <i className="bi bi-shield-fill text-danger"></i> Admin
                </button>
              </div>
            </div>

            <div className="text-center mt-4">
              <span className="text-muted small">Don't have an account? </span>
              <Link to="/register" className="fw-semibold text-primary text-decoration-none small">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
