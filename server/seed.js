const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Queue = require('./models/Queue');

dotenv.config();

const doctors = [
  {
    name: 'Dr. Sarah Johnson',
    department: 'Cardiology',
    specialization: 'Interventional Cardiology',
    email: 'sarah.johnson@hospital.com',
    phone: '9876543210',
    available: true,
    avgConsultationTime: 20
  },
  {
    name: 'Dr. Michael Chen',
    department: 'Orthopedics',
    specialization: 'Joint Replacement',
    email: 'michael.chen@hospital.com',
    phone: '9876543211',
    available: true,
    avgConsultationTime: 15
  },
  {
    name: 'Dr. Priya Sharma',
    department: 'Pediatrics',
    specialization: 'Child Health',
    email: 'priya.sharma@hospital.com',
    phone: '9876543212',
    available: true,
    avgConsultationTime: 12
  },
  {
    name: 'Dr. Robert Williams',
    department: 'General Medicine',
    specialization: 'Internal Medicine',
    email: 'robert.williams@hospital.com',
    phone: '9876543213',
    available: true,
    avgConsultationTime: 15
  },
  {
    name: 'Dr. Emily Davis',
    department: 'Neurology',
    specialization: 'Neurological Disorders',
    email: 'emily.davis@hospital.com',
    phone: '9876543214',
    available: true,
    avgConsultationTime: 25
  }
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@hospital.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Staff Member',
    email: 'staff@hospital.com',
    password: 'staff123',
    role: 'staff',
    department: 'General Medicine'
  },
  {
    name: 'Nurse Reception',
    email: 'nurse@hospital.com',
    password: 'nurse123',
    role: 'staff',
    department: 'Cardiology'
  }
];

const samplePatients = [
  {
    name: 'John Doe',
    phone: '9123456780',
    email: 'john.doe@example.com',
    age: 45,
    gender: 'male',
    priority: 'medium',
    department: 'Cardiology',
    symptoms: 'Chest pain and shortness of breath',
    visitType: 'walk-in'
  },
  {
    name: 'Jane Smith',
    phone: '9123456781',
    email: 'jane.smith@example.com',
    age: 32,
    gender: 'female',
    priority: 'low',
    department: 'General Medicine',
    symptoms: 'Regular checkup',
    visitType: 'appointment'
  },
  {
    name: 'David Wilson',
    phone: '9123456782',
    email: 'david.wilson@example.com',
    age: 28,
    gender: 'male',
    priority: 'high',
    department: 'Orthopedics',
    symptoms: 'Severe knee pain after accident',
    visitType: 'walk-in'
  },
  {
    name: 'Maria Garcia',
    phone: '9123456783',
    email: 'maria.garcia@example.com',
    age: 5,
    gender: 'female',
    priority: 'emergency',
    department: 'Pediatrics',
    symptoms: 'High fever and difficulty breathing',
    visitType: 'walk-in'
  },
  {
    name: 'Robert Brown',
    phone: '9123456784',
    age: 65,
    gender: 'male',
    priority: 'high',
    department: 'Neurology',
    symptoms: 'Severe headache and dizziness',
    visitType: 'walk-in'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      Doctor.deleteMany({}),
      User.deleteMany({}),
      Patient.deleteMany({}),
      Queue.deleteMany({})
    ]);

    console.log('Existing data cleared');

    // Seed Doctors
    console.log('Seeding doctors...');
    const createdDoctors = await Doctor.insertMany(doctors);
    console.log(`${createdDoctors.length} doctors created`);

    // Seed Users
    console.log('Seeding users...');
    const createdUsers = [];
    for (const user of users) {
      const createdUser = await User.create(user);
      createdUsers.push(createdUser);
    }
    console.log(`${createdUsers.length} users created`);

    // Seed Sample Patients
    console.log('Seeding sample patients...');
    const departments = ['Cardiology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Neurology'];
    
    for (const dept of departments) {
      // Create queue for department
      await Queue.create({
        department: dept,
        date: new Date(),
        patients: [],
        totalServed: 0,
        status: 'active'
      });
    }

    // Create sample patients with tokens
    const patientsToCreate = samplePatients.map((patient, index) => {
      const deptCode = patient.department.substring(0, 3).toUpperCase();
      const timestamp = Date.now().toString().slice(-4);
      const counter = (index + 1).toString().padStart(3, '0');
      
      return {
        ...patient,
        token: `${deptCode}-${timestamp}-${counter}`,
        arrivalTime: new Date(Date.now() - (20 - index) * 60000), // Stagger arrival times
        position: index + 1,
        estimatedWaitTime: (index + 1) * 15
      };
    });

    const createdPatients = await Patient.insertMany(patientsToCreate);
    console.log(`${createdPatients.length} sample patients created`);

    // Update queues with patients
    for (const patient of createdPatients) {
      await Queue.findOneAndUpdate(
        { department: patient.department },
        { 
          $push: { patients: patient._id },
          $inc: { totalWaiting: 1 }
        }
      );
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@hospital.com / admin123');
    console.log('Staff: staff@hospital.com / staff123');
    console.log('Nurse: nurse@hospital.com / nurse123');
    
    console.log('\n👨‍⚕️ Sample Doctors:');
    createdDoctors.forEach(doc => {
      console.log(`- ${doc.name} (${doc.department})`);
    });

    console.log('\n🎫 Sample Patient Tokens:');
    createdPatients.forEach(patient => {
      console.log(`- ${patient.token} - ${patient.name} (${patient.department}) - Priority: ${patient.priority}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
