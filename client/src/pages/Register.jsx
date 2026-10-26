import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HYDERABAD_AREAS } from '../context/LocationContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'provider' ? 'provider' : 'customer';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('HITEC City');
  const pincode = HYDERABAD_AREAS.find((item) => item.name === area)?.pincode || '';

  // Provider specific states
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [latitude, setLatitude] = useState('17.4435');
  const [longitude, setLongitude] = useState('78.3772');
  const [selectedServices, setSelectedServices] = useState(['Car Mechanic', 'Car Washing']);
  const [startingPrice, setStartingPrice] = useState('499');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleServiceToggle = (svcName) => {
    if (selectedServices.includes(svcName)) {
      if (selectedServices.length === 1) return; // Keep at least one
      setSelectedServices(selectedServices.filter((s) => s !== svcName));
    } else {
      setSelectedServices([...selectedServices, svcName]);
    }
  };

  const detectProviderGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(6));
          setLongitude(pos.coords.longitude.toFixed(6));
        },
        (err) => alert('Unable to fetch GPS: ' + err.message)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        phone,
        password,
        role,
        address,
        city: 'Hyderabad',
        area,
        pincode,
      };

      if (role === 'provider') {
        payload.businessName = businessName || name + ' Auto Hub';
        payload.ownerName = ownerName || name;
        payload.businessDescription = businessDescription;
        payload.latitude = parseFloat(latitude);
        payload.longitude = parseFloat(longitude);
        payload.services = selectedServices;
        payload.startingPrice = Number(startingPrice);
      }

      const user = await register(payload);
      if (user.role === 'provider') {
        navigate('/provider/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9">
          <div className="card modern-card p-4 p-md-5 border-0 shadow-lg rounded-4">
            <div className="text-center mb-4">
              <h3 className="fw-bold mb-1">Create an Account</h3>
              <p className="text-muted small">Join CarCare Connect as a driver or service provider</p>

              {/* Role Toggle Switch */}
              <div className="btn-group w-100 p-1 bg-light rounded-pill mt-3" role="group">
                <button
                  type="button"
                  className={`btn rounded-pill fw-semibold py-2 ${
                    role === 'customer' ? 'btn-primary shadow-sm text-white' : 'btn-light text-muted'
                  }`}
                  onClick={() => setRole('customer')}
                >
                  <i className="bi bi-person me-1"></i> Car Owner (Customer)
                </button>
                <button
                  type="button"
                  className={`btn rounded-pill fw-semibold py-2 ${
                    role === 'provider' ? 'btn-primary shadow-sm text-white' : 'btn-light text-muted'
                  }`}
                  onClick={() => setRole('provider')}
                >
                  <i className="bi bi-briefcase me-1"></i> Service Provider / Garage
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 small d-flex align-items-center mb-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">
                {role === 'customer' ? 'Personal Details' : 'Account Credentials & Owner'}
              </h6>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Rajesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Mobile Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Password (min 6 chars)</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Create a strong password"
                    minLength="6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-12">
                  <label className="form-label fw-semibold small text-muted">Address / Street</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Flat / Building, Street or Landmark"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Hyderabad Area</label>
                  <select className="form-select" value={area} onChange={(e) => setArea(e.target.value)} required>
                    {HYDERABAD_AREAS.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Pincode</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Selected area pincode"
                    value={pincode}
                    readOnly
                    required
                  />
                </div>
              </div>

              {/* Provider Specific Section */}
              {role === 'provider' && (
                <div className="mt-4 pt-3 border-top">
                  <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">
                    Business Profile & Location Setup
                  </h6>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">Business Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Apex Multi-Brand Auto Care"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">Owner Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Manoj Verma"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label fw-semibold small text-muted">Services Offered</label>
                      <div className="d-flex flex-wrap gap-2">
                        {['Car Rental', 'Car Mechanic', 'Car Washing'].map((svc) => (
                          <button
                            type="button"
                            key={svc}
                            className={`btn btn-sm rounded-pill ${
                              selectedServices.includes(svc)
                                ? 'btn-primary'
                                : 'btn-outline-secondary'
                            }`}
                            onClick={() => handleServiceToggle(svc)}
                          >
                            <i className="bi bi-check2 me-1"></i> {svc}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label fw-semibold small text-muted mb-0">GPS Latitude</label>
                        <button
                          type="button"
                          className="btn btn-link p-0 small text-decoration-none"
                          onClick={detectProviderGps}
                        >
                          <i className="bi bi-crosshair"></i> Use Current GPS
                        </button>
                      </div>
                      <input
                        type="number"
                        step="any"
                        className="form-control"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">GPS Longitude</label>
                      <input
                        type="number"
                        step="any"
                        className="form-control"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">Starting Price (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={startingPrice}
                        onChange={(e) => setStartingPrice(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label fw-semibold small text-muted">Business Description</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Tell car owners about your specialty, workshop equipment, or fleet details..."
                        value={businessDescription}
                        onChange={(e) => setBusinessDescription(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary-modern w-100 py-2 mt-4 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Registering...
                  </>
                ) : (
                  `Register as ${role === 'customer' ? 'Car Owner' : 'Service Provider'}`
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted small">Already have an account? </span>
              <Link to="/login" className="fw-semibold text-primary text-decoration-none small">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
