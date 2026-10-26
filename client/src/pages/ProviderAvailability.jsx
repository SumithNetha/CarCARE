import React, { useState, useEffect } from 'react';
import api from '../services/api';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DEFAULT_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];

const ProviderAvailability = () => {
  const [workingDays, setWorkingDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
  const [openTime, setOpenTime] = useState('09:00 AM');
  const [closeTime, setCloseTime] = useState('07:00 PM');
  const [timeSlots, setTimeSlots] = useState(['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM']);
  const [newSlotInput, setNewSlotInput] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const res = await api.get('/providers/me/profile');
        if (res.data.success) {
          const prov = res.data.data;
          if (prov.workingDays?.length) setWorkingDays(prov.workingDays);
          if (prov.workingHours?.open) setOpenTime(prov.workingHours.open);
          if (prov.workingHours?.close) setCloseTime(prov.workingHours.close);
          if (prov.availableTimeSlots?.length) setTimeSlots(prov.availableTimeSlots);
        }
      } catch (err) {
        console.error('Failed to load availability:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const handleDayToggle = (day) => {
    if (workingDays.includes(day)) {
      if (workingDays.length === 1) return;
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const handleAddSlot = () => {
    if (!newSlotInput.trim()) return;
    if (!timeSlots.includes(newSlotInput.trim())) {
      setTimeSlots([...timeSlots, newSlotInput.trim()]);
    }
    setNewSlotInput('');
  };

  const handleRemoveSlot = (slot) => {
    setTimeSlots(timeSlots.filter((s) => s !== slot));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const res = await api.put('/providers/me/availability', {
        workingDays,
        workingHours: { open: openTime, close: closeTime },
        availableTimeSlots: timeSlots,
      });

      if (res.data.success) {
        setSuccessMsg('Operating schedule and appointment slots updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card modern-card p-5 text-center bg-white border-0 shadow-sm rounded-4">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="card modern-card p-4 p-md-5 border-0 shadow-sm rounded-4 bg-white max-w-700">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h4 className="fw-bold mb-1">Operating Schedule & Slots</h4>
          <p className="text-muted small mb-0">Control when customers can book appointments at your facility.</p>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success py-2 px-3 small d-flex align-items-center mb-3">
          <i className="bi bi-check-circle-fill me-2"></i> {successMsg}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Working Days */}
        <div className="mb-4">
          <label className="form-label small fw-semibold text-muted d-block">Working Days</label>
          <div className="d-flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day}
                type="button"
                className={`btn btn-sm rounded-pill px-3 ${
                  workingDays.includes(day)
                    ? 'btn-primary text-white shadow-sm'
                    : 'btn-outline-secondary'
                }`}
                onClick={() => handleDayToggle(day)}
              >
                <i className={`bi ${workingDays.includes(day) ? 'bi-check2' : 'bi-dash'} me-1`}></i>
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Working Hours */}
        <div className="row g-3 mb-4">
          <div className="col-6">
            <label className="form-label small fw-semibold text-muted">Daily Opening Time</label>
            <input
              type="text"
              className="form-control"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              placeholder="e.g. 09:00 AM"
              required
            />
          </div>
          <div className="col-6">
            <label className="form-label small fw-semibold text-muted">Daily Closing Time</label>
            <input
              type="text"
              className="form-control"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              placeholder="e.g. 07:00 PM"
              required
            />
          </div>
        </div>

        {/* Time Slots */}
        <div className="mb-4 pb-3 border-bottom">
          <label className="form-label small fw-semibold text-muted d-block">
            Configured Booking Time Slots
          </label>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {timeSlots.map((slot) => (
              <span key={slot} className="badge bg-light text-dark border p-2 rounded-3 d-inline-flex align-items-center gap-2">
                <i className="bi bi-clock text-primary"></i>
                <span className="fw-semibold">{slot}</span>
                <button
                  type="button"
                  className="btn btn-link text-danger p-0 border-0"
                  onClick={() => handleRemoveSlot(slot)}
                  title="Remove slot"
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              </span>
            ))}
          </div>

          {/* Add custom slot */}
          <div className="input-group" style={{ maxWidth: '300px' }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="e.g. 01:30 PM"
              value={newSlotInput}
              onChange={(e) => setNewSlotInput(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={handleAddSlot}
            >
              + Add Slot
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary-modern w-100 py-2 fw-semibold" disabled={saving}>
          {saving ? 'Saving...' : 'Save Availability Schedule'}
        </button>
      </form>
    </div>
  );
};

export default ProviderAvailability;
