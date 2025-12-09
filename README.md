# 🏥 Intelligent Hospital Queue Management System

A real-time queue management system for **Sunrise Multispeciality Hospital** that reduces waiting times, prioritizes emergencies, and provides live updates.

## 🎯 Features

### Patient Features
- ✅ Walk-in registration & appointment check-in
- ✅ Auto token assignment with priority levels
- ✅ Real-time wait time estimates
- ✅ SMS/Email/WhatsApp notifications

### Staff Features
- ✅ Live dashboard with current queue status
- ✅ Mark patients as completed/skipped
- ✅ Emergency alerts
- ✅ Multiple department/doctor queues

### Admin Features
- ✅ Manage doctors and departments
- ✅ View all patient data
- ✅ Analytics dashboard
- ✅ System configuration

## 🚀 Tech Stack

- **Frontend:** React.js with modern hooks
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Real-time:** Socket.IO
- **Authentication:** JWT
- **Styling:** CSS with color palette from design

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Steps

1. **Clone and Install**
```bash
cd Hackathon
npm run install-all
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

4. **Run Application**
```bash
# Development mode (both frontend & backend)
npm run dev

# Or separately:
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

## 🗄️ Database Schema

### Patient Model
```javascript
{
  name: String,
  phone: String,
  email: String,
  age: Number,
  priority: Enum ['emergency', 'high', 'medium', 'low'],
  token: String,
  department: ObjectId,
  doctor: ObjectId,
  status: Enum ['waiting', 'in-progress', 'completed', 'skipped'],
  arrivalTime: Date,
  estimatedWaitTime: Number
}
```

### Doctor Model
```javascript
{
  name: String,
  department: String,
  specialization: String,
  available: Boolean,
  currentPatient: ObjectId,
  avgConsultationTime: Number
}
```

### Queue Model
```javascript
{
  department: String,
  patients: [ObjectId],
  currentToken: String,
  date: Date
}
```

## 🔌 API Endpoints

### Patient Routes
- `POST /api/patients/register` - Register walk-in patient
- `POST /api/patients/checkin` - Check-in appointment
- `GET /api/patients/:id` - Get patient details
- `GET /api/patients/token/:token` - Get by token

### Queue Routes
- `GET /api/queue/:department` - Get department queue
- `GET /api/queue/status/live` - Live queue status
- `POST /api/queue/next` - Call next patient
- `PUT /api/queue/complete/:id` - Mark patient complete

### Admin Routes
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/doctors` - Manage doctors
- `POST /api/admin/doctors` - Add doctor
- `GET /api/admin/analytics` - Dashboard data

## 🧮 Priority Algorithm

```javascript
Priority Levels:
- Emergency: Immediate (0 wait)
- High: 5 min average
- Medium: 15 min average
- Low: 30 min average

Algorithm:
1. Sort by priority level
2. Within same priority, sort by arrival time (FIFO)
3. Dynamic reordering when new emergency arrives
4. Estimated wait = position × avg consultation time
```

## 📱 Pages

1. **Patient Registration** (`/register`)
2. **Token Display Screen** (`/display`) - TV mode
3. **Staff Dashboard** (`/staff`)
4. **Admin Panel** (`/admin`)
5. **Queue List** (`/queue`)
6. **Emergency Fast-Track** (`/emergency`)

## 🎨 Color Palette

Based on provided design:
- Primary: `#F0E7E5` (Light beige)
- Secondary: `#EEDBD8` (Soft pink)
- Accent: `#E8D0D0` (Rose)
- Highlight: `#C6AFC6` (Light purple)
- Dark: `#9C93B5` (Purple)

## 🔔 Notifications

### SMS (Twilio)
- Token assigned
- Your turn in 3 patients
- Please proceed to consultation room

### Email
- Appointment confirmation
- Queue status update
- Doctor delay notification

### WhatsApp
- Token with QR code
- Live queue position

## 🧪 Sample Test Data

```javascript
// Run this to populate test data
npm run seed

// Creates:
- 5 Doctors (Cardiology, Orthopedics, Pediatrics, etc.)
- 20 Sample patients with various priorities
- Active queues for today
```

## 📊 WebSocket Events

```javascript
// Client → Server
'patient:registered' - New patient added
'patient:complete' - Mark patient done
'queue:refresh' - Request queue update

// Server → Client
'queue:updated' - Queue changed
'token:called' - Token being served
'emergency:alert' - Emergency patient arrived
```

## 🚢 Deployment

### Backend (Render/Railway/Heroku)
```bash
npm run build
npm start
```

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy 'build' folder
```

### Database (MongoDB Atlas)
- Create cluster
- Update MONGODB_URI in .env
- Whitelist IPs

## 🔐 Security

- JWT authentication for staff/admin
- Password hashing with bcrypt
- CORS configured
- Input validation
- Rate limiting on API routes

## 📈 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Video consultation integration
- [ ] Payment gateway
- [ ] Multi-language support
- [ ] Analytics with charts
- [ ] Appointment scheduling
- [ ] Patient history/EMR

## 👥 Team

Built for hackathon by Team Sunrise

## 📄 License

MIT License

---

**For judges:** This system demonstrates real-world problem solving with scalable architecture, clean code, and user-centric design.
