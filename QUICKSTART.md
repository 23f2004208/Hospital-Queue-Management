# 🚀 Quick Start Guide

## Installation

1. **Install backend dependencies:**
```bash
npm install
```

2. **Install frontend dependencies:**
```bash
cd client
npm install
cd ..
```

## Database Setup

1. **Start MongoDB** (if running locally):
```bash
mongod
```

Or use MongoDB Atlas (cloud):
- Create free cluster at https://www.mongodb.com/cloud/atlas
- Get connection string
- Update `MONGODB_URI` in `.env`

2. **Seed the database with sample data:**
```bash
node server/seed.js
```

This creates:
- 5 sample doctors
- 3 admin/staff users
- 5 sample patients
- Active queues for all departments

## Running the Application

### Development Mode (Recommended)

**Option 1: Run both frontend and backend together:**
```bash
npm run dev
```

**Option 2: Run separately:**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

### Production Mode

```bash
npm run build
npm start
```

## Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## Login Credentials

After running the seed script:

- **Admin:** admin@hospital.com / admin123
- **Staff:** staff@hospital.com / staff123
- **Nurse:** nurse@hospital.com / nurse123

## Testing the System

1. **Register a Patient:**
   - Go to http://localhost:3000/register
   - Fill in patient details
   - Select priority level
   - Get token number

2. **View Live Display:**
   - Go to http://localhost:3000/display
   - See real-time queue updates

3. **Staff Operations:**
   - Login at http://localhost:3000/login
   - Select department
   - Call next patient
   - Mark as complete/skip

4. **Admin Functions:**
   - Login as admin
   - Go to http://localhost:3000/admin
   - Manage doctors
   - View users

## Features Implemented

✅ Patient registration with priority levels
✅ Automatic token generation
✅ Smart queue prioritization algorithm
✅ Real-time updates using Socket.IO
✅ Staff dashboard for queue management
✅ Admin panel for system management
✅ Live TV display screen
✅ Patient status tracking
✅ JWT authentication
✅ Responsive design with hospital theme

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env file

**Port Already in Use:**
- Change PORT in .env file
- Or kill process: `npx kill-port 5000`

**Frontend Not Loading:**
- Clear browser cache
- Check if backend is running
- Verify proxy settings in vite.config.js

**Socket.IO Not Connecting:**
- Check firewall settings
- Verify CORS configuration
- Ensure both frontend and backend are running

## Project Structure

```
Hackathon/
├── server/
│   ├── models/         # MongoDB schemas
│   ├── controllers/    # Business logic
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth, error handling
│   ├── utils/          # Helper functions, queue algorithm
│   ├── config/         # Database config
│   ├── index.js        # Server entry point
│   └── seed.js         # Sample data script
├── client/
│   ├── src/
│   │   ├── pages/      # React pages
│   │   ├── context/    # Auth context
│   │   ├── utils/      # API, Socket utilities
│   │   ├── App.jsx     # Main app component
│   │   └── main.jsx    # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .env                # Environment variables
├── package.json        # Root dependencies
└── README.md          # This file
```

## API Endpoints

### Public Routes
- `POST /api/patients/register` - Register patient
- `GET /api/patients/token/:token` - Get patient by token
- `GET /api/queue/status/live` - Live queue status
- `GET /api/doctors` - List all doctors

### Protected Routes (Requires Auth)
- `POST /api/auth/login` - Staff/admin login
- `GET /api/patients` - Get all patients
- `POST /api/queue/next` - Call next patient
- `PUT /api/queue/complete/:id` - Complete patient
- `POST /api/doctors` - Add doctor (admin only)

## Next Steps

1. Configure Twilio for SMS notifications (optional)
2. Set up email service for notifications (optional)
3. Deploy to production (see deployment guide in README.md)
4. Add more analytics features
5. Implement appointment scheduling

## Support

For issues or questions:
- Check the main README.md
- Review error logs in console
- Verify all dependencies are installed
- Ensure MongoDB is running

---

**Happy Coding! 🏥💻**
