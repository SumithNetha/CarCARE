import React, { useState } from 'react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container py-5">
      <div className="text-center max-w-700 mx-auto mb-5">
        <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-1 mb-2 rounded-pill">
          WE ARE HERE TO HELP
        </span>
        <h1 className="display-5 fw-bold mb-2">Contact & Roadside Assistance</h1>
        <p className="text-muted">
          Need help with a booking, roadside emergency, or want to partner your garage? Reach out 24/7.
        </p>
      </div>

      <div className="row g-5">
        {/* Contact Info */}
        <div className="col-lg-5">
          <div className="card modern-card p-4 border-0 shadow-sm rounded-4 h-100 bg-white">
            <h4 className="fw-bold mb-4">Contact Information</h4>

            <div className="d-flex align-items-start gap-3 mb-4">
              <div className="bg-primary text-white rounded-3 p-3 d-flex align-items-center justify-content-center">
                <i className="bi bi-telephone-fill fs-5"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1">Toll-Free Support Line</h6>
                <p className="text-muted small mb-0">1800-200-8888 (24x7 Roadside & Helpline)</p>
                <p className="text-primary small fw-semibold">+91 98200 11223 (WhatsApp)</p>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-4">
              <div className="bg-danger text-white rounded-3 p-3 d-flex align-items-center justify-content-center">
                <i className="bi bi-envelope-fill fs-5"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1">Email Enquiries</h6>
                <p className="text-muted small mb-0">support@carcareconnect.com</p>
                <p className="text-muted small mb-0">partners@carcareconnect.com</p>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-4">
              <div className="bg-success text-white rounded-3 p-3 d-flex align-items-center justify-content-center">
                <i className="bi bi-geo-alt-fill fs-5"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1">Corporate Headquarters</h6>
                <p className="text-muted small mb-0">
                  CarCare Connect Technologies Ltd.<br />
                  HITEC City, Hyderabad,<br />
                  Hyderabad, Telangana
                </p>
              </div>
            </div>

            {/* Emergency Assistance card */}
            <div className="p-3 bg-danger bg-opacity-10 border border-danger-subtle rounded-3 mt-auto">
              <div className="d-flex align-items-center gap-2 text-danger fw-bold mb-1">
                <i className="bi bi-exclamation-triangle-fill"></i> Immediate Breakdown?
              </div>
              <p className="text-secondary small mb-2">
                If your car is stalled on the highway or in city traffic, our emergency towing team is 1 click away.
              </p>
              <a href="tel:18002008888" className="btn btn-danger btn-sm w-100 fw-semibold rounded-pill">
                <i className="bi bi-telephone-outbound me-1"></i> Call Emergency Towing
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="col-lg-7">
          <div className="card modern-card p-4 p-md-5 border-0 shadow-sm rounded-4 bg-white">
            <h4 className="fw-bold mb-3">Send Us a Message</h4>

            {submitted ? (
              <div className="alert alert-success p-4 text-center rounded-4">
                <i className="bi bi-check-circle-fill fs-1 text-success mb-2 d-block"></i>
                <h5 className="fw-bold">Message Sent Successfully!</h5>
                <p className="text-muted small mb-0">
                  Our customer support representative will review your message and reply via email within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Vikram Singh"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="vikram@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Subject / Topic</label>
                    <select
                      className="form-select"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    >
                      <option value="">Select Topic</option>
                      <option value="Booking Inquiry">Booking Inquiry</option>
                      <option value="Provider Partnership">Provider Partnership</option>
                      <option value="Billing / Payment">Billing / Payment</option>
                      <option value="Roadside Emergency">Roadside Emergency</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label small fw-semibold text-muted">Message</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Describe your question or feedback..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-primary-modern w-100 py-2 fw-semibold">
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
