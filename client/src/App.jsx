import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
const PublicLayout = lazy(() => import('./layouts/PublicLayout'));
const CustomerLayout = lazy(() => import('./layouts/CustomerLayout'));
const ProviderLayout = lazy(() => import('./layouts/ProviderLayout'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

// Components
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

// Public Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ServicesHub = lazy(() => import('./pages/ServicesHub'));
const RentalService = lazy(() => import('./pages/RentalService'));
const MechanicService = lazy(() => import('./pages/MechanicService'));
const CarWashService = lazy(() => import('./pages/CarWashService'));
const ProviderSearch = lazy(() => import('./pages/ProviderSearch'));
const ProviderDetail = lazy(() => import('./pages/ProviderDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Customer Pages
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const CustomerProfile = lazy(() => import('./pages/CustomerProfile'));
const CustomerVehicles = lazy(() => import('./pages/CustomerVehicles'));
const AddVehicle = lazy(() => import('./pages/AddVehicle'));
const CustomerBookings = lazy(() => import('./pages/CustomerBookings'));
const BookingDetail = lazy(() => import('./pages/BookingDetail'));
const CustomerReviews = lazy(() => import('./pages/CustomerReviews'));

// Provider Pages
const ProviderDashboard = lazy(() => import('./pages/ProviderDashboard'));
const ProviderProfile = lazy(() => import('./pages/ProviderProfile'));
const ProviderServices = lazy(() => import('./pages/ProviderServices'));
const ProviderBookings = lazy(() => import('./pages/ProviderBookings'));
const ProviderAvailability = lazy(() => import('./pages/ProviderAvailability'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminCustomers = lazy(() => import('./pages/AdminCustomers'));
const AdminProviders = lazy(() => import('./pages/AdminProviders'));
const AdminServices = lazy(() => import('./pages/AdminServices'));
const AdminBookings = lazy(() => import('./pages/AdminBookings'));
const AdminReviews = lazy(() => import('./pages/AdminReviews'));

function App() {
  return (
    <Suspense fallback={<div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading page…</span></div></div>}>
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<ServicesHub />} />
        <Route path="/services/rental" element={<RentalService />} />
        <Route path="/services/mechanic" element={<MechanicService />} />
        <Route path="/services/car-wash" element={<CarWashService />} />
        <Route path="/providers" element={<ProviderSearch />} />
        <Route path="/providers/:id" element={<ProviderDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Customer Protected Routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="vehicles" element={<CustomerVehicles />} />
        <Route path="vehicles/add" element={<AddVehicle />} />
        <Route path="bookings" element={<CustomerBookings />} />
        <Route path="bookings/:id" element={<BookingDetail />} />
        <Route path="reviews" element={<CustomerReviews />} />
      </Route>

      {/* Provider Protected Routes */}
      <Route
        path="/provider"
        element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/provider/dashboard" replace />} />
        <Route path="dashboard" element={<ProviderDashboard />} />
        <Route path="profile" element={<ProviderProfile />} />
        <Route path="services" element={<ProviderServices />} />
        <Route path="bookings" element={<ProviderBookings />} />
        <Route path="availability" element={<ProviderAvailability />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="providers" element={<AdminProviders />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="reviews" element={<AdminReviews />} />
      </Route>
    </Routes>
    </Suspense>
  );
}

export default App;
