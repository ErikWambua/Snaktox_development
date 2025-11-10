// backend/scripts/seedData.js
const mongoose = require('mongoose');
const User = require('../models/User');
const SnakeSpecies = require('../models/SnakeSpecies');
const Hospital = require('../models/Hospital');
const Analytics = require('../models/Analytics');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB...');

    // Clear existing data (optional - be careful in production)
    await User.deleteMany({});
    await SnakeSpecies.deleteMany({});
    await Hospital.deleteMany({});
    await Analytics.deleteMany({});

    console.log('Cleared existing data...');

    // Create admin user
    const adminUser = new User({
      email: 'admin@snaktox.org',
      password: 'admin123',
      role: 'ADMIN',
      profile: {
        firstName: 'System',
        lastName: 'Administrator',
        phone: '+254700000000',
        institution: 'SnaKTox',
        specialization: 'System Administration'
      }
    });
    await adminUser.save();
    console.log('Admin user created...');

    // Create sample snake species
    const snakeSpecies = [
      {
        scientificName: 'Dendroaspis polylepis',
        commonName: 'Black Mamba',
        localNames: ['Black Mamba', 'Mamba Mweusi'],
        venomType: 'neurotoxic',
        region: 'East Africa',
        riskLevel: 'CRITICAL',
        description: 'The black mamba is a highly venomous snake endemic to parts of sub-Saharan Africa. It is the second-longest venomous snake after the king cobra.',
        habitat: 'Savannah, woodland, rocky slopes',
        behavior: 'Terrestrial and diurnal. When threatened, it may raise up to one-third of its body off the ground.',
        firstAid: [
          'Keep victim calm and still',
          'Immobilize the bitten limb',
          'Seek immediate medical attention',
          'Do not apply tourniquet'
        ],
        medicalTreatment: [
          'Black mamba antivenom',
          'Respiratory support',
          'Cardiac monitoring',
          'Symptomatic treatment'
        ],
        images: [{
          url: '/images/black-mamba.jpg',
          isPrimary: true,
          credit: 'Wildlife Photography'
        }],
        verifiedBy: {
          name: 'Dr. Sarah Johnson',
          institution: 'KEMRI',
          date: new Date()
        }
      },
      {
        scientificName: 'Bitis arietans',
        commonName: 'Puff Adder',
        localNames: ['Puff Adder', 'Fira'],
        venomType: 'cytotoxic',
        region: 'East Africa',
        riskLevel: 'HIGH',
        description: 'The puff adder is a venomous viper species found in savannah and grasslands from Morocco and western Arabia throughout Africa.',
        habitat: 'Savannah, grassland, rocky areas',
        behavior: 'Nocturnal and terrestrial. Known for its characteristic defensive behavior of puffing and hissing loudly.',
        firstAid: [
          'Keep victim calm',
          'Immobilize the bitten area',
          'Remove tight clothing and jewelry',
          'Seek medical help immediately'
        ],
        medicalTreatment: [
          'Polyvalent antivenom',
          'Wound care and debridement',
          'Pain management',
          'Antibiotics if infected'
        ],
        images: [{
          url: '/images/puff-adder.jpg',
          isPrimary: true,
          credit: 'Herpetology Society'
        }],
        verifiedBy: {
          name: 'Dr. James Mwangi',
          institution: 'University of Nairobi',
          date: new Date()
        }
      },
      {
        scientificName: 'Dispholidus typus',
        commonName: 'Boomslang',
        localNames: ['Boomslang', 'Tree Snake'],
        venomType: 'hemotoxic',
        region: 'East Africa',
        riskLevel: 'HIGH',
        description: 'The boomslang is a highly venomous tree snake native to Sub-Saharan Africa.',
        habitat: 'Forests, wooded grasslands',
        behavior: 'Arboreal and diurnal. Known for its excellent camouflage.',
        firstAid: [
          'Keep victim calm and still',
          'Seek immediate medical attention',
          'Monitor for bleeding disorders'
        ],
        medicalTreatment: [
          'Boomslang antivenom',
          'Blood transfusion if needed',
          'Coagulation monitoring'
        ],
        images: [{
          url: '/images/boomslang.jpg',
          isPrimary: true,
          credit: 'Wildlife Photography'
        }],
        verifiedBy: {
          name: 'Dr. Sarah Johnson',
          institution: 'KEMRI',
          date: new Date()
        }
      }
    ];

    await SnakeSpecies.insertMany(snakeSpecies);
    console.log('Snake species created...');

    // Create sample hospitals
    const hospitals = [
      {
        name: 'Kenyatta National Hospital',
        location: {
          type: 'Point',
          coordinates: [36.8219, -1.2921],
          address: 'Hospital Road, Nairobi, Kenya',
          country: 'KE'
        },
        verifiedStatus: 'VERIFIED',
        contactInfo: {
          phone: '+254-20-2726300',
          emergency: '+254-722-123456',
          email: 'info@knh.or.ke',
          website: 'https://knh.or.ke'
        },
        antivenomStock: {
          polyvalent: 45,
          monovalent: 12,
          lastUpdated: new Date()
        },
        specialties: ['Emergency Medicine', 'Toxicology', 'Surgery', 'Critical Care'],
        operatingHours: {
          emergency: '24/7',
          general: '8:00 AM - 5:00 PM'
        },
        emergencyServices: true
      },
      {
        name: 'Moi Teaching and Referral Hospital',
        location: {
          type: 'Point',
          coordinates: [35.2833, 0.5167],
          address: 'Nandi Road, Eldoret, Kenya',
          country: 'KE'
        },
        verifiedStatus: 'VERIFIED',
        contactInfo: {
          phone: '+254-53-2033471',
          emergency: '+254-733-987654',
          email: 'info@mtrh.go.ke',
          website: 'https://mtrh.go.ke'
        },
        antivenomStock: {
          polyvalent: 28,
          monovalent: 8,
          lastUpdated: new Date()
        },
        specialties: ['Critical Care', 'Toxicology', 'Emergency Medicine'],
        operatingHours: {
          emergency: '24/7',
          general: '8:00 AM - 5:00 PM'
        },
        emergencyServices: true
      },
      {
        name: 'Nairobi Hospital',
        location: {
          type: 'Point',
          coordinates: [36.8106, -1.2684],
          address: 'Argwings Kodhek Road, Nairobi, Kenya',
          country: 'KE'
        },
        verifiedStatus: 'VERIFIED',
        contactInfo: {
          phone: '+254-20-2846000',
          emergency: '+254-728-606060',
          email: 'info@nairobihospital.org',
          website: 'https://nairobihospital.org'
        },
        antivenomStock: {
          polyvalent: 32,
          monovalent: 15,
          lastUpdated: new Date()
        },
        specialties: ['Emergency Medicine', 'Toxicology', 'Internal Medicine'],
        operatingHours: {
          emergency: '24/7',
          general: '8:00 AM - 6:00 PM'
        },
        emergencyServices: true
      }
    ];

    await Hospital.insertMany(hospitals);
    console.log('Hospitals created...');

    // Create sample analytics data
    const analyticsData = new Analytics({
      date: new Date(),
      metrics: {
        emergencyReports: 1247,
        snakeIdentifications: 856,
        hospitalSearches: 3421,
        educationalViews: 5689,
        successfulRescues: 894,
        smsAlertsSent: 3891
      },
      regionalData: [
        {
          region: 'Nairobi',
          emergencyCount: 345,
          commonSnakeSpecies: ['Black Mamba', 'Puff Adder']
        },
        {
          region: 'Mombasa',
          emergencyCount: 234,
          commonSnakeSpecies: ['Puff Adder', 'Green Mamba']
        },
        {
          region: 'Kisumu',
          emergencyCount: 189,
          commonSnakeSpecies: ['Boomslang', 'Puff Adder']
        }
      ],
      performance: {
        averageResponseTime: 4.2,
        systemUptime: 99.8,
        errorRate: 0.2
      }
    });

    await analyticsData.save();
    console.log('Analytics data created...');

    console.log('\n=== Database seeded successfully! ===');
    console.log('Admin user: admin@snaktox.org / admin123');
    console.log(`Created: ${snakeSpecies.length} snake species`);
    console.log(`Created: ${hospitals.length} hospitals`);
    console.log('Sample analytics data added');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Only run if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;