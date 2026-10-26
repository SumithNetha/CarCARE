# 🚗 CarCare Connect

> Modern, full-stack, responsive car-service marketplace connecting vehicle owners with nearby service providers for **Car Rental**, **Car Mechanic / Repair**, and **Car Washing / Detailing**.

![CarCare Connect Banner](https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80)

---

## 🌟 Key Features

### 1. 👥 Three Distinct User Roles
* **Customer**: Register cars, browse nearby services, book repair bays/rentals/washes, track live service milestones, and leave verified ratings.
* **Service Provider**: Manage service catalog & pricing, set availability schedules and hourly slots, accept/reject booking requests, track workshop progress, and earn revenue.
* **Administrator**: Platform supervision, provider verification approval/rejection workflows, customer moderation, booking ledger, and review management.

### 2. 📍 Location-Based Provider Search
* Real-time GPS auto-detection using browser geolocation.
* High-precision **Haversine Distance Formula** calculation from customer coordinates to workshops.
* Hyderabad-only search with area selection for Ameerpet, Attapur, Banjara Hills, Begumpet, Gachibowli, HITEC City, Jubilee Hills, Kondapur, Kukatpally, LB Nagar, Madhapur, Mehdipatnam, Miyapur, Secunderabad, and Uppal.
* GPS locations outside Hyderabad are rejected; provider registration and profile updates must use Hyderabad coordinates.
* Multi-parameter filtering: Distance slider (5–100 km), Service Category, Minimum Rating, and Max Starting Price.
* Sorting by Distance (Nearest first), Star Rating, and Price.
* Dual View: **Card Grid View** & **Interactive Leaflet Map View** with custom pins and direct booking popups.

### 3. 🛠️ Three Initial Core Services
* **Car Rental**: Browse self-drive fleets (Hatchbacks, SUVs, Luxury, EVs), select pickup & return dates, zero security deposit options, unlimited KMs, Fastag equipped.
* **Car Mechanic**: Select vehicle, pick problem symptoms (Engine Check OBD scan, Periodic General Service, Brakes, AC Overhaul, Battery Jumpstart), view genuine OEM parts and warranties.
* **Car Washing & Detailing**: Choose service tiers (Express Wash, 3M Interior/Exterior Spa, 9H Nano-Ceramic hydrophobic coating), doorstep or studio dropoff.

### 4. 📋 End-to-End Booking Lifecycle
* Multi-step direct booking modal with vehicle fleet selection, date & time slot picking, and celebratory confirmation.
* Status Tracking: `PENDING` ➔ `ACCEPTED` ➔ `IN_PROGRESS` ➔ `COMPLETED` (or `CANCELLED` / `REJECTED`).
* Status history timeline with timestamps and activity logs.

### 5. ⭐ Verified Reviews & Ratings
* Only customers with `COMPLETED` bookings can submit written reviews and 1–5 star ratings.
* Automatic aggregate rating recalculation hook updates provider ratings instantly.

---

## 💻 Tech Stack

* **Frontend**:
  * React.js (v18)
  * Vite
  * Bootstrap 5 & Bootstrap Icons
  * Custom Modern CSS Design System (Glassmorphism, Design Tokens, Micro-animations)
  * React Router (v6)
  * Leaflet & React-Leaflet (Interactive Maps)
  * Canvas Confetti (Delightful celebrations)
  * Axios
* **Backend**:
  * Node.js & Express.js
  * MongoDB & Mongoose
  * Automated embedded `mongodb-memory-server` fallback (guarantees 100% zero-configuration runnability even if local MongoDB is not installed)
  * JWT (JSON Web Tokens)
  * bcryptjs (Password Hashing)
  * Morgan & CORS

---

## 📂 Project Structure

```
CarCare/
├── client/                      # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/          # Navbar, Footer, ProviderCard, BookingModal, ReviewModal, Map, etc.
│   │   ├── context/             # AuthContext, LocationContext
│   │   ├── layouts/             # PublicLayout, CustomerLayout, ProviderLayout, AdminLayout
│   │   ├── pages/               # All 29 pages (Public, Customer, Provider, Admin)
│   │   ├── services/            # Axios API client with JWT interceptor
│   │   ├── styles/              # index.css design tokens
│   │   ├── App.jsx              # Router configuration
│   │   └── main.jsx             # Entrypoint
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                      # Node.js + Express REST API
│   ├── config/                  # MongoDB connection & in-memory fallback
│   ├── controllers/             # Auth, Vehicles, Providers, Services, Bookings, Reviews, Admin
│   ├── middleware/              # JWT auth protect, role authorize, centralized error handling
│   ├── models/                  # User, Vehicle, Provider, Service, Booking, Review
│   ├── routes/                  # REST route definitions
│   ├── utils/                   # Hyderabad area coordinates, Haversine distance, demo seeder and legacy data migration
│   ├── server.js                # Express app launcher & seeder hook
│   ├── .env                     # Local environment configuration
│   └── package.json
│
├── .env.example
├── README.md
└── package.json                 # Root script runner (concurrently)
```

---

## ⚡ Quick Start & Run Locally

### Prerequisites
* **Node.js** (v18+ recommended, tested on v24)
* **npm** (v9+)

### Installation
From the root workspace directory `d:\CarCare`:
```bash
# 1. Install root dependencies
npm install

# 2. Install server dependencies
cd server && npm install

# 3. Install client dependencies
cd ../client && npm install
```

### Running Both Servers Concurrently
From the root directory:
```bash
npm run dev
```
* **Frontend App**: [http://localhost:5173](http://localhost:5173)
* **Backend REST API**: [http://localhost:5000](http://localhost:5000)
* **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

> **💡 Zero-Config Database:**
> If you have a local MongoDB daemon running, the backend connects to `mongodb://localhost:27017/carcare_connect`.
> In development, if the local MongoDB server is unavailable, the server starts an embedded in-memory MongoDB instance and seeds demo data. Production requires the configured MongoDB connection.

---

## 🔑 Demo Login Credentials

The database comes pre-seeded with realistic sample accounts across all roles:

| Role | Name | Email | Password | Details |
| :--- | :--- | :--- | :--- | :--- |
| **🛡️ Admin** | CarCare Admin | `admin@carcare.com` | `password123` | Full access to verification, users & bookings |
| **🚗 Customer** | Rajesh Kumar | `rajesh.kumar@example.com` | `password123` | Gachibowli customer with Honda City and Hyundai Creta |
| **🚗 Customer** | Priya Sharma | `priya.sharma@example.com` | `password123` | Kondapur customer with Tata Nexon EV |
| **🔧 Provider** | Manoj Verma | `apex.mechanic@carcare.com` | `password123` | Apex Auto Diagnostics (Ameerpet) |
| **🔧 Provider** | Sunil Rao | `speedywheels@carcare.com` | `password123` | SpeedyWheels Self-Drive Hub (Gachibowli) |
| **🔧 Provider** | Kunal Singhal | `crystalclear@carcare.com` | `password123` | CrystalClear Eco Car Spa (Jubilee Hills) |
| **🔧 Provider** | Kavita Nair | `elitegarage@carcare.com` | `password123` | Elite Auto Lounge (Madhapur, pending approval demo) |

Running `npm run seed` leaves an existing database intact. To replace it with demo data, run `node utils/seeder.js --reset` from the `server` directory.

*(Quick 1-Click demo fill buttons are also available right on the `/login` screen!)*

---

## 📡 REST API Documentation

### Auth
* `POST /api/auth/register` - Register customer or provider
* `POST /api/auth/login` - Login with email and password
* `GET /api/auth/me` - Get current authenticated user
* `PUT /api/auth/profile` - Update customer profile & address

### Customer Vehicles
* `GET /api/vehicles` - List customer's vehicles
* `POST /api/vehicles` - Add new vehicle to fleet
* `GET /api/vehicles/:id` - Get vehicle details
* `PUT /api/vehicles/:id` - Update vehicle
* `DELETE /api/vehicles/:id` - Remove vehicle

### Service Providers & Search
* `GET /api/providers` - Location-based search (`lat`, `lng`, `city`, `pincode`, `maxDistance`, `service`, `minRating`, `maxPrice`, `sortBy`, `sortOrder`)
* `GET /api/providers/:id` - Provider profile, catalog & reviews
* `GET /api/providers/me/profile` - Logged in provider profile
* `PUT /api/providers/me/profile` - Update provider business details & GPS
* `PUT /api/providers/me/availability` - Update working hours, days & slots

### Services Catalog
* `GET /api/services` - Get services (filters: `providerId`, `category`)
* `POST /api/services` - Provider adds new service
* `PUT /api/services/:id` - Provider updates service
* `DELETE /api/services/:id` - Provider removes service

### Bookings
* `GET /api/bookings` - Role-aware bookings list
* `GET /api/bookings/:id` - Deep booking details & timeline tracking
* `POST /api/bookings` - Customer creates booking
* `PUT /api/bookings/:id/status` - Update status (`PENDING`, `ACCEPTED`, `REJECTED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`)
* `DELETE /api/bookings/:id` - Cancel booking

### Reviews
* `GET /api/reviews/provider/:providerId` - Public reviews for provider
* `POST /api/reviews` - Verified customer submits review for completed booking
* `GET /api/reviews/my` - Customer's submitted reviews

### Admin Management
* `GET /api/admin/stats` - Platform KPIs, GMV revenue & metrics
* `GET /api/admin/users` - Customer accounts list
* `PUT /api/admin/users/:id/status` - Activate / Deactivate user
* `GET /api/admin/providers` - Provider verification list
* `PUT /api/admin/providers/:id/approve` - Approve provider
* `PUT /api/admin/providers/:id/reject` - Reject provider
* `GET /api/admin/bookings` - Platform-wide bookings ledger
* `GET /api/admin/services` - Global services catalog
* `GET /api/admin/reviews` - Review moderation
* `DELETE /api/admin/reviews/:id` - Remove review

---

## 🎨 UI & UX Design Highlights

* **Typography**: Plus Jakarta Sans & Inter from Google Fonts.
* **Palette**: Professional deep navy/slate accents, crisp clean white card surfaces, brand primary royal blue (`#2563eb`), amber ratings (`#f59e0b`), emerald verified badges (`#10b981`).
* **Interactivity**: Micro-animations, responsive sidebar navigation, sticky filter bars, modal transitions, confetti celebrations on booking confirmation.
* **Real-time Map Integration**: Interactive OpenStreetMap / Leaflet map rendering workshop coordinates with popups, fully structured for seamless Google Maps API migration.
