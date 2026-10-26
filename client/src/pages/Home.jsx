import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useLocation, HYDERABAD_AREAS } from '../context/LocationContext';
import ProviderCard from '../components/ProviderCard';
import BookingModal from '../components/BookingModal';

const Home = () => {
  const { city, area, coordinates, selectCity, detectLocation, isDetecting } = useLocation();
  const navigate = useNavigate();

  const [topProviders, setTopProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState(null);

  // Quick search states
  const [searchService, setSearchService] = useState('All');

  useEffect(() => {
    const fetchTopProviders = async () => {
      setLoading(true);
      try {
        let url = `/providers?sortBy=distance&sortOrder=asc`;
        if (Number.isFinite(coordinates?.lat) && Number.isFinite(coordinates?.lng)) {
          url += `&lat=${coordinates.lat}&lng=${coordinates.lng}`;
        } else if (city) {
          url += `&city=${encodeURIComponent(city)}`;
        }

        const res = await api.get(url);
        if (res.data.success) {
          setTopProviders(res.data.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch providers for home:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProviders();
  }, [coordinates, city]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    navigate(`/providers?service=${encodeURIComponent(searchService)}&area=${encodeURIComponent(area)}`);
  };

  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <section className="hero-gradient py-5 py-lg-6 position-relative">
        <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-7 text-center text-lg-start">
              <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-10 border border-white border-opacity-20 px-3 py-1 rounded-pill mb-3">
                <span className="badge bg-primary">NEW</span>
                <span className="small text-white-50">On-demand doorstep & garage care</span>
              </div>

              <h1 className="display-4 fw-extrabold text-white mb-3">
                Everything Your Car Needs, <span className="text-primary text-gradient">Near You.</span>
              </h1>

              <p className="lead text-white-50 mb-4 pe-lg-4 fs-5">
                Find trusted mechanics, car washes and rental cars from service providers near you. 
                Transparent pricing, verified technicians, and effortless digital booking.
              </p>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start mb-4">
                <Link to="/services" className="btn btn-primary-modern px-4 py-3 fs-6">
                  <i className="bi bi-search"></i> Find a Service
                </Link>
                <Link to="/register?role=provider" className="btn btn-outline-light px-4 py-3 rounded-3 fw-semibold">
                  <i className="bi bi-briefcase"></i> Become a Provider
                </Link>
              </div>

              {/* Quick Search Floating Bar */}
              <div className="card border-0 shadow-lg p-2 rounded-4 bg-white mt-4">
                <form onSubmit={handleHeroSearch} className="row g-2 align-items-center p-2">
                  <div className="col-md-5">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-0 text-primary">
                        <i className="bi bi-gear-wide-connected fs-5"></i>
                      </span>
                      <select
                        className="form-select border-0 shadow-none fw-semibold"
                        value={searchService}
                        onChange={(e) => setSearchService(e.target.value)}
                      >
                        <option value="All">All Services</option>
                        <option value="Car Rental">Car Rental</option>
                        <option value="Car Mechanic">Car Mechanic & Repair</option>
                        <option value="Car Washing">Car Wash & Detailing</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4 border-start-md">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-0 text-danger">
                        <i className="bi bi-geo-alt-fill fs-5"></i>
                      </span>
                      <select
                        className="form-select border-0 shadow-none fw-semibold"
                        value={area === 'Current location' ? 'HITEC City' : area}
                        onChange={(e) => selectCity(e.target.value)}
                      >
                        {HYDERABAD_AREAS.map((item) => (
                          <option key={item.name} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn btn-link text-primary p-0 pe-2"
                        title="Detect GPS"
                        onClick={detectLocation}
                        disabled={isDetecting}
                      >
                        <i className="bi bi-crosshair"></i>
                      </button>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <button type="submit" className="btn btn-primary-modern w-100 py-2">
                      <i className="bi bi-arrow-right"></i> Search
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Hero Visual / Stat Banner */}
            <div className="col-lg-5 d-none d-lg-block">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80"
                  alt="CarCare Connect Hub"
                  className="img-fluid rounded-4 shadow-2xl border border-secondary"
                  style={{ maxHeight: '420px', width: '100%', objectFit: 'cover' }}
                />
                
                {/* Floating Badge 1 */}
                <div
                  className="card modern-card p-3 position-absolute shadow-lg border-0"
                  style={{ bottom: '-20px', left: '-20px', maxWidth: '230px' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-success text-white rounded-circle p-2 d-flex">
                      <i className="bi bi-shield-check fs-5"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0 small">100% Verified</h6>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>OEM Certified Garages</span>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div
                  className="card modern-card p-3 position-absolute shadow-lg border-0"
                  style={{ top: '20px', right: '-20px', maxWidth: '210px' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-warning text-dark rounded-circle p-2 d-flex">
                      <i className="bi bi-star-fill fs-5"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0 small">4.9 / 5.0 Rating</h6>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>10,000+ Happy Drivers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICE SECTION ================= */}
      <section className="py-5 py-lg-6 bg-white">
        <div className="container">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-1 mb-2 rounded-pill">
              OUR CORE SERVICES
            </span>
            <h2 className="display-6 fw-bold">Comprehensive Care For Your Automobile</h2>
            <p className="text-muted">
              Choose from our verified partner network for self-drive travel, expert mechanical restoration, or spa-grade car washes.
            </p>
          </div>

          <div className="row g-4">
            {/* Card 1: Car Rental */}
            <div className="col-lg-4 col-md-6">
              <div className="card modern-card card-service-interactive h-100">
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
                    alt="Car Rental"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge-service badge-rental">CAR RENTAL</span>
                    <span className="text-muted small">From ₹1,799 / day</span>
                  </div>
                  <h4 className="fw-bold mb-2">Car Rental</h4>
                  <p className="text-muted mb-4 flex-grow-1">
                    Rent the right car for your journey. Hatchbacks, compact SUVs, and luxury electric vehicles with zero security deposit options.
                  </p>
                  <ul className="list-unstyled small mb-4 text-secondary d-flex flex-column gap-2">
                    <li><i className="bi bi-check2 text-primary me-2 fw-bold"></i> Browse self-drive fleets</li>
                    <li><i className="bi bi-check2 text-primary me-2 fw-bold"></i> Select pickup & return dates</li>
                    <li><i className="bi bi-check2 text-primary me-2 fw-bold"></i> Compare prices with insurance</li>
                  </ul>
                  <Link to="/services/rental" className="btn btn-outline-primary w-100 py-2 fw-semibold rounded-3">
                    Explore Rental Cars →
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Car Mechanic */}
            <div className="col-lg-4 col-md-6">
              <div className="card modern-card card-service-interactive h-100">
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80"
                    alt="Car Mechanic"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge-service badge-mechanic">CAR MECHANIC</span>
                    <span className="text-muted small">From ₹499</span>
                  </div>
                  <h4 className="fw-bold mb-2">Car Mechanic</h4>
                  <p className="text-muted mb-4 flex-grow-1">
                    Find trusted mechanics near you. Computerized diagnostics, periodic general service, brake repairs, and roadside jumpstarts.
                  </p>
                  <ul className="list-unstyled small mb-4 text-secondary d-flex flex-column gap-2">
                    <li><i className="bi bi-check2 text-primary me-2 fw-bold"></i> Select vehicle & problem symptoms</li>
                    <li><i className="bi bi-check2 text-primary me-2 fw-bold"></i> View verified ratings & hourly slots</li>
                    <li><i className="bi bi-check2 text-primary me-2 fw-bold"></i> Genuine OEM spare parts</li>
                  </ul>
                  <Link to="/services/mechanic" className="btn btn-outline-primary w-100 py-2 fw-semibold rounded-3">
                    Find Mechanics →
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3: Car Wash */}
            <div className="col-lg-4 col-md-6">
              <div className="card modern-card card-service-interactive h-100">
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80"
                    alt="Car Washing"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge-service badge-wash">CAR WASH</span>
                    <span className="text-muted small">From ₹399</span>
                  </div>
                  <h4 className="fw-bold mb-2">Car Wash</h4>
                  <p className="text-muted mb-4 flex-grow-1">
                    Get your car cleaned by professionals. High-pressure snow foam baths, interior sanitization, and 9H ceramic coating studios.
                  </p>
                  <ul className="list-unstyled small mb-4 text-secondary d-flex flex-column gap-2">
                    <li><i className="bi bi-check2 text-primary me-2 fw-bold"></i> Select wash package & add-ons</li>
                    <li><i className="bi bi-check2 text-primary me-2 fw-bold"></i> Doorstep or studio drop-off</li>
                    <li><i className="bi bi-check2 text-primary me-2 fw-bold"></i> Hydrophobic paint shine</li>
                  </ul>
                  <Link to="/services/car-wash" className="btn btn-outline-primary w-100 py-2 fw-semibold rounded-3">
                    View Wash Packages →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-5 py-lg-6 bg-light border-top border-bottom">
        <div className="container">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="badge bg-secondary-subtle text-dark fw-bold px-3 py-1 mb-2 rounded-pill">
              SIMPLE 4-STEP PROCESS
            </span>
            <h2 className="display-6 fw-bold">How CarCare Connect Works</h2>
            <p className="text-muted">
              Book a hassle-free service or car rental in less than 2 minutes.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-3 col-md-6 text-center">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100 border">
                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-4 mb-3"
                  style={{ width: '60px', height: '60px' }}
                >
                  1
                </div>
                <h5 className="fw-bold mb-2">Choose a Service</h5>
                <p className="text-muted small mb-0">
                  Select between Car Rental, Certified Mechanic repair, or Professional Car Wash detailing.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 text-center">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100 border">
                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-4 mb-3"
                  style={{ width: '60px', height: '60px' }}
                >
                  2
                </div>
                <h5 className="fw-bold mb-2">Find Nearby Providers</h5>
                <p className="text-muted small mb-0">
                  Use GPS or city filters to locate top-rated service partners closest to your coordinates.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 text-center">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100 border">
                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-4 mb-3"
                  style={{ width: '60px', height: '60px' }}
                >
                  3
                </div>
                <h5 className="fw-bold mb-2">Compare & Book</h5>
                <p className="text-muted small mb-0">
                  Check verified customer reviews, transparent pricing, pick preferred time slots and confirm instantly.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 text-center">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100 border">
                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-4 mb-3"
                  style={{ width: '60px', height: '60px' }}
                >
                  4
                </div>
                <h5 className="fw-bold mb-2">Get Your Service</h5>
                <p className="text-muted small mb-0">
                  Track live status updates from Pending to Completion. Rate your provider with verified stars.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= NEARBY PROVIDERS SECTION ================= */}
      <section className="py-5 py-lg-6 bg-white">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
            <div>
              <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-1 mb-2 rounded-pill">
                LOCAL DIRECTORY
              </span>
              <h2 className="display-6 fw-bold mb-1">Nearby Service Providers in {city}</h2>
              <p className="text-muted mb-0">
                Top rated garages, car spas, and rental agencies ready to serve you.
              </p>
            </div>
            <Link to="/providers" className="btn btn-outline-primary rounded-pill px-4 fw-semibold">
              Explore All Providers ({topProviders.length}+) →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2">Locating nearby service partners...</p>
            </div>
          ) : topProviders.length === 0 ? (
            <div className="text-center py-5 bg-light rounded-4">
              <i className="bi bi-geo-alt fs-1 text-muted mb-2 d-block"></i>
              <h5>No providers found in this area yet</h5>
              <p className="text-muted small">Try switching cities or selecting GPS auto-detect in the navbar.</p>
            </div>
          ) : (
            <div className="row g-4">
              {topProviders.map((provider) => (
                <div key={provider._id} className="col-lg-3 col-md-6">
                  <ProviderCard
                    provider={provider}
                    onBookNow={(p) => setSelectedProviderForBooking(p)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-5 py-lg-6 bg-light border-top">
        <div className="container">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-1 mb-2 rounded-pill">
              THE CARCARE ADVANTAGE
            </span>
            <h2 className="display-6 fw-bold">Why Car Owners Choose Us</h2>
            <p className="text-muted">
              Built by automotive enthusiasts and software engineers to remove friction from vehicle ownership.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="d-flex gap-3">
                <div className="bg-primary text-white rounded-3 p-3 d-flex flex-shrink-0 align-items-center justify-content-center" style={{ width: '54px', height: '54px' }}>
                  <i className="bi bi-geo-alt-fill fs-4"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Nearby Providers</h5>
                  <p className="text-muted small">
                    Smart GPS geolocation pins workshops and rental hubs within minutes of your location.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="d-flex gap-3">
                <div className="bg-success text-white rounded-3 p-3 d-flex flex-shrink-0 align-items-center justify-content-center" style={{ width: '54px', height: '54px' }}>
                  <i className="bi bi-patch-check-fill fs-4"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Verified Professionals</h5>
                  <p className="text-muted small">
                    Every service center is physically inspected, GST verified, and audited for certified tools.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="d-flex gap-3">
                <div className="bg-info text-white rounded-3 p-3 d-flex flex-shrink-0 align-items-center justify-content-center" style={{ width: '54px', height: '54px' }}>
                  <i className="bi bi-cash-coin fs-4"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Transparent Pricing</h5>
                  <p className="text-muted small">
                    No surprise charges or inflated spare markups. Upfront itemized quotes for every package.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="d-flex gap-3">
                <div className="bg-warning text-dark rounded-3 p-3 d-flex flex-shrink-0 align-items-center justify-content-center" style={{ width: '54px', height: '54px' }}>
                  <i className="bi bi-calendar2-check-fill fs-4"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Easy Booking</h5>
                  <p className="text-muted small">
                    Reserve dedicated repair bay slots or self-drive cars in seconds with zero paperwork friction.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="d-flex gap-3">
                <div className="bg-danger text-white rounded-3 p-3 d-flex flex-shrink-0 align-items-center justify-content-center" style={{ width: '54px', height: '54px' }}>
                  <i className="bi bi-chat-heart-fill fs-4"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Customer Reviews</h5>
                  <p className="text-muted small">
                    Authentic 1-5 star ratings permitted exclusively to customers with completed bookings.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="d-flex gap-3">
                <div className="bg-secondary text-white rounded-3 p-3 d-flex flex-shrink-0 align-items-center justify-content-center" style={{ width: '54px', height: '54px' }}>
                  <i className="bi bi-shield-lock-fill fs-4"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Service Warranty</h5>
                  <p className="text-muted small">
                    All mechanical repairs backed by 1,000 km or 30-day comprehensive workshop warranty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-5 bg-dark text-white">
        <div className="container py-4 text-center">
          <h2 className="display-6 fw-bold mb-3">Ready to Experience Frictionless Car Care?</h2>
          <p className="text-white-50 max-w-700 mx-auto mb-4">
            Join thousands of smart car owners who save time and money booking verified auto services.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/register" className="btn btn-primary-modern px-4 py-3">
              Register Your Vehicle Free
            </Link>
            <Link to="/providers" className="btn btn-outline-light px-4 py-3 rounded-3">
              Explore Nearby Garages
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Modal Trigger */}
      {selectedProviderForBooking && (
        <BookingModal
          provider={selectedProviderForBooking}
          onClose={() => setSelectedProviderForBooking(null)}
        />
      )}
    </div>
  );
};

export default Home;
