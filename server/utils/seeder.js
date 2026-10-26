const dotenv = require('dotenv');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { HYDERABAD_AREAS, isWithinHyderabad } = require('./geoUtils');

dotenv.config();

const seedData = async ({ reset = false } = {}) => {
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0 && !reset) {
    console.log('[Seeder] Existing users found. Database left unchanged; pass --reset to replace demo data.');
    return;
  }

  if (reset) {
    console.log('[Seeder] Reset requested; clearing collections before seeding demo data.');
    await Review.deleteMany();
    await Booking.deleteMany();
    await Service.deleteMany();
    await Provider.deleteMany();
    await Vehicle.deleteMany();
    await User.deleteMany();
  }

  const area = (name) => HYDERABAD_AREAS.find((item) => item.name === name) || HYDERABAD_AREAS[0];
  const [admin, customer, secondCustomer, mechanicUser, washUser, rentalUser, pendingUser] = await User.create([
    { name: 'CarCare Administrator', email: 'admin@carcare.com', phone: '+91 9820011223', password: 'password123', role: 'admin', address: 'HITEC City, Hyderabad', city: 'Hyderabad', area: 'HITEC City', pincode: area('HITEC City').pincode },
    { name: 'Rajesh Kumar', email: 'rajesh.kumar@example.com', phone: '+91 9820123456', password: 'password123', role: 'customer', address: 'Gachibowli, Hyderabad', city: 'Hyderabad', area: 'Gachibowli', pincode: area('Gachibowli').pincode },
    { name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 9845678901', password: 'password123', role: 'customer', address: 'Kondapur, Hyderabad', city: 'Hyderabad', area: 'Kondapur', pincode: area('Kondapur').pincode },
    { name: 'Manoj Verma', email: 'apex.mechanic@carcare.com', phone: '+91 9820556677', password: 'password123', role: 'provider', address: 'Ameerpet, Hyderabad', city: 'Hyderabad', area: 'Ameerpet', pincode: area('Ameerpet').pincode },
    { name: 'Kunal Singhal', email: 'crystalclear@carcare.com', phone: '+91 9821334455', password: 'password123', role: 'provider', address: 'Jubilee Hills, Hyderabad', city: 'Hyderabad', area: 'Jubilee Hills', pincode: area('Jubilee Hills').pincode },
    { name: 'Sunil Rao', email: 'speedywheels@carcare.com', phone: '+91 9820998811', password: 'password123', role: 'provider', address: 'Gachibowli, Hyderabad', city: 'Hyderabad', area: 'Gachibowli', pincode: area('Gachibowli').pincode },
    { name: 'Kavita Nair', email: 'elitegarage@carcare.com', phone: '+91 9820778899', password: 'password123', role: 'provider', address: 'Madhapur, Hyderabad', city: 'Hyderabad', area: 'Madhapur', pincode: area('Madhapur').pincode },
  ]);

  const providerConfigs = [
    { user: mechanicUser, area: 'Ameerpet', name: 'Apex Auto Diagnostics & Garage', services: ['Car Mechanic', 'Car Washing'], verified: 'approved', rating: 4.9, startingPrice: 599, imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80' },
    { user: washUser, area: 'Jubilee Hills', name: 'CrystalClear Eco Car Spa & Detailing', services: ['Car Washing'], verified: 'approved', rating: 4.9, startingPrice: 499, imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80' },
    { user: rentalUser, area: 'Gachibowli', name: 'SpeedyWheels Self-Drive Hub', services: ['Car Rental'], verified: 'approved', rating: 4.8, startingPrice: 1799, imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80' },
    { user: pendingUser, area: 'Madhapur', name: 'Elite Car Lounge & Rentals', services: ['Car Mechanic', 'Car Rental'], verified: 'pending', rating: 5, startingPrice: 999, imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80' },
  ];

  const providers = [];
  for (const config of providerConfigs) {
    const location = area(config.area);
    providers.push(await Provider.create({
      userId: config.user._id,
      businessName: config.name,
      ownerName: config.user.name,
      description: `Trusted car care services in ${config.area}, Hyderabad.`,
      phone: config.user.phone,
      address: `${config.area}, Hyderabad`,
      city: 'Hyderabad',
      area: location.name,
      pincode: location.pincode,
      latitude: location.lat,
      longitude: location.lng,
      services: config.services,
      verified: config.verified,
      rating: config.rating,
      reviewCount: config.verified === 'approved' ? 24 : 0,
      startingPrice: config.startingPrice,
      imageUrl: config.imageUrl,
    }));
  }

  const serviceConfigs = [
    { provider: providers[0], category: 'Car Mechanic', serviceName: 'General Service & Diagnostics', description: 'Engine scan, oil and filter service, and a safety inspection.', price: 2499, duration: '3 hours', features: ['OBD scan', 'Oil and filter check', 'Brake inspection'] },
    { provider: providers[0], category: 'Car Mechanic', serviceName: 'Brake Inspection & Repair', description: 'Brake noise diagnosis, pad inspection, and repair estimate.', price: 1599, duration: '2 hours', features: ['Brake pad check', 'Road test', 'Written estimate'] },
    { provider: providers[1], category: 'Car Washing', serviceName: 'Interior & Exterior Detail', description: 'Foam wash, interior vacuum, dashboard care, and tire dressing.', price: 999, duration: '2 hours', features: ['Foam wash', 'Interior vacuum', 'Tire dressing'] },
    { provider: providers[1], category: 'Car Washing', serviceName: 'Express Wash', description: 'A quick exterior wash and cabin tidy.', price: 499, duration: '45 minutes', features: ['Exterior wash', 'Cabin tidy'] },
    { provider: providers[2], category: 'Car Rental', serviceName: 'Compact SUV Daily Rental', description: 'Clean self-drive SUV with city pickup in Hyderabad.', price: 2199, duration: 'Per day', features: ['Unlimited city kilometers', 'Roadside assistance'], vehicleType: 'SUV' },
    { provider: providers[2], category: 'Car Rental', serviceName: 'Premium Sedan Daily Rental', description: 'Comfortable sedan for local Hyderabad trips.', price: 1799, duration: 'Per day', features: ['Sanitized vehicle', 'Roadside assistance'], vehicleType: 'Sedan' },
  ];
  const services = await Service.create(serviceConfigs.map((service) => ({ ...service, providerId: service.provider._id })));

  const vehicles = await Vehicle.create([
    { customerId: customer._id, brand: 'Honda', model: 'City ZX', year: 2022, registrationNumber: 'TS-09-AB-1234', fuelType: 'Petrol', color: 'Pearl White' },
    { customerId: customer._id, brand: 'Hyundai', model: 'Creta SX', year: 2023, registrationNumber: 'TS-09-CD-5678', fuelType: 'Diesel', color: 'Phantom Black' },
    { customerId: secondCustomer._id, brand: 'Tata', model: 'Nexon EV', year: 2024, registrationNumber: 'TS-09-EF-9012', fuelType: 'Electric', color: 'White' },
  ]);

  const completedBooking = await Booking.create({
    customerId: customer._id,
    providerId: providers[0]._id,
    vehicleId: vehicles[0]._id,
    serviceId: services[0]._id,
    bookingDate: new Date(Date.now() - 5 * 86400000),
    bookingTime: '10:30 AM',
    location: 'Ameerpet, Hyderabad',
    amount: services[0].price,
    status: 'COMPLETED',
    reviewed: true,
    statusHistory: [{ status: 'PENDING' }, { status: 'ACCEPTED' }, { status: 'IN_PROGRESS' }, { status: 'COMPLETED' }],
  });
  await Booking.create({
    customerId: customer._id,
    providerId: providers[2]._id,
    serviceId: services[4]._id,
    bookingDate: new Date(Date.now() + 2 * 86400000),
    bookingTime: '09:00 AM',
    returnDate: new Date(Date.now() + 4 * 86400000),
    location: 'Gachibowli, Hyderabad',
    amount: services[4].price,
    status: 'PENDING',
    statusHistory: [{ status: 'PENDING' }],
  });
  await Review.create({
    customerId: customer._id,
    providerId: providers[0]._id,
    bookingId: completedBooking._id,
    rating: 5,
    comment: 'Clear diagnostics, careful work, and a helpful explanation of the repair.',
  });
  console.log(`[Seeder] Created demo data for ${admin.email} and Hyderabad areas.`);
};

const migrateLegacyLocationData = async () => {
  const users = await User.find();
  for (const [index, user] of users.entries()) {
    const selectedArea = HYDERABAD_AREAS.find((item) => item.name === user.area) || HYDERABAD_AREAS[index % HYDERABAD_AREAS.length];
    const outsideCity = user.city !== 'Hyderabad';
    const needsAddress = outsideCity || !String(user.address || '').toLowerCase().includes(selectedArea.name.toLowerCase());
    if (outsideCity || user.area !== selectedArea.name || user.pincode !== selectedArea.pincode || needsAddress) {
      user.city = 'Hyderabad';
      user.area = selectedArea.name;
      user.pincode = selectedArea.pincode;
      if (needsAddress) user.address = `${selectedArea.name}, Hyderabad`;
      await user.save();
    }
  }

  const providers = await Provider.find();
  for (const [index, provider] of providers.entries()) {
    const selectedArea = HYDERABAD_AREAS.find((item) => item.name === provider.area) || HYDERABAD_AREAS[index % HYDERABAD_AREAS.length];
    const outsideCity = provider.city !== 'Hyderabad' || !isWithinHyderabad(provider.latitude, provider.longitude);
    const needsAddress = outsideCity || !String(provider.address || '').toLowerCase().includes(selectedArea.name.toLowerCase());
    if (outsideCity || provider.area !== selectedArea.name || provider.pincode !== selectedArea.pincode || needsAddress) {
      provider.city = 'Hyderabad';
      provider.area = selectedArea.name;
      provider.pincode = selectedArea.pincode;
      provider.latitude = selectedArea.lat;
      provider.longitude = selectedArea.lng;
      if (needsAddress) provider.address = `${selectedArea.name}, Hyderabad`;
      await provider.save();
    }
  }

  const bookings = await Booking.find();
  for (const booking of bookings) {
    const hasHyderabadArea = HYDERABAD_AREAS.some((item) => String(booking.location || '').toLowerCase().includes(item.name.toLowerCase()));
    if (!hasHyderabadArea) {
      const provider = providers.find((item) => item._id.equals(booking.providerId));
      if (provider) {
        booking.location = `${provider.area}, Hyderabad`;
        await booking.save();
      }
    }
  }
};

const seedIfNeeded = async () => {
  await migrateLegacyLocationData();
  if (await User.countDocuments() === 0) await seedData();
  else console.log('[Seeder] Existing user data retained.');
};

if (require.main === module) {
  const connectDB = require('../config/db');
  (async () => {
    try {
      await connectDB();
      await seedData({ reset: process.argv.includes('--reset') });
      process.exit(0);
    } catch (err) {
      console.error('[Seeder Error]', err);
      process.exit(1);
    }
  })();
}

module.exports = { seedData, seedIfNeeded, migrateLegacyLocationData };
