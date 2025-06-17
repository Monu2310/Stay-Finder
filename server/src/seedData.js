const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Listing = require('./models/Listing');
const Booking = require('./models/Booking');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stayfinder');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        name: 'John Host',
        email: 'john@example.com',
        password: 'password123',
        role: 'host',
        bio: 'Experienced host with multiple properties across the city.'
      },
      {
        name: 'Sarah Host',
        email: 'sarah@example.com',
        password: 'password123',
        role: 'host',
        bio: 'Interior designer turned Airbnb host. Love creating beautiful spaces.'
      },
      {
        name: 'Mike Guest',
        email: 'mike@example.com',
        password: 'password123',
        role: 'guest'
      },
      {
        name: 'Lisa Guest',
        email: 'lisa@example.com',
        password: 'password123',
        role: 'guest'
      }
    ]);

    console.log('Created users');

    // Create sample listings
    const listings = await Listing.create([
      {
        title: 'Modern Downtown Apartment',
        description: 'Beautiful modern apartment in the heart of downtown. Perfect for business travelers and tourists alike. Close to restaurants, shopping, and public transportation.',
        type: 'apartment',
        location: {
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zipCode: '10001',
          latitude: 40.7128,
          longitude: -74.0060
        },
        price: 150,
        currency: 'USD',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            alt: 'Modern apartment living room'
          },
          {
            url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
            alt: 'Modern kitchen'
          },
          {
            url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
            alt: 'Bedroom'
          }
        ],
        amenities: ['wifi', 'kitchen', 'washer', 'dryer', 'tv', 'heating', 'air_conditioning', 'workspace', 'parking', 'pool', 'gym', 'linens', 'towels', 'coffee_maker'],
        capacity: {
          guests: 4,
          bedrooms: 2,
          bathrooms: 2,
          beds: 2
        },
        host: users[0]._id,
        rating: {
          average: 4.8,
          count: 24
        }
      },
      {
        title: 'Cozy Studio Near Central Park',
        description: 'Charming studio apartment just minutes from Central Park. Perfect for couples or solo travelers. Newly renovated with all modern amenities.',
        type: 'studio',
        location: {
          address: '456 Park Avenue',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zipCode: '10022',
          latitude: 40.7589,
          longitude: -73.9851
        },
        price: 120,
        currency: 'USD',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
            alt: 'Cozy studio apartment'
          },
          {
            url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
            alt: 'Studio kitchenette'
          }
        ],
        amenities: ['wifi', 'kitchen', 'tv', 'heating', 'air_conditioning', 'workspace', 'linens', 'towels', 'coffee_maker', 'hair_dryer'],
        capacity: {
          guests: 2,
          bedrooms: 0,
          bathrooms: 1,
          beds: 1
        },
        host: users[0]._id,
        rating: {
          average: 4.6,
          count: 18
        }
      },
      {
        title: 'Spacious Family House with Garden',
        description: 'Perfect family retreat with a beautiful garden. 3 bedrooms, 2 bathrooms, and plenty of space for everyone. Great neighborhood with parks nearby.',
        type: 'house',
        location: {
          address: '789 Oak Street',
          city: 'Brooklyn',
          state: 'NY',
          country: 'USA',
          zipCode: '11201',
          latitude: 40.6892,
          longitude: -73.9442
        },
        price: 200,
        currency: 'USD',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
            alt: 'Family house exterior'
          },
          {
            url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
            alt: 'Spacious living room'
          },
          {
            url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
            alt: 'Garden view'
          }
        ],
        amenities: ['wifi', 'parking', 'kitchen', 'washer', 'dryer', 'tv', 'heating', 'air_conditioning', 'pets_allowed', 'garden', 'fireplace', 'dining_table', 'linens', 'towels'],
        capacity: {
          guests: 6,
          bedrooms: 3,
          bathrooms: 2,
          beds: 3
        },
        host: users[1]._id,
        rating: {
          average: 4.9,
          count: 32
        }
      },
      {
        title: 'Luxury Loft in SoHo',
        description: 'Stunning luxury loft in the heart of SoHo. High ceilings, exposed brick, and designer furnishings. Walking distance to galleries, restaurants, and shopping.',
        type: 'loft',
        location: {
          address: '101 Spring Street',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zipCode: '10012',
          latitude: 40.7242,
          longitude: -74.0020
        },
        price: 300,
        currency: 'USD',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            alt: 'Luxury loft interior'
          },
          {
            url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            alt: 'Designer kitchen'
          },
          {
            url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
            alt: 'Master bedroom'
          }
        ],
        amenities: ['wifi', 'kitchen', 'washer', 'dryer', 'tv', 'heating', 'air_conditioning', 'workspace', 'gym'],
        capacity: {
          guests: 4,
          bedrooms: 2,
          bathrooms: 2,
          beds: 2
        },
        host: users[1]._id,
        rating: {
          average: 4.7,
          count: 15
        }
      },
      {
        title: 'Beachfront Villa with Ocean Views',
        description: 'Spectacular beachfront villa with panoramic ocean views. Private beach access, infinity pool, and luxury amenities. Perfect for a romantic getaway or family vacation.',
        type: 'villa',
        location: {
          address: '555 Ocean Drive',
          city: 'Miami Beach',
          state: 'FL',
          country: 'USA',
          zipCode: '33139',
          latitude: 25.7907,
          longitude: -80.1300
        },
        price: 500,
        currency: 'USD',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
            alt: 'Beachfront villa exterior'
          },
          {
            url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
            alt: 'Infinity pool'
          },
          {
            url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
            alt: 'Ocean view bedroom'
          }
        ],
        amenities: ['wifi', 'parking', 'pool', 'kitchen', 'washer', 'dryer', 'tv', 'heating', 'air_conditioning', 'workspace', 'balcony', 'sound_system', 'coffee_maker', 'linens'],
        capacity: {
          guests: 8,
          bedrooms: 4,
          bathrooms: 3,
          beds: 4
        },
        host: users[1]._id,
        rating: {
          average: 5.0,
          count: 8
        }
      },
      {
        title: 'Mountain Cabin Retreat',
        description: 'Peaceful mountain cabin surrounded by nature. Perfect for hiking enthusiasts and those seeking tranquility. Fireplace, hot tub, and stunning mountain views.',
        type: 'cabin',
        location: {
          address: '777 Mountain Trail',
          city: 'Aspen',
          state: 'CO',
          country: 'USA',
          zipCode: '81611',
          latitude: 39.1911,
          longitude: -106.8175
        },
        price: 250,
        currency: 'USD',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
            alt: 'Mountain cabin exterior'
          },
          {
            url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
            alt: 'Cabin interior with fireplace'
          },
          {
            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            alt: 'Mountain views'
          }
        ],
        amenities: ['wifi', 'parking', 'kitchen', 'washer', 'tv', 'heating', 'pets_allowed'],
        capacity: {
          guests: 6,
          bedrooms: 3,
          bathrooms: 2,
          beds: 3
        },
        host: users[0]._id,
        rating: {
          average: 4.8,
          count: 21
        }
      }
    ]);

    console.log('Created listings');

    // Create sample bookings
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 7);
    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 10);

    const bookings = await Booking.create([
      {
        listing: listings[0]._id,
        guest: users[2]._id,
        host: users[0]._id,
        checkIn: futureDate1,
        checkOut: futureDate2,
        guests: 2,
        totalPrice: 450,
        status: 'confirmed',
        guestDetails: {
          name: 'Mike Guest',
          email: 'mike@example.com',
          phone: '+1-555-0123'
        }
      }
    ]);

    console.log('Created bookings');
    console.log('Seed data created successfully!');
    
    console.log('\n=== Sample Users ===');
    console.log('Host 1: john@example.com / password123');
    console.log('Host 2: sarah@example.com / password123');
    console.log('Guest 1: mike@example.com / password123');
    console.log('Guest 2: lisa@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
